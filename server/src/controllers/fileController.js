
import { Readable } from 'stream';
import fileModel from '../models/fileModel.js';
import userModel from '../models/userModel.js';
import aiService from '../services/aiService.js';
import cryptoService from '../services/cryptoService.js';
import storageService from '../services/storageService.js';

export const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const file = req.file;
        const userId = req.user.id;

        // 1. AI Analysis
        const analysis = aiService.analyzeFile(file);
        if (!analysis.safe) {
            return res.status(400).json({
                message: 'File blocked by security policy',
                reason: analysis.reason
            });
        }

        // 2. Prepare Encryption
        const key = cryptoService.generateKey(analysis.keyLength);
        const iv = cryptoService.generateIV();

        // Create a readable stream from the buffer
        const fileStream = Readable.from(file.buffer);

        // Encrypt logic
        const encryptedStream = cryptoService.encryptStream(fileStream, key, iv, analysis.algo);

        // 3. Upload to GCS
        const gcsObjectName = `uploads/${userId}/${Date.now()}-${file.originalname}.enc`;
        await storageService.uploadToGCS(encryptedStream, gcsObjectName);

        // 4. Save Metadata to DB
        const fileId = fileModel.saveFileRecord({
            userId,
            filename: file.originalname,
            gcsObjectName,
            mimeType: analysis.mimeType,
            size: file.size,
            encryptionAlgo: analysis.algo,
            encryptedKey: key.toString('hex'),
            iv: iv.toString('hex')
        });

        res.status(201).json({
            message: 'File uploaded and encrypted successfully',
            fileId,
            encryption: analysis.algo
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
};

export const listFiles = (req, res) => {
    const userId = req.user.id;
    const files = fileModel.getFilesByUserId(userId);
    res.json(files);
};

export const downloadFile = async (req, res) => {
    const userId = req.user.id;
    const fileId = req.params.id;

    try {
        // Use checkAccess instead of direct ownership check
        const { access, file: fileRecord } = fileModel.checkAccess(fileId, userId);

        if (!access || !fileRecord) {
            return res.status(403).json({ message: 'Access denied or file not found' });
        }

        // Prepare Decryption
        const key = Buffer.from(fileRecord.encrypted_key, 'hex');
        const iv = Buffer.from(fileRecord.iv, 'hex');

        // Get GCS Stream
        const gcsStream = storageService.downloadFromGCS(fileRecord.gcs_object_name);

        // Decrypt Stream
        const decryptedStream = cryptoService.decryptStream(gcsStream, key, iv, fileRecord.encryption_algo);

        // Set Headers
        res.setHeader('Content-Disposition', `attachment; filename="${fileRecord.filename}"`);
        res.setHeader('Content-Type', fileRecord.mime_type);

        // Pipe response
        decryptedStream.pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Download failed', error: err.message });
    }
};

// --- Sharing Controllers ---

export const shareFile = (req, res) => {
    const { fileId, recipientEmail } = req.body;
    const ownerId = req.user.id;

    if (!fileId || !recipientEmail) {
        return res.status(400).json({ message: 'File ID and recipient email are required' });
    }

    try {
        const recipient = userModel.findUserByEmail(recipientEmail);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient user not found' });
        }

        if (recipient.id === ownerId) {
            return res.status(400).json({ message: 'You cannot share a file with yourself' });
        }

        fileModel.shareFile(fileId, recipient.id, ownerId);
        res.json({ message: `File shared successfully with ${recipient.username}` });

    } catch (err) {
        console.error('Share error:', err);
        res.status(400).json({ message: err.message });
    }
};

export const listSharedFiles = (req, res) => {
    const userId = req.user.id;
    const files = fileModel.getSharedFiles(userId);
    res.json(files);
};

export const deleteFile = async (req, res) => {
    const userId = req.user.id;
    const fileId = req.params.id;

    try {
        const file = fileModel.getFileById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (file.user_id !== userId) {
            return res.status(403).json({ message: 'Permission denied: You can only delete your own files' });
        }

        // 1. Delete from Storage
        try {
            await storageService.deleteFromStorage(file.gcs_object_name);
        } catch (storageErr) {
            console.error('Storage deletion error (continuing to DB cleanup):', storageErr);
        }

        // 2. Delete from DB
        fileModel.deleteFileRecord(fileId);

        res.json({ message: 'File deleted successfully' });

    } catch (err) {
        console.error('Delete error stack:', err.stack);
        res.status(500).json({ message: 'Failed to delete file', error: err.message });
    }
};

export const getFilePermissions = (req, res) => {
    const userId = req.user.id;
    const fileId = req.params.id;

    try {
        const file = fileModel.getFileById(fileId);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (file.user_id !== userId) {
            return res.status(403).json({ message: 'Permission denied' });
        }

        const permissions = fileModel.getPermissions(fileId);
        res.json(permissions);
    } catch (err) {
        console.error('Error fetching permissions:', err);
        res.status(500).json({ message: 'Failed to fetch permissions' });
    }
};

export const revokeAccess = (req, res) => {
    const ownerId = req.user.id;
    const { id: fileId, userId: targetUserId } = req.params;

    try {
        const file = fileModel.getFileById(fileId);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (file.user_id !== ownerId) {
            return res.status(403).json({ message: 'Permission denied' });
        }

        fileModel.revokePermission(fileId, targetUserId);
        res.json({ message: 'Access revoked successfully' });
    } catch (err) {
        console.error('Error revoking access:', err);
        res.status(500).json({ message: 'Failed to revoke access' });
    }
};

export const getFilesStatusForUser = (req, res) => {
    const ownerId = req.user.id;
    const { userId: targetUserId } = req.params;

    try {
        const files = fileModel.getFilesWithAccessStatus(ownerId, targetUserId);
        res.json(files);
    } catch (err) {
        console.error('Error fetching file status:', err);
        res.status(500).json({ message: 'Failed to fetch file status' });
    }
};

export default {
    uploadFile,
    listFiles,
    downloadFile,
    shareFile,
    listSharedFiles,
    deleteFile,
    getFilePermissions,
    revokeAccess,
    getFilesStatusForUser
};

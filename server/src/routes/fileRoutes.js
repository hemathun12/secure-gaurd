
import express from 'express';
import multer from 'multer';
import * as fileController from '../controllers/fileController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer to store in memory (for processing before upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/upload', authenticateToken, upload.single('file'), fileController.uploadFile);
router.get('/', authenticateToken, fileController.listFiles);
router.get('/shared', authenticateToken, fileController.listSharedFiles); // List shared files
router.post('/share', authenticateToken, fileController.shareFile);      // Share a file
router.get('/download/:id', authenticateToken, fileController.downloadFile);
router.delete('/:id', authenticateToken, fileController.deleteFile);
router.get('/:id/permissions', authenticateToken, fileController.getFilePermissions);
router.delete('/:id/permissions/:userId', authenticateToken, fileController.revokeAccess);
router.get('/status/:userId', authenticateToken, fileController.getFilesStatusForUser);


export default router;

import db from '../config/database.js';

export const saveFileRecord = (fileData) => {
    const {
        userId,
        filename,
        gcsObjectName,
        mimeType,
        size,
        encryptionAlgo, encryptedKey, iv, aiStatus
    } = fileData;

    const stmt = db.prepare(`
        INSERT INTO files (
            user_id, filename, gcs_object_name, mime_type, size, 
            encryption_algo, encrypted_key, iv, ai_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
        userId, filename, gcsObjectName, mimeType, size,
        encryptionAlgo, encryptedKey, iv, aiStatus || 'Safe'
    );

    return info.lastInsertRowid;
};

export const getFilesByUserId = (userId) => {
    const stmt = db.prepare('SELECT * FROM files WHERE user_id = ? ORDER BY upload_date DESC');
    return stmt.all(userId);
};

export const getFileById = (id) => {
    const stmt = db.prepare('SELECT * FROM files WHERE id = ?');
    return stmt.get(id);
};

// --- Storage Stats ---
export const getTotalStorageUsed = (userId) => {
    const stmt = db.prepare('SELECT SUM(size) as total_size FROM files WHERE user_id = ?');
    const result = stmt.get(userId);
    return result.total_size || 0;
};

// --- Sharing Features ---

export const shareFile = (fileId, recipientUserId, ownerId) => {
    // Check if user is owner
    const file = getFileById(fileId);
    if (!file || file.user_id !== ownerId) {
        throw new Error('Permission denied: You are not the owner of this file');
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO file_permissions (file_id, user_id, granted_by)
            VALUES (?, ?, ?)
        `);
        return stmt.run(fileId, recipientUserId, ownerId);
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw new Error('File is already shared with this user');
        }
        throw err;
    }
};

export const getSharedFiles = (userId) => {
    const stmt = db.prepare(`
        SELECT f.*, p.granted_by, u.username as owner_name
        FROM files f
        JOIN file_permissions p ON f.id = p.file_id
        JOIN users u ON f.user_id = u.id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
    `);
    return stmt.all(userId);
};

export const checkAccess = (fileId, userId) => {
    const file = getFileById(fileId);
    if (!file) return null;

    if (file.user_id === userId) return { access: true, file };

    const stmt = db.prepare('SELECT * FROM file_permissions WHERE file_id = ? AND user_id = ?');
    const permission = stmt.get(fileId, userId);

    if (permission) return { access: true, file };

    return { access: false, file };
};

export default {
    saveFileRecord,
    getFilesByUserId,
    getFileById,
    shareFile,
    getSharedFiles,
    checkAccess,
    deleteFileRecord: (fileId) => {
        const stmt = db.prepare('DELETE FROM files WHERE id = ?');
        return stmt.run(fileId);
    },
    getPermissions: (fileId) => {
        const stmt = db.prepare(`
            SELECT p.user_id, u.username, u.email, p.created_at
            FROM file_permissions p
            JOIN users u ON p.user_id = u.id
            WHERE p.file_id = ?
        `);
        return stmt.all(fileId);
    },
    revokePermission: (fileId, userId) => {
        const stmt = db.prepare('DELETE FROM file_permissions WHERE file_id = ? AND user_id = ?');
        return stmt.run(fileId, userId);
    },
    getFilesWithAccessStatus: (ownerId, targetUserId) => {
        const stmt = db.prepare(`
            SELECT f.*, 
                   CASE WHEN p.user_id IS NOT NULL THEN 1 ELSE 0 END as is_shared
            FROM files f
            LEFT JOIN file_permissions p ON f.id = p.file_id AND p.user_id = ?
            WHERE f.user_id = ?
            ORDER BY f.upload_date DESC
        `);
        return stmt.all(targetUserId, ownerId);
    },
    getTotalStorageUsed
};

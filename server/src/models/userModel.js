
import db from '../config/database.js';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

import crypto from 'crypto';

export const createUser = (username, email, password) => {
    const hash = bcrypt.hashSync(password, SALT_ROUNDS);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    try {
        const stmt = db.prepare('INSERT INTO users (username, email, password_hash, is_verified, verification_token) VALUES (?, ?, ?, 1, ?)');
        const info = stmt.run(username, email, hash, verificationToken);
        return { id: info.lastInsertRowid, username, email, verificationToken };
    } catch (err) {
        throw err;
    }
};

export const setResetToken = (userId, token, expiry) => {
    const stmt = db.prepare('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?');
    stmt.run(token, expiry, userId);
};

export const findUserByResetToken = (token) => {
    const stmt = db.prepare('SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > CURRENT_TIMESTAMP');
    return stmt.get(token);
};

export const updatePassword = (userId, newPassword) => {
    const hash = bcrypt.hashSync(newPassword, SALT_ROUNDS);
    const stmt = db.prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?');
    stmt.run(hash, userId);
};

export const findUserByEmail = (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
};

export const findUserById = (id) => {
    const stmt = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?');
    return stmt.get(id);
};

export const findUserAuthData = (id) => {
    const stmt = db.prepare('SELECT id, password_hash FROM users WHERE id = ?');
    return stmt.get(id);
};

export const searchUsers = (query, currentUserId) => {
    const stmt = db.prepare(`
        SELECT u.id, u.username, u.email, GROUP_CONCAT(f.filename) as authorized_files
        FROM users u
        LEFT JOIN file_permissions p ON u.id = p.user_id
        LEFT JOIN files f ON p.file_id = f.id AND f.user_id = ?
        WHERE (u.username LIKE ? OR u.email LIKE ?)
        GROUP BY u.id
        LIMIT 10
    `);
    const searchPattern = `%${query}%`;
    // We pass currentUserId first for the f.user_id check, then the search patterns
    return stmt.all(currentUserId, searchPattern, searchPattern);
};

export const validatePassword = (user, password) => {
    return bcrypt.compareSync(password, user.password_hash);
};

export const deleteUser = (userId) => {
    const deleteTransaction = db.transaction(() => {
        // 1. Delete permissions granted BY this user
        db.prepare('DELETE FROM file_permissions WHERE granted_by = ?').run(userId);

        // 2. Delete permissions granted TO this user
        db.prepare('DELETE FROM file_permissions WHERE user_id = ?').run(userId);

        // 3. Delete files owned by this user
        // Note: Physical file deletion should ideally happen before this or via a separate cleanup process
        // For now, we'll delete the DB records. The controller should handle physical deletion if possible,
        // or we rely on the orphan file cleanup (if implemented).
        // Since we don't have bulk physical delete easily here without iterating, 
        // we'll rely on the controller to list and delete physical files first if needed, 
        // or just accept they might be orphaned in storage for now.
        // BETTER APPROACH: The controller should retrieve files, delete from storage, then call this.
        // But for transaction safety, we just delete DB records here.

        // Get IDs of files to delete related permissions (cascade check) - alrady handled by step 1/2?
        // Actually step 1/2 handles permissions table. 
        // We also need to delete permissions for files owned by this user (where foreign key matches file_id)
        // SQLite doesn't support JOIN in DELETE, so:
        db.prepare(`
            DELETE FROM file_permissions 
            WHERE file_id IN (SELECT id FROM files WHERE user_id = ?)
        `).run(userId);

        // Now delete the files
        db.prepare('DELETE FROM files WHERE user_id = ?').run(userId);

        // 4. Delete the user
        db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    });

    try {
        deleteTransaction();
        return true;
    } catch (err) {
        console.error('Delete user transaction failed:', err);
        throw err;
    }
};

export default {
    createUser,
    findUserByEmail,
    findUserById,
    findUserAuthData,
    searchUsers,
    validatePassword,
    deleteUser,
    setResetToken,
    findUserByResetToken,
    updatePassword
};

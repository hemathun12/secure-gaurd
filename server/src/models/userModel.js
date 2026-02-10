
import db from '../config/database.js';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const createUser = (username, email, password) => {
    const hash = bcrypt.hashSync(password, SALT_ROUNDS);
    try {
        const stmt = db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
        const info = stmt.run(username, email, hash);
        return { id: info.lastInsertRowid, username, email };
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw new Error('Username or email already exists');
        }
        throw err;
    }
};

export const findUserByEmail = (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
};

export const findUserById = (id) => {
    const stmt = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?');
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

export default {
    createUser,
    findUserByEmail,
    findUserById,
    searchUsers,
    validatePassword
};

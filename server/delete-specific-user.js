import { Database } from 'bun:sqlite';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

const targetUsername = 'Franklin Deepak';

console.log(`Starting deletion for: ${targetUsername}`);

const deleteUser = db.transaction(() => {
    const user = db.prepare("SELECT id FROM users WHERE username = ?").get(targetUsername);

    if (!user) {
        console.log('User not found.');
        return;
    }

    console.log(`Deleting user ID: ${user.id}`);

    // Delete permissions granted BY this user
    db.prepare('DELETE FROM file_permissions WHERE granted_by = ?').run(user.id);

    // Delete permissions granted TO this user
    db.prepare('DELETE FROM file_permissions WHERE user_id = ?').run(user.id);

    // Delete permissions for files owned by this user
    db.prepare(`
        DELETE FROM file_permissions 
        WHERE file_id IN (SELECT id FROM files WHERE user_id = ?)
    `).run(user.id);

    // Delete files owned by this user
    db.prepare('DELETE FROM files WHERE user_id = ?').run(user.id);

    // Delete the user
    db.prepare('DELETE FROM users WHERE id = ?').run(user.id);
});

try {
    deleteUser();
    console.log('Deletion complete.');
} catch (err) {
    console.error('Deletion failed:', err);
}

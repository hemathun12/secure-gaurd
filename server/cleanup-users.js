import { Database } from 'bun:sqlite';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

console.log('Starting cleanup...');

// Start a transaction
const deleteOtherUsers = db.transaction(() => {
    // 1. Get IDs of users to delete (everyone except 'Hemath')
    const usersToDelete = db.prepare("SELECT id, username FROM users WHERE LOWER(username) != 'hemath'").all();

    console.log(`Found ${usersToDelete.length} users to delete.`);

    for (const user of usersToDelete) {
        console.log(`Deleting user: ${user.username} (ID: ${user.id})`);

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
    }
});

try {
    deleteOtherUsers();
    console.log('Cleanup complete.');

    // List remaining users
    const remainingUsers = db.prepare('SELECT id, username, email FROM users').all();
    console.log('Remaining users:');
    console.table(remainingUsers);
} catch (err) {
    console.error('Cleanup failed:', err);
}

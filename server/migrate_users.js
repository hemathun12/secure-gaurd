import db from './src/config/database.js';

console.log('Running migration...');

try {
    // Add is_verified column
    try {
        db.exec("ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0");
        console.log('Added is_verified column.');

        // Mark existing users as verified
        db.exec("UPDATE users SET is_verified = 1 WHERE is_verified = 0");
        console.log('Marked existing users as verified.');
    } catch (err) {
        if (err.message.includes('duplicate column')) {
            console.log('is_verified column already exists.');
        } else {
            console.error('Error adding is_verified:', err);
        }
    }

    // Add verification_token column
    try {
        db.exec("ALTER TABLE users ADD COLUMN verification_token TEXT");
        console.log('Added verification_token column.');
    } catch (err) {
        if (err.message.includes('duplicate column')) {
            console.log('verification_token column already exists.');
        } else {
            console.error('Error adding verification_token:', err);
        }
    }

    console.log('Migration complete.');
} catch (err) {
    console.error('Migration failed:', err);
}

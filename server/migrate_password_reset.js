import db from './src/config/database.js';

console.log('Running password reset migration...');

try {
    // Add reset_token column
    try {
        db.exec("ALTER TABLE users ADD COLUMN reset_token TEXT");
        console.log('Added reset_token column.');
    } catch (err) {
        if (err.message.includes('duplicate column')) {
            console.log('reset_token column already exists.');
        } else {
            console.error('Error adding reset_token:', err);
        }
    }

    // Add reset_token_expiry column
    try {
        db.exec("ALTER TABLE users ADD COLUMN reset_token_expiry DATETIME");
        console.log('Added reset_token_expiry column.');
    } catch (err) {
        if (err.message.includes('duplicate column')) {
            console.log('reset_token_expiry column already exists.');
        } else {
            console.error('Error adding reset_token_expiry:', err);
        }
    }

    console.log('Migration complete.');
} catch (err) {
    console.error('Migration failed:', err);
}

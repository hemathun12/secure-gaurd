const userModel = require('./src/models/userModel.js').default; // Adjust import based on export
const db = require('./src/config/database.js').default;

// Need to mock or use the actual models.
// Since userModel uses ES modules, I should use .mjs or bun runs .js as module.

// Let's write a simple script that imports the model and creates a user.
import { createUser } from './src/models/userModel.js';

try {
    const user = createUser('admin', 'admin@example.com', 'password123');
    console.log('User created:', user);
} catch (err) {
    if (err.message.includes('already exists')) {
        console.log('User admin already exists (which is fine)');
    } else {
        console.error('Error creating user:', err);
    }
}

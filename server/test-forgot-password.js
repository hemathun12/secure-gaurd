import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'hemathun12@gmail.com'; // Existing user 'Hemath'

async function testForgotPassword() {
    console.log(`Testing Forgot Password for: ${TEST_EMAIL}`);
    try {
        const response = await axios.post(`${API_URL}/auth/forgot-password`, { email: TEST_EMAIL });
        console.log('Response:', response.data.message);

        console.log('Waiting for email log...');
        setTimeout(() => {
            const logPath = path.join(process.cwd(), 'logs', 'verification.log');
            if (fs.existsSync(logPath)) {
                const logs = fs.readFileSync(logPath, 'utf-8');
                const lastLines = logs.split('\n').slice(-5).join('\n');
                console.log('Recent logs:\n', lastLines);
            } else {
                console.log('Log file not found.');
            }
        }, 3000);
    } catch (err) {
        console.error('Error:', err.response?.data || err.message);
    }
}

testForgotPassword();

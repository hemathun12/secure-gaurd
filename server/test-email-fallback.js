import dotenv from 'dotenv';
dotenv.config();

import { sendVerificationEmail } from './src/services/emailService.js';

async function testEmailFallback() {
    console.log('Testing email verification fallback...');
    const testEmail = 'test_fallback@example.com';
    const testToken = 'test-token-' + Date.now();

    await sendVerificationEmail(testEmail, testToken);

    console.log('\nVerification complete. Please check:');
    console.log('1. Server console output above.');
    console.log('2. server/logs/verification.log file.');
}

testEmailFallback();

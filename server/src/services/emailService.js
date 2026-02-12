import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Helper to log to file
const logToFile = (message) => {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path.join(logDir, 'verification.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
};

// Singleton transporter
let transporter;

const getTransporter = async () => {
    if (transporter) return transporter;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log('Using configured Gmail credentials for email service.');
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    } else {
        console.warn('Email credentials not configured. Creating Ethereal test account...');
        try {
            const testAccount = await nodemailer.createTestAccount();
            console.log('Ethereal Test Account Created:', testAccount.user);
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            // Attach test account info for link generation
            transporter.isTest = true;
        } catch (error) {
            console.error('Failed to create test account:', error);
            return null;
        }
    }
    return transporter;
};

export const sendShareNotification = async (toEmail, sharedByUsername, filename) => {
    const currentTransporter = await getTransporter();
    if (!currentTransporter) return;

    const from = process.env.EMAIL_USER || 'noreply@secureguard.com';

    const mailOptions = {
        from,
        to: toEmail,
        subject: `File Shared: ${filename}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">New File Shared With You</h2>
                <p>Hello,</p>
                <p><strong>${sharedByUsername}</strong> has shared a file with you:</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-weight: bold; font-size: 16px;">${filename}</p>
                </div>
                <p>Log in to your SecureGuard account to access this file.</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                <p style="color: #6b7280; font-size: 12px;">Secure File Guardian Notification</p>
            </div>
        `
    };

    try {
        const info = await currentTransporter.sendMail(mailOptions);
        console.log(`Share notification sent to ${toEmail}`);
        if (currentTransporter.isTest) {
            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log('SHARE PREVIEW URL: %s', previewUrl);
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const sendPasswordResetEmail = async (toEmail, token) => {
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    console.log('------------------------------------------');
    console.log('PASSWORD RESET LINK (DEV ONLY):', resetLink);
    console.log('------------------------------------------');

    logToFile(`Password reset link for ${toEmail}: ${resetLink}`);

    const currentTransporter = await getTransporter();
    if (!currentTransporter) return;

    const from = process.env.EMAIL_USER || 'noreply@secureguard.com';

    const mailOptions = {
        from,
        to: toEmail,
        subject: 'Reset Your Password - Secure File Guardian',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Password Reset Request</h2>
                <p>You requested to reset your password for Secure File Guardian.</p>
                <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
                <div style="margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="color: #6b7280; word-break: break-all;">${resetLink}</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                <p style="color: #6b7280; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
        `
    };

    try {
        const info = await currentTransporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${toEmail}`);
        if (currentTransporter.isTest) {
            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log('PASSWORD RESET PREVIEW URL: %s', previewUrl);
            logToFile(`ETHEREAL RESET PREVIEW URL: ${previewUrl}`);
        }
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};

export default {
    sendShareNotification,
    sendPasswordResetEmail
};


import userModel from '../models/userModel.js';
import { generateToken } from '../middleware/authMiddleware.js';
import crypto from 'crypto';
import emailService from '../services/emailService.js';

export const register = async (req, res) => {
    console.log('Register request body:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = userModel.createUser(username, email, password);

        res.status(201).json({
            message: 'Registration successful. You can now log in.'
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(400).json({ message: err.message });
    }
};

export const login = (req, res) => {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = userModel.findUserByEmail(email);

    if (!user || !userModel.validatePassword(user, password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }



    const token = generateToken(user);
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
};

export const logout = (req, res) => {
    // Client side handles token removal.
    res.json({ message: 'Logged out successfully' });
};

export const getMe = (req, res) => {
    // req.user is set by middleware
    const user = userModel.findUserById(req.user.id);
    if (!user) return res.sendStatus(404);
    res.json(user);
}

export const verifyPassword = (req, res) => {
    const { password } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        const userAuth = userModel.findUserAuthData(userId);
        if (!userAuth || !userModel.validatePassword(userAuth, password)) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        res.json({ message: 'Password verified' });
    } catch (err) {
        console.error('Password verification error:', err);
        res.status(500).json({ message: 'Verification failed' });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = userModel.findUserByEmail(email);
        if (!user) {
            // Send 200 even if user doesn't exist for security
            return res.json({ message: 'If an account with that email exists, we have sent a reset link.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

        userModel.setResetToken(user.id, resetToken, expiry);
        await emailService.sendPasswordResetEmail(user.email, resetToken);

        res.json({ message: 'If an account with that email exists, we have sent a reset link.' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ message: 'Failed to process request' });
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required' });
    }

    try {
        const user = userModel.findUserByResetToken(token);
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        userModel.updatePassword(user.id, newPassword);
        res.json({ message: 'Password reset successful. You can now log in with your new password.' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ message: 'Failed to reset password' });
    }
};


import userModel from '../models/userModel.js';
import { generateToken } from '../middleware/authMiddleware.js';

export const register = (req, res) => {
    console.log('Register request body:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = userModel.createUser(username, email, password);
        const token = generateToken(user);
        res.status(201).json({ token, user: { id: user.id, username, email } });
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

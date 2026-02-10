
import express from 'express';
import userModel from '../models/userModel.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Controller functions
const searchUsers = (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = userModel.searchUsers(q, req.user.id);
    res.json(users);
};

// Routes
router.get('/search', authenticateToken, searchUsers);

export default router;

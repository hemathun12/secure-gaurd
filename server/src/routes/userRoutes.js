
import express from 'express';
import userController from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes
router.get('/search', authenticateToken, userController.searchUsers);
router.delete('/me', authenticateToken, userController.deleteUser);

export default router;

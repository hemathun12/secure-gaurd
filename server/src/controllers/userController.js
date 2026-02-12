import userModel from '../models/userModel.js';

export const searchUsers = (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);

    try {
        const users = userModel.searchUsers(q, req.user.id);
        res.json(users);
    } catch (err) {
        console.error('Search users error:', err);
        res.status(500).json({ message: 'Search failed' });
    }
};

export const deleteUser = (req, res) => {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required to delete account' });
    }

    try {
        // 1. Verify Password
        const userAuth = userModel.findUserAuthData(userId);
        if (!userAuth || !userModel.validatePassword(userAuth, password)) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // 2. Delete User Data
        userModel.deleteUser(userId);

        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ message: 'Failed to delete account' });
    }
};

export default {
    searchUsers,
    deleteUser
};

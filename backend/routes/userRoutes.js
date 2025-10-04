import express from 'express';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// Protected route: Dashboard
router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}, this is your dashboard.` });
});

export default router;
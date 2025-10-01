import express from 'express';
import { 
  register, 
  login, 
  refreshToken, 
  logout, 
  logoutAll, 
  sendOtp, 
  verifyOtp, 
  resetPassword 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/logout-all', authenticateToken, logoutAll);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;
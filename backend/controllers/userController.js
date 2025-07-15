import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const getUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      const error = new Error('No token provided');
      error.status = 401;
      throw error;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    res.json({ firstName: user.firstName, lastName: user.lastName, email: user.email, createdAt: user.createdAt });
  } catch (error) {
    next(error);
  }
};
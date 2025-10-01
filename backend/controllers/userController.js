import User from '../models/User.js';

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    res.json({ 
      id: user._id,
      firstName: user.firstName, 
      lastName: user.lastName, 
      email: user.email, 
      createdAt: user.createdAt 
    });
  } catch (error) {
    next(error);
  }
};
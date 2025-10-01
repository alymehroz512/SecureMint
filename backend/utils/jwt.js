import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import RefreshToken from '../models/RefreshToken.js';

// Generate access token (short-lived)
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // 15 minutes
  );
};

// Generate refresh token (long-lived)
export const generateRefreshToken = async (userId) => {
  // Create a random token
  const token = crypto.randomBytes(64).toString('hex');
  
  // Set expiration to 7 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  // Save to database
  const refreshToken = new RefreshToken({
    token,
    userId,
    expiresAt,
  });
  
  await refreshToken.save();
  return token;
};

// Verify access token
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

// Verify refresh token
export const verifyRefreshToken = async (token) => {
  try {
    const refreshToken = await RefreshToken.findOne({ token }).populate('userId');
    
    if (!refreshToken) {
      throw new Error('Invalid refresh token');
    }
    
    if (refreshToken.expiresAt < new Date()) {
      // Clean up expired token
      await RefreshToken.deleteOne({ _id: refreshToken._id });
      throw new Error('Refresh token expired');
    }
    
    return refreshToken;
  } catch (error) {
    throw new Error(error.message || 'Invalid refresh token');
  }
};

// Remove refresh token
export const removeRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};

// Remove all refresh tokens for a user (logout from all devices)
export const removeAllRefreshTokens = async (userId) => {
  await RefreshToken.deleteMany({ userId });
};
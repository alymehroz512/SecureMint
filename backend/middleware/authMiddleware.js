import { verifyAccessToken } from '../utils/jwt.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      message: 'Access token required',
      code: 'TOKEN_REQUIRED'
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ 
      message: error.message,
      code: 'TOKEN_INVALID'
    });
  }
};

// Optional middleware for routes that work with or without authentication
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      req.userId = decoded.userId;
    } catch (error) {
      // Token is invalid but we don't reject the request
      req.userId = null;
    }
  }
  
  next();
};
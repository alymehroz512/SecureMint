import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}\nStack: ${err.stack}`);

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({
      message: 'Validation error',
      errors,
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `Duplicate value for ${field}`,
    });
  }

  // Handle JWT errors
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }

  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      message: 'Token has expired',
    });
  }

  // Handle generic errors
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
};

export default errorHandler;
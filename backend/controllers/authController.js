import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { sendOtpEmail } from '../utils/email.js';
import { generateOtp } from '../utils/generateOtp.js';

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already exists');
      error.status = 400;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Email not found');
      error.status = 400;
      throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Password incorrect');
      error.status = 400;
      throw error;
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Email not found');
      error.status = 400;
      throw error;
    }
    const otp = generateOtp();
    await Otp.create({ email, otp });
    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      const error = new Error('Invalid or expired OTP');
      error.status = 400;
      throw error;
    }
    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      const error = new Error('Invalid or expired OTP');
      error.status = 400;
      throw error;
    }
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User not found');
      error.status = 400;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await Otp.deleteOne({ email, otp });
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};
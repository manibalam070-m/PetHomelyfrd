import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ErrorHandler from '../utils/errorHandler.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return next(new ErrorHandler('Please login to access this resource', 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return next(new ErrorHandler('User not found', 404));
    next();
  } catch (error) {
    next(new ErrorHandler('Invalid or expired token', 401));
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ErrorHandler(`Role '${req.user.role}' is not allowed`, 403));
  }
  next();
};
import ErrorHandler from '../utils/errorHandler.js';

export const notFound = (req, res, next) => {
  next(new ErrorHandler(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };
  error.statusCode = err.statusCode || 500;

  // Mongoose CastError
  if (err.name === 'CastError') {
    error = new ErrorHandler(`Resource not found. Invalid: ${err.path}`, 400);
  }
  if (err.code === 11000) {
    error = new ErrorHandler(`Duplicate field value: ${Object.keys(err.keyValue)}`, 400);
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    error = new ErrorHandler(message, 400);
  }
  if (err.name === 'JsonWebTokenError') {
    error = new ErrorHandler('Invalid JSON Web Token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new ErrorHandler('JSON Web Token expired', 401);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
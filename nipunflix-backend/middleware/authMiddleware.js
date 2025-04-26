const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes with JWT authentication
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        message: 'Not authenticated. Please login' 
      });
    }

    // Verify access token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).select('+passwordChangedAt');

    if (!user) {
      return res.status(401).json({ 
        message: 'User belonging to this token no longer exists' 
      });
    }

    // Check if user changed password after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({ 
        message: 'Password changed recently. Please log in again' 
      });
    }

    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({
      message: 'Authentication failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : null
    });
  }
};

// Role-based authorization
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Check email verification status
const verifiedOnly = (req, res, next) => {
  if (!req.user.verified) {
    return res.status(403).json({
      message: 'Please verify your email address'
    });
  }
  next();
};

module.exports = { 
  protect, 
  restrictTo, 
  verifiedOnly 
};
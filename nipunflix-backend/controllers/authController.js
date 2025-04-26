const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

// Generate tokens with refresh token support
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m'
  });
  
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
  
  return { accessToken, refreshToken };
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check existing user using index
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    }).collation({ locale: 'en', strength: 2 });

    if (existingUser) {
      return res.status(409).json({ 
        message: 'User already exists with this email or username' 
      });
    }

    // Create user with email verification token
    const user = await User.create({
      username,
      email,
      password,
      emailVerificationToken: crypto.randomBytes(32).toString('hex')
    });

    // Send verification email
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${user.emailVerificationToken}`;
    
    await sendEmail({
      email: user.email,
      subject: 'Verify your Nipunflix account',
      html: `Click <a href="${verificationUrl}">here</a> to verify your email`
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      accessToken,
      refreshToken,
      verified: user.verified
    });

  } catch (error) {
    res.status(400).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : null
    });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password +loginAttempts +accountLocked');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    if (user.accountLocked) {
      return res.status(403).json({
        message: 'Account locked. Please reset your password'
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        message: 'Please verify your email address'
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      accessToken,
      refreshToken,
      verified: user.verified
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : null
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const { accessToken } = generateTokens(user._id);

    res.json({ accessToken });

  } catch (error) {
    res.status(401).json({ 
      message: 'Invalid refresh token',
      error: error.message 
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token with expiration
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send email with reset token
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      html: `Submit a PATCH request with your new password to: ${resetUrl}`
    });

    res.status(200).json({ 
      message: 'Password reset instructions sent to email' 
    });

  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : null
    });
  }
};
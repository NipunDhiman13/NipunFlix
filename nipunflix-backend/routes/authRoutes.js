const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  refreshToken,
  forgotPassword,
  authLimiter
} = require('../controllers/authController');
const { protect, restrictTo, verifiedOnly } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.use(protect); // Applies to all routes below

router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Successfully logged out' });
});

// Admin-only routes
router.use(restrictTo('admin'));

router.get('/users', async (req, res) => {
  // Implementation to get all users
});

module.exports = router;
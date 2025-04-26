const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateProfile,
  deleteUser,
  updatePassword
} = require('../controllers/userController');

// Public routes (if any)
// router.get('/public-profile/:id', getPublicProfile);

// Protected routes
router.use(protect);

router.route('/me')
  .get(getUserProfile)
  .patch(updateProfile)
  .delete(deleteUser);

router.patch('/update-password', updatePassword);

// Admin management routes
router.use(restrictTo('admin'));

router.route('/')
  .get(async (req, res) => {
    // Implementation to get all users (admin only)
  });

router.route('/:id')
  .get(async (req, res) => {
    // Implementation to get user by ID (admin only)
  })
  .patch(async (req, res) => {
    // Implementation to update user (admin only)
  })
  .delete(async (req, res) => {
    // Implementation to delete user (admin only)
  });

module.exports = router;
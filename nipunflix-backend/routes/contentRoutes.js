const express = require('express');
const router = express.Router();
const { protect, restrictTo, verifiedOnly } = require('../middleware/authMiddleware');
const {
  getContent,
  createContent,
  updateContent,
  deleteContent
} = require('../controllers/contentController');

// Public routes
router.get('/', getContent);
router.get('/:id', getContent);

// Protected routes
router.use(protect, verifiedOnly);

// Content creation/modification routes
router.use(restrictTo('admin', 'content-moderator'));

router.post('/', createContent);
router.patch('/:id', updateContent);
router.delete('/:id', deleteContent);

// User-specific content routes
router.get('/my-content', restrictTo('admin', 'content-moderator'), (req, res) => {
  // Implementation for user's created content
});

module.exports = router;
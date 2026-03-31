const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  toggleBookmark,
  getBookmarkedPosts
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/bookmarks').get(protect, getBookmarkedPosts);
router.route('/bookmarks/:postId').post(protect, toggleBookmark);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getCommentsByPost,
  addComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/post/:postId')
  .get(getCommentsByPost)
  .post(protect, addComment);

router.route('/:id')
  .delete(protect, deleteComment);

module.exports = router;

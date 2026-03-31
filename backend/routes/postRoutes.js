const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPosts)
  .post(protect, upload.single('image'), createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, upload.single('image'), updatePost)
  .delete(protect, deletePost);

router.put('/:id/like', protect, likePost);

module.exports = router;

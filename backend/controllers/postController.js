const Post = require('../models/Post');

const getPosts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? { title: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const count = await Post.countDocuments({ ...keyword });
    const posts = await Post.find({ ...keyword })
      .populate('author', 'username profilePicture')
      .populate('category', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ posts, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'username profilePicture')
      .populate('category', 'name');

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    let image = '';
    
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const post = new Post({
      title,
      content,
      author: req.user._id,
      image,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const post = await Post.findById(req.params.id);

    if (post) {
      if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this post' });
      }

      post.title = title || post.title;
      post.content = content || post.content;
      post.category = category || post.category;
      if (req.file) {
        post.image = `/uploads/${req.file.filename}`;
      }
      if (tags) {
        post.tags = tags.split(',').map(tag => tag.trim());
      }

      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this post' });
      }
      await Post.deleteOne({ _id: post._id });
      res.json({ message: 'Post removed' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      if (post.likes.includes(req.user._id)) {
        // Unlike block
        post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
      } else {
        // Like block
        post.likes.push(req.user._id);
      }
      
      const updatedPost = await post.save();
      // Keep populated fields
      await updatedPost.populate('author', 'username profilePicture');
      await updatedPost.populate('category', 'name');
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost
};

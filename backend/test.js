const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const connectDB = require('./config/db');
require('dotenv').config();

const runTest = async () => {
  try {
    await connectDB();
    const user = await User.findOne({ email: 'admin@example.com' });
    const post = await Post.findOne();
    
    if (!user || !post) {
      console.log('User or Post not found. Seed the db first.');
      process.exit();
    }
    
    console.log('Post ID:', post._id.toString());
    console.log('User bookmarks before:', user.bookmarks);
    
    const isBookmarked = user.bookmarks.some(id => id.toString() === post._id.toString());
    console.log('isBookmarked logic:', isBookmarked);
    
    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== post._id.toString());
    } else {
      user.bookmarks.push(post._id);
    }
    
    await user.save();
    console.log('User bookmarks after save:', user.bookmarks);
    console.log('TEST PASSED SUCCESSFULLY');
    process.exit(0);
  } catch (error) {
    console.error('TEST FAILED:', error.message);
    process.exit(1);
  }
};

runTest();

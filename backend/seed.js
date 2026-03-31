const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Post = require('./models/Post');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Category.deleteMany();
    await Post.deleteMany();

    // Create User
    const adminUser = await User.create({
      username: 'admin_user',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      bio: 'Administrator of the Blog Platform'
    });

    const standardUser = await User.create({
      username: 'jane_doe',
      email: 'jane@example.com',
      password: 'password123',
      role: 'user',
      bio: 'Enthusiastic writer and reader.'
    });

    // Create Categories
    const techCategory = await Category.create({
      name: 'Technology',
      description: 'All about the latest in technology'
    });

    const lifestyleCategory = await Category.create({
      name: 'Lifestyle',
      description: 'Tips and tricks for everyday life'
    });

    // Create Posts
    await Post.insertMany([
      {
        title: 'Getting Started with the MERN Stack',
        content: '<p>The MERN stack is an excellent choice for modern web applications. By using MongoDB, Express, React, and Node.js, you get a full JavaScript stack.</p>',
        author: adminUser._id,
        category: techCategory._id,
        tags: ['webdev', 'mern', 'javascript']
      },
      {
        title: 'Why React 18 is a Game Changer',
        content: '<p>React 18 brought many concurrent features that make UI updates much smoother. The new root API and automatic batching are fantastic additions.</p>',
        author: standardUser._id,
        category: techCategory._id,
        tags: ['react', 'frontend', 'javascript']
      },
      {
        title: 'Morning Routine for Productivity',
        content: '<p>Starting your day with a solid routine can set the tone for maximum productivity. Wake up early, hydrate, and outline your top 3 tasks for the day.</p>',
        author: standardUser._id,
        category: lifestyleCategory._id,
        tags: ['productivity', 'health', 'morning']
      }
    ]);

    console.log('Dummy Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding data: ${error}`);
    process.exit(1);
  }
};

seedData();

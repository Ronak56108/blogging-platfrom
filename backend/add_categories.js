const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const connectDB = require('./config/db');

dotenv.config();

const addCategories = async () => {
  try {
    await connectDB();
    
    // Add a variety of new categories
    await Category.insertMany([
      { name: 'Travel', description: 'Explore the world, travel guides, and experiences' },
      { name: 'Food', description: 'Delicious recipes, restaurant reviews, and cooking tips' },
      { name: 'Health', description: 'Tips for a healthy life, fitness, and mental wellbeing' },
      { name: 'Finance', description: 'Money management, investing, and personal finance' },
      { name: 'Entertainment', description: 'Movies, music, pop culture, and gaming' },
      { name: 'Photography', description: 'Camera reviews, tutorials, and photo galleries' },
      { name: 'Coding', description: 'Programming tutorials, languages, and open source' }
    ]);

    console.log('Additional categories added successfully!');
    process.exit();
  } catch (error) {
    if (error.code === 11000) {
      console.log('Some of these categories already exist in the database.');
    } else {
      console.error(`Error adding categories: ${error}`);
    }
    process.exit(1);
  }
};

addCategories();

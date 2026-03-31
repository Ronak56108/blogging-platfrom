const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const checkPassword = async () => {
  try {
    await connectDB();
    const user = await User.findOne({ email: 'admin@example.com' });
    if (!user) return console.log('User not found');
    
    console.log('Hash in DB:', user.password);
    const isMatch = await user.matchPassword('password123');
    console.log('Does password123 match?', isMatch);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkPassword();

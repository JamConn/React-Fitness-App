// Replace import with require for dotenv
const dotenv = require('dotenv');
dotenv.config();

// Replace import with require for mongoose
const mongoose = require('mongoose');

// Replace import with require for models/Users
const users = require('../models/Users');

// Replace import with require for models/User
const User = require('../models/User');

async function initializeDatabase() {
  if (process.env.NODE_ENV !== 'development') {
    console.log('This script is only for the development environment.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_DB);
    
    // Fetch users from the online collection
    const onlineUsers = await User.find();

    // Check if each online user already exists in the local database
    for (const onlineUser of onlineUsers) {
      const existingUser = await User.findOne({ email: onlineUser.email });
      if (!existingUser) {
        // If the user does not exist locally, save it
        await User.create(onlineUser);
      }
    }

    console.log('Database initialized');
    console.log(`${onlineUsers.length} users loaded from the online collection`);

  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

module.exports = initializeDatabase;

// Call this function when you want to initialize the database
initializeDatabase();
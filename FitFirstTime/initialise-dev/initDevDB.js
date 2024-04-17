import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import users from '../models/Users';
import User from '../models/User';

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

export default initializeDatabase;

// Call this function when you want to initialize the database
initializeDatabase();
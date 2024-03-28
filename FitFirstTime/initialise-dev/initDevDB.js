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
    
    // Drop collections
    await User.collection.drop().catch(err => console.log('User collection not found'));
    
    // Create initial users
    await User.create(users);

    console.log('Database initialized');
    console.log(`${users.length} users loaded`);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export default initializeDatabase;

// Call this function when you want to initialize the database
initializeDatabase();
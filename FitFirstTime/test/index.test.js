const mongoose = require('mongoose');
const express = require('express');
const supertest = require('supertest');
const User = require('../models/User');
const app = require('../index'); 
const request = require('supertest')(app);

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      fullName: 'Test User',
      fitDataToken: 'fitToken123',
      profilePicture: 'test.jpg',
    };

    const savedUser = await User.create(userData);
    expect(savedUser.email).toBe(userData.email);
  });

  it('should not allow duplicate email', async () => {
    const userData = {
      email: 'test@example.com',
      fullName: 'Test User',
      fitDataToken: 'fitToken123',
      profilePicture: 'test.jpg',
    };

    await User.create(userData); // Create the first user
    let error;
    try {
      // Attempt to create another user with the same email
      await User.create(userData);
    } catch (err) {
      // If an error occurs, assign it to the error variable
      error = err;
    }
    // Expect that an error occurred
    expect(error).toBeTruthy();
    // Expect that the error code is 11000 (MongoDB duplicate key error code)
    expect(error.code).toBe(11000);
    // Optionally, you can also check the error message
    expect(error.message).toContain('duplicate key error');
  });

  // Add more user model tests as needed
});

// Server routes tests
describe('Server Routes', () => {
  // This assumes you have implemented these routes in your Express app
  it('should respond with status 200 for /auth/google', async () => {
    const response = await request.get('/auth/google');
    expect(response.status).toBe(200);
  });

  it('should respond with status 200 for /auth/google/callback', async () => {
    const response = await request.get('/auth/google/callback');
    expect(response.status).toBe(200);
  });

  it('should respond with status 404 for non-existent route', async () => {
    const response = await request.get('/non-existent-route');
    expect(response.status).toBe(404);
  });

  it('should respond with status 200 and return user data for /get-user-data', async () => {
    const userEmail = 'test@example.com';
    const response = await request.get(`/get-user-data?email=${userEmail}`);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe(userEmail);
  });

  it('should respond with status 200 and return an array of users for /searchUsers', async () => {
    const response = await request.get('/searchUsers?name=test');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
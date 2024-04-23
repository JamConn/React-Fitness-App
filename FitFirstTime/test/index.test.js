const mongoose = require('mongoose');
const express = require('express');
const supertest = require('supertest');
const User = require('../models/User');
const app = require('../index');
const request = supertest(app);

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to the local test database
    await mongoose.connect('testDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  });

  afterAll(async () => {
    // Close the database connection after all tests are complete
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the User collection in the local test database before each test
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

    await User.create(userData); // Create a user with the same email
    let error;
    try {
      await User.create(userData); // Attempt to create another user with the same email
    } catch (err) {
      error = err;
    }
    expect(error).toBeTruthy();
    expect(error.code).toBe(11000); // MongoDB duplicate key error code
  });

  // Add more user model tests as needed
});

describe('Server Routes', () => {
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
    const userEmail = 'test@example.com'; // Assuming this user exists in the test database
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

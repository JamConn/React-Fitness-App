import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';
import { google } from 'googleapis';
import User from './models/User';
import initializeDatabase from './initialise-dev/initDevDB';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library'; 


dotenv.config();

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());



mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.log(`Database connection error: ${err}`);
});

db.on('disconnected', () => {
  console.log('Database disconnected');
});

db.once('open', () => {
  console.log(`Database connected to ${db.name} on ${db.host}`);
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// OAuth 2.0 setup for Google API
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:5000/auth/google/callback'
);

// Generate the consent URL
const SCOPES = ['https://www.googleapis.com/auth/fitness.activity.read',   'https://www.googleapis.com/auth/userinfo.profile',  'https://www.googleapis.com/auth/userinfo.email'];

const consentUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

app.use(express.json());

// OAuth 2.0 route
app.get('/auth/google', (req, res) => {
  res.redirect(consentUrl);
});

// Callback route after user grants consent
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);

        // Verify the ID token to get user info
        const ticket = await client.verifyIdToken({
          idToken: tokens.id_token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log('ID Token Payload:', payload);
        const email = payload.email;
        const name = payload.name;
        console.log('email:', email);
        console.log('name:', name); 

    // Validate the token with Google
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo', {
      params: { access_token: tokens.access_token },
    });




    // Save user information to MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({ email, fullName: name, fitDataToken: tokens.access_token });
      await user.save();
    } else {
      // Update the Fit API token if the user already exists
      user.fitDataToken = tokens.access_token;
      await user.save();
    }

    res.redirect(`http://localhost:3000/home?email=${user.email}`);
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Google Fit API routes
app.get('/fit-data/steps', async (req, res) => {
  const { email } = req.query;

  try {
    // Fetch steps data from Google Fit API using the stored token
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const fitDataResponse = await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      headers: {
        Authorization: `Bearer ${user.fitDataToken}`,
      },
      params: {
        aggregateBy: [
          {
            dataTypeName: 'com.google.step_count.delta',
          },
        ],
        bucketByTime: { durationMillis: 86400000 }, // 1 day
        startTimeMillis: Date.now() - 7 * 86400000, // 7 days ago
        endTimeMillis: Date.now(),
      },
    });

    console.log('Steps data response:', fitDataResponse.data); 


    // Process steps data and send it to the client
    const stepsData = parseFitData(fitDataResponse.data);
    res.json(stepsData);
  } catch (error) {
    console.error('Error fetching steps data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Google Fit API route for calories
app.get('/fit-data/calories', async (req, res) => {
  // Similar implementation as steps route
});

// Google Fit API route for heart points
app.get('/fit-data/heart-points', async (req, res) => {
  // Similar implementation as steps route
});

//User Data retrieved fixed
app.get('/get-user-data', async (req, res) => {
  const { email } = req.query;
  console.log('Requested email:', email); 

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    console.log('User data:', user); 
    res.json({ email: user.email,  fullName: user.fullName, fitDataToken: user.fitDataToken });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

//Search Route filtering through Online User database

app.get('/searchUsers', async (req, res) => {
  const { name } = req.query;
  try {
    const users = await User.find({ fullName: { $regex: name, $options: 'i' } }); 
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/users/workouts', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ workouts: user.workouts });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add route for adding workouts
app.post('/users/workouts', async (req, res) => {
  const { email, newWorkout } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.workouts.push(newWorkout);
    await user.save();

    res.json({ workout: newWorkout });
  } catch (error) {
    console.error('Error adding workout:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to parse Google Fit data
const parseFitData = (fitData) => {
  const parsedData = {
    dates: fitData.bucket.map((bucket) => new Date(bucket.startTimeMillis).toLocaleDateString()),
    steps: fitData.bucket.map((bucket) => bucket.dataset[0].point[0].value[0].intVal),
    calories: fitData.bucket.map((bucket) => bucket.dataset[0].point[0].value[0].fpVal),
    heartPoints: fitData.bucket.map((bucket) => bucket.dataset[0].point[0].value[0].intVal),
  };

  console.log('Parsed Fit data:', parsedData); 

  return parsedData;
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
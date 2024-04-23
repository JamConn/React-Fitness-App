const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const { google } = require('googleapis');
const User = require('./models/User');
const path = require('path');
const initializeDatabase = require('./initialise-dev/initDevDB');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../fitnessapp/build')));

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
  'https://still-refuge-99244-ad555b13e2bb.herokuapp.com/auth/google/callback'
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
        const picture = payload.picture;


    // Validate the token with Google
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo', {
      params: { access_token: tokens.access_token },
    });




    // Save user information to MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({ email, fullName: name, fitDataToken: tokens.access_token, profilePicture: picture  });
      await user.save();
    } else {
      // Update the Fit API token if the user already exists
      user.fitDataToken = tokens.access_token;
      user.profilePicture = picture;
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

    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { fitDataToken } = user;
    oauth2Client.setCredentials({ access_token: fitDataToken });
    const fitnessStore = google.fitness({ version: 'v1', auth: oauth2Client });
    const dataTypeName = 'com.google.step_count.delta';
    const dataSourceId = 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps';

    const data = {
      aggregateBy: [{ dataTypeName, dataSourceId }],
      bucketByTime: { durationMillis: 24 * 60 * 60 * 1000 },
      startTimeMillis: Date.now() - (20 * 24 * 60 * 60 * 1000),
      endTimeMillis: Date.now()
    };

    const result = await fitnessStore.users.dataset.aggregate({
      userId: 'me',
      requestBody: data
    });

    res.json(result.data); // Return the fitness data directly
  } catch (error) {
    console.error('Error fetching steps data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



// Google Fit API route for calories
app.get('/fit-data/calories', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    oauth2Client.setCredentials({ access_token: user.fitDataToken });

    const fitnessStore = google.fitness({ version: 'v1', auth: oauth2Client });

    const dataTypeName = 'com.google.calories.expended';

    const data = {
      aggregateBy: [{ dataTypeName }],
      bucketByTime: { durationMillis: 24 * 60 * 60 * 1000 },
      startTimeMillis: Date.now() - (20 * 24 * 60 * 60 * 1000),
      endTimeMillis: Date.now()
    };

    const result = await fitnessStore.users.dataset.aggregate({
      userId: 'me',
      requestBody: data
    });

    res.json(result.data);
  } catch (error) {
    console.error('Error fetching calories data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



// Google Fit API route for heart points
app.get('/fit-data/heart-points', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    oauth2Client.setCredentials({ access_token: user.fitDataToken });

    const fitnessStore = google.fitness({ version: 'v1', auth: oauth2Client });

    const dataTypeName = 'com.google.heart_minutes';

    const data = {
      aggregateBy: [{ dataTypeName }],
      bucketByTime: { durationMillis: 24 * 60 * 60 * 1000 },
      startTimeMillis: Date.now() - (20 * 24 * 60 * 60 * 1000),
      endTimeMillis: Date.now()
    };

    const result = await fitnessStore.users.dataset.aggregate({
      userId: 'me',
      requestBody: data
    });

    res.json(result.data);
  } catch (error) {
    console.error('Error fetching heart points data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


//User Data retrieved fixed
app.get('/get-user-data', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ email: user.email,  fullName: user.fullName, fitDataToken: user.fitDataToken, profilePicture: user.profilePicture });
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


//Get workouts
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


//Delete workout route
app.delete('/users/workouts/:workoutName', async (req, res) => {
  const { email } = req.query;
  const { workoutName } = req.params;
  console.log('Deleting workout:', workoutName, 'for user:', email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    user.workouts = user.workouts.filter(workout => workout.name !== workoutName);
    await user.save();

    console.log('Workout deleted successfully');
    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//Levels
app.get('/get-level', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const fitDataToken = user.fitDataToken;

    try {
      oauth2Client.setCredentials({ access_token: fitDataToken });

      const fitnessStore = google.fitness({ version: 'v1', auth: oauth2Client });

      const dataTypeName = 'com.google.heart_minutes';

      const data = {
        aggregateBy: [{ dataTypeName }],
        bucketByTime: { durationMillis: 24 * 60 * 60 * 1000 },
        startTimeMillis: Date.now() - (24 * 60 * 60 * 1000),
        endTimeMillis: Date.now()
      };

      const result = await fitnessStore.users.dataset.aggregate({
        userId: 'me',
        requestBody: data
      });

      const pointsToAdd = parseHeartPointsData(result.data);

      user.points += pointsToAdd;

      user.level = Math.floor(user.points / 100);

      await user.save();

      res.json({ success: true, user });
    } catch (error) {
      console.error('Error fetching heart points data:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// Function to parse heart points data
function parseHeartPointsData(fitData) {
  if (!fitData || !fitData.bucket) return 0;

  const points = fitData.bucket.reduce((totalPoints, bucket) => {
    if (!bucket.dataset || !bucket.dataset[0] || !bucket.dataset[0].point || !bucket.dataset[0].point[0]) return totalPoints;

    const point = bucket.dataset[0].point[0];

    if (point.value && point.value.length > 0) {
      const fpVal = point.value.find(val => val.fpVal !== undefined)?.fpVal;
      if (fpVal !== undefined) return totalPoints + fpVal;
      const intVal = point.value.find(val => val.intVal !== undefined)?.intVal;
      if (intVal !== undefined) return totalPoints + intVal;
    }

    return totalPoints;
  }, 0);

  return points;
}



app.get('/latest-profile-pic', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const profilePic = user.profilePicture;

    if (!profilePic) {
      return res.status(404).json({ success: false, message: 'Profile picture not found for the user' });
    }
    res.json({ success: true, profilePic });
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../fitnessapp/build', 'index.html'));
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

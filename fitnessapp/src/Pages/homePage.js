import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Grid from '@mui/material/Grid';
import WorkoutCard from '../Components/WorkoutCard';
import DeleteWorkoutButton from '../Components/DeleteWorkoutButton';
import { UserContext } from '../Context/AuthContext';
import { WorkoutsContext } from '../Context/WorkoutContext';
import Chart from 'chart.js/auto';
import Navbar from '../Components/Navigation';
import { CategoryScale } from 'chart.js';
import LinearProgress from '@mui/material/LinearProgress';
Chart.register(CategoryScale);

const Home = () => {
  const { userData, fetchUserData } = useContext(UserContext);
  const { workouts, fetchWorkouts } = useContext(WorkoutsContext);

  const [loading, setLoading] = useState(false);
  const [stepsData, setStepsData] = useState([]);
  const [caloriesData, setCaloriesData] = useState([]);
  const [heartPointsData, setHeartPointsData] = useState([]);
  const [dateLabels, setDateLabels] = useState([]);
  const [userLevel, setUserLevel] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [levelFetched, setLevelFetched] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!userData) return;

        let stepsResponse, caloriesResponse, heartPointsResponse;

        // Fetch steps data
        if (stepsData.length === 0) {
          console.log('Fetching Steps data...');
          stepsResponse = await axios.get(`http://localhost:5000/fit-data/steps?email=${userData.email}`, {
            headers: {
              Authorization: `Bearer ${userData.fitDataToken}`,
            },
          });
          console.log('Steps data:', stepsResponse.data);
          setStepsData(parseStepsData(stepsResponse.data));
        }

        // Fetch calories data
        if (caloriesData.length === 0) {
          console.log('Fetching Calories data...');
          caloriesResponse = await axios.get(`http://localhost:5000/fit-data/calories?email=${userData.email}`, {
            headers: {
              Authorization: `Bearer ${userData.fitDataToken}`,
            },
          });
          console.log('Calories data:', caloriesResponse.data);
          setCaloriesData(parseCaloriesData(caloriesResponse.data));
        }

        // Fetch heart points data
        if (heartPointsData.length === 0) {
          console.log('Fetching Heart Points data...');
          heartPointsResponse = await axios.get(`http://localhost:5000/fit-data/heart-points?email=${userData.email}`, {
            headers: {
              Authorization: `Bearer ${userData.fitDataToken}`,
            },
          });
          console.log('Heart Points data:', heartPointsResponse.data);
          setHeartPointsData(parseHeartPointsData(heartPointsResponse.data));
        }

        if (!levelFetched) {
          const levelResponse = await axios.get(`http://localhost:5000/get-level?email=${userData.email}`);
          setUserPoints(levelResponse.data.user.points); 
          setUserLevel(levelResponse.data.user.level);
          setLevelFetched(true);
          console.log('Level data:', levelResponse.data);
        }

        if (dateLabels.length === 0) {
          const labels = stepsResponse.data.bucket.map(bucket => {
            const date = new Date(parseInt(bucket.startTimeMillis));
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          });
          setDateLabels(labels);
        }


       if (userPoints > 0) {
        const progress = (userPoints % 100) / 100; 
        setProgressPercentage(progress * 100);
        console.log('Progress percentage:', progress * 100);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

    if (userData && !loading) {
      fetchData();
    }
  }, [userData, loading, levelFetched, stepsData, caloriesData, heartPointsData, dateLabels, userPoints]);

  const parseStepsData = (fitData) => {
    return fitData.bucket.map(bucket => {
      const point = bucket.dataset[0].point[0];
      return point.value[0].intVal;
    });
  };

  const parseCaloriesData = (fitData) => {
    if (!fitData || !fitData.bucket) return [];

    return fitData.bucket.map(bucket => {
      if (!bucket.dataset || !bucket.dataset[0] || !bucket.dataset[0].point || !bucket.dataset[0].point[0]) return 0;

      const point = bucket.dataset[0].point[0];
      return point.value[0].fpVal || 0;
    });
  };

  const parseHeartPointsData = (fitData) => {
    if (!fitData || !fitData.bucket) return [];

    return fitData.bucket.map(bucket => {
      if (!bucket.dataset || !bucket.dataset[0] || !bucket.dataset[0].point || !bucket.dataset[0].point[0]) return 0;

      const point = bucket.dataset[0].point[0];
      if (point.value && point.value.length > 0) {
        // Check for fpVal
        const fpVal = point.value.find(val => val.fpVal !== undefined)?.fpVal;
        if (fpVal !== undefined) return fpVal;

        // If not we use intVal
        const intVal = point.value.find(val => val.intVal !== undefined)?.intVal;
        if (intVal !== undefined) return intVal;
      }

      return 0; // Default value if neither fpVal nor intVal is found
    });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('email');

    if (userEmail) {
      fetchUserData(userEmail);
    }
  }, [fetchUserData]);

  useEffect(() => {
    if (userData) {
      fetchWorkouts(userData.email);
    }
  }, [userData, fetchWorkouts]);

  return (
    <>
      <Navbar />
      <div>
        {userData && (
          <div>
            <h1>Welcome, {userData.fullName}</h1>
            <img src={userData.profilePicture} alt="Profile" />
          </div>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <h2>Steps</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Bar data={{ labels: dateLabels, datasets: [{ label: 'Steps', data: stepsData, backgroundColor: 'rgba(75, 192, 192, 0.5)', borderWidth: 1 }] }} options={{}} />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <h2>Calories</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Bar data={{ labels: dateLabels, datasets: [{ label: 'Calories', data: caloriesData, backgroundColor: 'rgba(255, 99, 132, 0.5)', borderWidth: 1 }] }} options={{}} />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <h2>Heart Points</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Bar data={{ labels: dateLabels, datasets: [{ label: 'Heart Points', data: heartPointsData, backgroundColor: 'rgba(54, 162, 235, 0.5)', borderWidth: 1 }] }} options={{}} />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {loading ? null : (
              <div style={{ marginTop: '20px' }}>
                <p>Level: {userLevel}</p>
                <LinearProgress variant="determinate" value={progressPercentage} style={{ width: '80%' }} />
              </div>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {workouts && workouts.length > 0 ? (
            workouts.map((workout, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <WorkoutCard {...workout} />
                <DeleteWorkoutButton workoutName={workout.name} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <p>No Current Workouts</p>
            </Grid>
          )}
        </Grid>
      </div>
    </>
  );
};

export default Home;
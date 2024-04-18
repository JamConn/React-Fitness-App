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
import {CategoryScale} from 'chart.js'; 
Chart.register(CategoryScale);

const Home = () => {

  const { userData, fetchUserData } = useContext(UserContext); 
  const { workouts, fetchWorkouts } = useContext(WorkoutsContext); 

  const [fitData, setFitData] = useState({});
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('email');
    console.log('User email from URL parameters:', userEmail);
  
    if (userEmail) {
      console.log('User data received:', userData);
      fetchUserData(userEmail);
    }
  }, [fetchUserData]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userData) return;

        // Fetch Google Fit data using user's token
        const response = await axios.get(`http://localhost:5000/fit-data/steps?email=${userData.email}`, {
          headers: {
            Authorization: `Bearer ${userData.fitDataToken}`,
          },
        });
        setFitData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching Fit data:', error);
      }
    };

    fetchData();

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [userData, chart]);



  useEffect(() => {
    if (userData) {
      fetchWorkouts(userData.email); 
    }
  }, [userData, fetchWorkouts]);

  
  // Example chart data
  const chartData = {
    labels: fitData.dates || [],
    datasets: [
      {
        label: 'Steps',
        data: fitData.steps || [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderWidth: 1,
      },
      {
        label: 'Calories Burnt',
        data: fitData.calories || [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 1,
      },
      {
        label: 'Heart Points',
        data: fitData.heartPoints || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderWidth: 1,
      },
    ],
  };

  console.log(chartData);


  const chartOptions = {
    scales: {
      x: {
        type: 'category', 
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <Navbar />
      <div>
        <h1>Welcome, {userData.fullName}</h1>
        <img src={userData.profilePicture} alt="Profile" />
        <Bar data={chartData} options={{}} />
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
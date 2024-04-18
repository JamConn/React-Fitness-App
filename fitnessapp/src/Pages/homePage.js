import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Grid from '@mui/material/Grid';
import WorkoutCard from '../Components/WorkoutCard';
import { UserContext } from '../Context/AuthContext';
import { WorkoutsContext } from '../Context/WorkoutContext';
import Chart from 'chart.js/auto';
import Navbar from '../Components/Navigation'; 
import {CategoryScale} from 'chart.js'; 
Chart.register(CategoryScale);

const Home = () => {
  const { userData } = useContext(UserContext);

  const [fitData, setFitData] = useState({});
  const [workouts, setWorkouts] = useState([]);
  const [chart, setChart] = useState(null);

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
    const fetchUserWorkouts = async () => {
      try {
        if (!userData) return;

        // Fetch workouts for the current user
        const response = await axios.get(`/users/${userData.email}/workouts`);
        setWorkouts(response.data.workouts);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchUserWorkouts();
  }, [userData]);


  
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

  const workoutData = [
    {
      name: 'Leg Day Workout',
      description: 'A comprehensive workout for your legs.',
      videoUrl: 'https://www.youtube.com/watch?v=sampleVideo1',
      bodyPart: 'Legs',
    },
    {
      name: 'Upper Body Strength Training',
      description: 'Build strength in your upper body with these exercises.',
      videoUrl: 'https://www.youtube.com/watch?v=sampleVideo2',
      bodyPart: 'Upper Body',
    },
    {
      name: 'Core Workout for Abs',
      description: 'Strengthen your core with this intense ab workout.',
      videoUrl: 'https://www.youtube.com/watch?v=sampleVideo3',
      bodyPart: 'Core',
    },
  ];

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
      <h1>Welcome</h1>
      <Bar data={chartData} options={chartOptions} />
      <Grid container spacing={3}>
          {workouts.length > 0 ? (
            workouts.map((workout, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <WorkoutCard {...workout} />
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
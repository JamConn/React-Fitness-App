import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Grid from '@mui/material/Grid'; // Import Grid component
import WorkoutCard from '../Components/WorkoutCard'; // Import WorkoutCard component

const Home = ({ user }) => {
  const [fitData, setFitData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Google Fit data using user's token
        const response = await axios.get(`http://localhost:5000/fit-data/steps?email=${user.email}`, {
          headers: {
            Authorization: `Bearer ${user.fitDataToken}`,
          },
        });

        setFitData(response.data);
      } catch (error) {
        console.error('Error fetching Fit data:', error);
      }
    };

    fetchData();
  }, [user.email, user.fitDataToken]);

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
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h1>Welcome, {user.fullName}!</h1>
      <Bar data={chartData} options={chartOptions} />
      <Grid container spacing={3}>
        {workoutData.map((workout, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <WorkoutCard {...workout} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Home;
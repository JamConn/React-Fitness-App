import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

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
    </div>
  );
};

export default Home;
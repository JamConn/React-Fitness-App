import React, { useContext, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';
import { UserContext } from '../Context/AuthContext';

const AddWorkoutButton = ({ workout }) => {
  const { userData } = useContext(UserContext);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddWorkout = async () => {
    console.log('Adding workout...');
    if (!userData) {
      console.log('User data is null');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/users/workouts', { email: userData.email, newWorkout: workout });
      console.log('Response:', response);
      if (response.status === 200) {
        setAdded(true);
      }
    } catch (error) {
      console.error('Error adding workout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IconButton onClick={handleAddWorkout}>
      {loading ? (
        <span>Loading...</span>
      ) : added ? (
        <FavoriteIcon />
      ) : (
        <FavoriteBorderIcon />
      )}
    </IconButton>
  );
};

export default AddWorkoutButton;
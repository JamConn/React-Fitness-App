import React, { useContext, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import { UserContext } from '../Context/AuthContext';

const AddWorkoutButton = ({ workout }) => {
  const { userData } = useContext(UserContext);
  const [added, setAdded] = useState(false);

  const handleAddWorkout = async () => {
    try {
      await axios.post(`/users/${userData._id}/workouts`, workout);
      setAdded(true);
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  return (
    <IconButton onClick={handleAddWorkout}>
      {added ? <CheckIcon /> : <AddIcon />}
    </IconButton>
  );
};

export default AddWorkoutButton;
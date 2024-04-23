import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from "@mui/icons-material/Delete";
import axios from 'axios';
import { UserContext } from '../Context/AuthContext'; // Import UserContext

const DeleteWorkoutButton = ({ workoutName }) => {
  const { userData } = useContext(UserContext);

  const handleDelete = async () => {
    try {
      if (!userData) {
        console.error('User data not available');
        return;
      }
      const { email } = userData; 
      await axios.delete(`https://still-refuge-99244-ad555b13e2bb.herokuapp.com/users/workouts/${workoutName}`, {
        params: { email },
      });
      console.log('Workout deleted successfully');
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  return (
    <Button onClick={handleDelete} variant="contained" color="secondary">
      <DeleteIcon />
    </Button>
  );
};

export default DeleteWorkoutButton;
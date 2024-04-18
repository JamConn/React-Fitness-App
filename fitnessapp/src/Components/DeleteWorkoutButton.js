import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from "@mui/icons-material/Delete";
import axios from 'axios';
import { UserContext } from '../Context/AuthContext'; // Import UserContext

const DeleteWorkoutButton = ({ workoutName }) => {
  const { userData } = useContext(UserContext); // Get user data from context

  const handleDelete = async () => {
    try {
      if (!userData) {
        console.error('User data not available');
        return;
      }
      const { email } = userData; // Extract user's email
      await axios.delete(`http://localhost:5000/users/workouts/${workoutName}`, {
        params: { email }, // Pass email as a query parameter
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
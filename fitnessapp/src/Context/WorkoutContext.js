import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const WorkoutsContext = createContext();

export const WorkoutsProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          const response = await axios.get(`/users/workouts?email=${userEmail}`);
          setWorkouts(response.data.workouts);
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  const addWorkout = async (newWorkout) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const response = await axios.post('/users/workouts', { email: userEmail, newWorkout });
        setWorkouts([...workouts, response.data.workout]);
      }
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  return (
    <WorkoutsContext.Provider value={{ workouts, addWorkout }}>
      {children}
    </WorkoutsContext.Provider>
  );
};
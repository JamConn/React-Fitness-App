import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const WorkoutsContext = createContext();

export const WorkoutsProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);

  const fetchWorkouts = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/workouts?email=${email}`);
      setWorkouts(response.data.workouts);
      localStorage.setItem('workouts', JSON.stringify(response.data.workouts)); 
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  useEffect(() => {

    const storedWorkouts = localStorage.getItem('workouts');
    const userEmail = localStorage.getItem('userEmail');
    if (!storedWorkouts && userEmail) {
      fetchWorkouts(userEmail);
    } else {
      setWorkouts(JSON.parse(storedWorkouts)); 
    }
  }, []);

  const addWorkout = async (email, newWorkout) => {
    try {
      const response = await axios.post('http://localhost:5000/users/workouts', { email, newWorkout });
      setWorkouts([...workouts, response.data.workout]);
      localStorage.setItem('workouts', JSON.stringify([...workouts, response.data.workout])); 
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  return (
    <WorkoutsContext.Provider value={{ workouts, addWorkout, fetchWorkouts }}>
      {children}
    </WorkoutsContext.Provider>
  );
};
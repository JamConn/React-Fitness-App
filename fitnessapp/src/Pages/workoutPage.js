import React, { useContext, useState } from 'react';
import { Grid, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import Navbar from '../Components/Navigation';
import AddWorkoutButton from '../Components/AddWorkoutButton';
import { WorkoutsContext } from '../Context/WorkoutContext';

const WorkoutPage = () => {
  const { workouts } = useContext(WorkoutsContext);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);

  const handleCalculateBMI = () => {
    if (!height || !weight) {
      alert('Please enter both height and weight.');
      return;
    }

    // Check if height and weight are numeric values
    const isValidHeight = !isNaN(parseFloat(height)) && isFinite(height);
    const isValidWeight = !isNaN(parseFloat(weight)) && isFinite(weight);

    if (!isValidHeight || !isValidWeight) {
      alert('Please enter valid numeric values for height and weight.');
      return;
    }

    const heightInMeter = height / 100;
    const bmi = weight / (heightInMeter * heightInMeter);
    setBmiResult(bmi.toFixed(2));
  };

  const getBMIInfo = () => {
    if (!bmiResult) return '';
    const bmi = parseFloat(bmiResult);
    if (bmi < 18.5) {
      return 'If your BMI is less than 18.5, it falls within the underweight range.';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return 'If your BMI is 18.5 to 24.9, it falls within the Healthy Weight range.';
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      return 'If your BMI is 25.0 to 29.9, it falls within the overweight range.';
    } else {
      return 'If your BMI is greater than 30, it falls within the obese range.';
    }
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
    {
      name: 'Cardio Blast',
      description: 'Get your heart pumping with this high-intensity cardio routine.',
      videoUrl: 'https://www.youtube.com/watch?v=sampleVideo4',
      bodyPart: 'Cardio',
    },
    {
      name: 'Full Body Stretch',
      description: 'Relax and improve flexibility with this full-body stretching routine.',
      videoUrl: 'https://www.youtube.com/watch?v=sampleVideo5',
      bodyPart: 'Full Body',
    },
    {
      name: 'Back Attack Workout',
      description: 'Target your back muscles with this challenging workout.',
      videoUrl: 'https://www.youtube.com/watch?v=sampleVideo6',
      bodyPart: 'Back',
    },
    {
      name: 'Arm Sculpting Exercises',
      description: 'Define and tone your arms with these effective exercises.',
      videoUrl: 'https://www.youtube.com/watch?v=sampleVideo7',
      bodyPart: 'Arms',
    },
    {
      name: 'Yoga Flow for Relaxation',
      description: 'Unwind and de-stress with this calming yoga flow.',
      videoUrl: 'https://www.youtube.com/watch?v=sampleVideo8',
      bodyPart: 'Yoga',
    },
    {
      name: 'Full Body Stretch',
      description: 'Relax and improve flexibility with this full-body stretching routine.',
      videoUrl: 'https://www.youtube.com/watch?v=sampleVideo5',
      bodyPart: 'Full Body',
    },
    {
      name: 'Back Attack Workout',
      description: 'Target your back muscles with this challenging workout.',
      videoUrl: 'https://www.youtube.com/watch?v=sampleVideo6',
      bodyPart: 'Back',
    },
    {
      name: 'Arm Sculpting Exercises',
      description: 'Define and tone your arms with these effective exercises.',
      videoUrl: 'https://www.youtube.com/watch?v=sampleVideo7',
      bodyPart: 'Arms',
    },
    {
      name: 'Yoga Flow for Relaxation',
      description: 'Unwind and de-stress with this calming yoga flow.',
      videoUrl: 'https://www.youtube.com/watch?v=sampleVideo8',
      bodyPart: 'Yoga',
    },
  ];



  // Filter out workouts that the user has already liked
  const filteredWorkouts = workoutData.filter(workout => {
    return !workouts.some(userWorkout => userWorkout.name === workout.name);
  });

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: '#FAF3DD', minHeight: '100vh', padding: '50px' }}>
        <Typography variant="h2" component="h2" style={{ textAlign: 'left', marginBottom: '20px' }}>
          Choose Workouts:
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {filteredWorkouts.map((workout, index) => (
                <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {workout.name}
                      </Typography>
                      <Typography variant="body2" component="div">
                        {workout.description}
                      </Typography>
                      <Typography variant="body2" component="div">
                        Body Part: {workout.bodyPart}
                      </Typography>
                      <Typography variant="body2" component="div">
                        <strong>Video URL:</strong> <a href={workout.videoUrl} target="_blank" rel="noopener noreferrer">{workout.videoUrl}</a>
                      </Typography>
                      <AddWorkoutButton workout={workout} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
              <Typography variant="h3" component="h2" style={{ marginBottom: '20px' }}>
                BMI Calculator
              </Typography>
              <TextField
                label="Height (cm)"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                fullWidth
                style={{ marginBottom: '20px' }}
              />
              <TextField
                label="Weight (kg)"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                fullWidth
                style={{ marginBottom: '20px' }}
              />
              <Button variant="contained" onClick={handleCalculateBMI}>
                Calculate BMI
              </Button>
              {bmiResult && (
                <Typography variant="body1" component="div" style={{ marginTop: '20px' }}>
                  Your BMI is: {bmiResult} <br />
                  {getBMIInfo()}
                </Typography>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default WorkoutPage;
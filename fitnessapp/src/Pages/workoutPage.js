import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import Navbar from '../Components/Navigation'; 

const WorkoutPage = () => {
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
  ];

  return (
    <>
    <Navbar />
    <Grid container spacing={3}>
      {workoutData.map((workout, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {workout.name}
              </Typography>
              <Typography variant="body2" component="div">
                {workout.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    </>
  );
};

export default WorkoutPage;
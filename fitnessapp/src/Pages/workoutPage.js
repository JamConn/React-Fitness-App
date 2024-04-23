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
      name: 'Metabolic Boost Circuit Training',
      description: 'A high-intensity circuit training workout designed to boost metabolism and burn calories effectively, aiding in weight management and obesity control. This workout incorporates dynamic movements targeting multiple muscle groups for maximum calorie expenditure and metabolic enhancement.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Full Body',
    },
    {
      name: 'Cardio Fusion Dance Workout',
      description: 'A fun and energetic dance workout routine aimed at improving cardiovascular health and enhancing fitness levels. This workout combines various dance styles and aerobic movements to elevate heart rate, increase endurance, and promote heart health while burning calories and improving mood.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Cardio',
    },
    {
      name: 'Diabetic Strength and Balance Challenge',
      description: 'A strength and balance-focused workout program tailored for individuals with diabetes to improve muscle strength, stability, and overall health. This workout includes resistance exercises, balance drills, and functional movements to enhance physical function, prevent falls, and manage diabetes effectively.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Full Body',
    },
    {
      name: 'Obesity Buster Boot Camp',
      description: 'An intensive boot camp-style workout designed to combat obesity and promote weight loss through a combination of cardio drills, strength training exercises, and interval workouts. This high-energy routine challenges participants to push their limits, burn calories, and achieve significant fitness gains.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Full Body',
    },
    {
      name: 'Heart-Healthy Outdoor Adventure',
      description: 'An outdoor adventure-themed workout experience focused on improving heart health and cardiovascular fitness. This workout involves outdoor activities such as hiking, trail running, cycling, and kayaking to elevate heart rate, strengthen the cardiovascular system, and enhance overall well-being in a natural setting.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Cardio',
    },
    {
      name: 'Yogic Stress Relief for Diabetes Management',
      description: 'A specialized yoga practice designed to alleviate stress and promote relaxation for individuals managing diabetes. This yoga routine includes gentle stretches, breathing exercises, and mindfulness techniques to reduce stress levels, regulate blood sugar, and support holistic diabetes management.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Yoga',
    },
    {
      name: 'Metabolic Ignition HIIT Workout',
      description: 'A high-intensity interval training (HIIT) workout designed to ignite metabolism and burn fat effectively for weight management and obesity control. This fast-paced routine alternates between bursts of intense exercise and brief recovery periods to maximize calorie burn, improve fitness, and accelerate fat loss.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Full Body',
    },
    {
      name: 'Heart Health Power Cycling',
      description: 'A power cycling workout aimed at improving heart health, cardiovascular endurance, and lower body strength. This indoor cycling routine incorporates intervals, climbs, and sprints to challenge the heart, lungs, and leg muscles while providing an effective cardiovascular workout.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Cardio',
    },
    {
      name: 'Diabetic Wellness Pilates Flow',
      description: 'A Pilates-based workout flow designed to enhance physical wellness and support diabetes management. This gentle yet effective routine focuses on core strength, flexibility, and body awareness to improve posture, balance blood sugar levels, and promote overall well-being for individuals with diabetes.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Core',
    },
    {
      name: 'Obesity Combat Kickboxing Workout',
      description: 'A dynamic kickboxing workout regimen tailored for combatting obesity and promoting weight loss. This high-energy workout combines martial arts-inspired movements with cardio exercises to burn calories, build strength, and improve cardiovascular fitness while learning self-defense techniques.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Full Body',
    },
    {
      name: 'Heart Health Rowing Challenge',
      description: 'A rowing challenge workout designed to boost heart health, cardiovascular endurance, and total body strength. This indoor rowing session provides a low-impact yet highly effective cardiovascular workout, engaging multiple muscle groups while improving stamina and aerobic capacity.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Cardio',
    },
    {
      name: 'Mindful Yoga Flow for Diabetes Wellness',
      description: 'A mindful yoga flow practice designed to promote diabetes wellness by reducing stress and improving blood sugar control. This yoga sequence emphasizes breath awareness, gentle movements, and relaxation techniques to calm the mind, balance hormones, and support overall health for individuals with diabetes.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Yoga',
    },  {
      name: 'Metabolic Boost Circuit Training',
      description: 'A high-intensity circuit training workout designed to boost metabolism and burn calories effectively, aiding in weight management and obesity control. This workout incorporates dynamic movements targeting multiple muscle groups for maximum calorie expenditure and metabolic enhancement.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Full Body',
    },
    {
      name: 'Cardio Fusion Dance Workout',
      description: 'A fun and energetic dance workout routine aimed at improving cardiovascular health and enhancing fitness levels. This workout combines various dance styles and aerobic movements to elevate heart rate, increase endurance, and promote heart health while burning calories and improving mood.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Cardio',
    },
    {
      name: 'Diabetic Strength and Balance Challenge',
      description: 'A strength and balance-focused workout program tailored for individuals with diabetes to improve muscle strength, stability, and overall health. This workout includes resistance exercises, balance drills, and functional movements to enhance physical function, prevent falls, and manage diabetes effectively.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Full Body',
    },
    {
      name: 'Obesity Buster Boot Camp',
      description: 'An intensive boot camp-style workout designed to combat obesity and promote weight loss through a combination of cardio drills, strength training exercises, and interval workouts. This high-energy routine challenges participants to push their limits, burn calories, and achieve significant fitness gains.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Full Body',
    },
    {
      name: 'Heart-Healthy Outdoor Adventure',
      description: 'An outdoor adventure-themed workout experience focused on improving heart health and cardiovascular fitness. This workout involves outdoor activities such as hiking, trail running, cycling, and kayaking to elevate heart rate, strengthen the cardiovascular system, and enhance overall well-being in a natural setting.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Cardio',
    },
    {
      name: 'Yogic Stress Relief for Diabetes Management',
      description: 'A specialized yoga practice designed to alleviate stress and promote relaxation for individuals managing diabetes. This yoga routine includes gentle stretches, breathing exercises, and mindfulness techniques to reduce stress levels, regulate blood sugar, and support holistic diabetes management.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Yoga',
    },
    {
      name: 'Metabolic Ignition HIIT Workout',
      description: 'A high-intensity interval training (HIIT) workout designed to ignite metabolism and burn fat effectively for weight management and obesity control. This fast-paced routine alternates between bursts of intense exercise and brief recovery periods to maximize calorie burn, improve fitness, and accelerate fat loss.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Full Body',
    },
    {
      name: 'Heart Health Power Cycling',
      description: 'A power cycling workout aimed at improving heart health, cardiovascular endurance, and lower body strength. This indoor cycling routine incorporates intervals, climbs, and sprints to challenge the heart, lungs, and leg muscles while providing an effective cardiovascular workout.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Cardio',
    },
    {
      name: 'Diabetic Wellness Pilates Flow',
      description: 'A Pilates-based workout flow designed to enhance physical wellness and support diabetes management. This gentle yet effective routine focuses on core strength, flexibility, and body awareness to improve posture, balance blood sugar levels, and promote overall well-being for individuals with diabetes.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Core',
    },
    {
      name: 'Obesity Combat Kickboxing Workout',
      description: 'A dynamic kickboxing workout regimen tailored for combatting obesity and promoting weight loss. This high-energy workout combines martial arts-inspired movements with cardio exercises to burn calories, build strength, and improve cardiovascular fitness while learning self-defense techniques.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Full Body',
    },
    {
      name: 'Heart Health Rowing Challenge',
      description: 'A rowing challenge workout designed to boost heart health, cardiovascular endurance, and total body strength. This indoor rowing session provides a low-impact yet highly effective cardiovascular workout, engaging multiple muscle groups while improving stamina and aerobic capacity.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
      bodyPart: 'Cardio',
    },
    {
      name: 'Mindful Yoga Flow for Diabetes Wellness',
      description: 'A mindful yoga flow practice designed to promote diabetes wellness by reducing stress and improving blood sugar control. This yoga sequence emphasizes breath awareness, gentle movements, and relaxation techniques to calm the mind, balance hormones, and support overall health for individuals with diabetes.',
      videoUrl: 'https://www.youtube.com/watch?v=JR3pSLompYs',
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
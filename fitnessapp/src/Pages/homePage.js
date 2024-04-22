import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Grid from '@mui/material/Grid';
import WorkoutCard from '../Components/WorkoutCard';
import DeleteWorkoutButton from '../Components/DeleteWorkoutButton';
import { UserContext } from '../Context/AuthContext';
import { WorkoutsContext } from '../Context/WorkoutContext';
import Chart from 'chart.js/auto';
import Navbar from '../Components/Navigation';
import { CategoryScale } from 'chart.js';
import LinearProgress from '@mui/material/LinearProgress';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

Chart.register(CategoryScale);

const Home = () => {
  const { userData, fetchUserData } = useContext(UserContext);
  const { workouts, fetchWorkouts } = useContext(WorkoutsContext);

  const [loading, setLoading] = useState(false);
  const [stepsData, setStepsData] = useState([]);
  const [caloriesData, setCaloriesData] = useState([]);
  const [heartPointsData, setHeartPointsData] = useState([]);
  const [dateLabels, setDateLabels] = useState([]);
  const [userLevel, setUserLevel] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [levelFetched, setLevelFetched] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [fetchedProfilePic, setFetchedProfilePic] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!userData) return;

        let stepsResponse, caloriesResponse, heartPointsResponse;

        // Fetch steps data
        if (stepsData.length === 0) {
          console.log('Fetching Steps data...');
          stepsResponse = await axios.get(`http://localhost:5000/fit-data/steps?email=${userData.email}`, {
            headers: {
              Authorization: `Bearer ${userData.fitDataToken}`,
            },
          });
          console.log('Steps data:', stepsResponse.data);
          setStepsData(parseStepsData(stepsResponse.data));
        }

        // Fetch calories data
        if (caloriesData.length === 0) {
          console.log('Fetching Calories data...');
          caloriesResponse = await axios.get(`http://localhost:5000/fit-data/calories?email=${userData.email}`, {
            headers: {
              Authorization: `Bearer ${userData.fitDataToken}`,
            },
          });
          console.log('Calories data:', caloriesResponse.data);
          setCaloriesData(parseCaloriesData(caloriesResponse.data));
        }

        // Fetch heart points data
        if (heartPointsData.length === 0) {
          console.log('Fetching Heart Points data...');
          heartPointsResponse = await axios.get(`http://localhost:5000/fit-data/heart-points?email=${userData.email}`, {
            headers: {
              Authorization: `Bearer ${userData.fitDataToken}`,
            },
          });
          console.log('Heart Points data:', heartPointsResponse.data);
          setHeartPointsData(parseHeartPointsData(heartPointsResponse.data));
        }

        if (!levelFetched) {
          const levelResponse = await axios.get(`http://localhost:5000/get-level?email=${userData.email}`);
          setUserPoints(levelResponse.data.user.points); 
          setUserLevel(levelResponse.data.user.level);
          setLevelFetched(true);
          console.log('Level data:', levelResponse.data);
        }

        if (dateLabels.length === 0) {
          const labels = stepsResponse.data.bucket.map(bucket => {
            const date = new Date(parseInt(bucket.startTimeMillis));
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          });
          setDateLabels(labels);
        }

        if (userPoints > 0) {
          const progress = (userPoints % 100) / 100; 
          setProgressPercentage(progress * 100);
          console.log('Progress percentage:', progress * 100);
        }
        //fetch the profile pic
        if (!fetchedProfilePic) {
          const profilePicResponse = await axios.get(`http://localhost:5000/latest-profile-pic?email=${userData.email}`);
          console.log('Profile picture data:', profilePicResponse.data);
          setProfilePic(profilePicResponse.data.profilePic);
          setFetchedProfilePic(true); 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error); 
      } finally {
        setLoading(false);
      }
    };

    if (userData && !loading) {
      fetchData();
    }
  }, [userData, loading, levelFetched, stepsData, caloriesData, heartPointsData, dateLabels, userPoints, fetchedProfilePic]);

  const parseStepsData = (fitData) => {
    return fitData.bucket.map(bucket => {
      const point = bucket.dataset[0].point[0];
      return point.value[0].intVal;
    });
  };

  const parseCaloriesData = (fitData) => {
    if (!fitData || !fitData.bucket) return [];

    return fitData.bucket.map(bucket => {
      if (!bucket.dataset || !bucket.dataset[0] || !bucket.dataset[0].point || !bucket.dataset[0].point[0]) return 0;

      const point = bucket.dataset[0].point[0];
      return point.value[0].fpVal || 0;
    });
  };

  const parseHeartPointsData = (fitData) => {
    if (!fitData || !fitData.bucket) return [];

    return fitData.bucket.map(bucket => {
      if (!bucket.dataset || !bucket.dataset[0] || !bucket.dataset[0].point || !bucket.dataset[0].point[0]) return 0;

      const point = bucket.dataset[0].point[0];
      if (point.value && point.value.length > 0) {
        // Check for fpVal
        const fpVal = point.value.find(val => val.fpVal !== undefined)?.fpVal;
        if (fpVal !== undefined) return fpVal;

        // If not we use intVal
        const intVal = point.value.find(val => val.intVal !== undefined)?.intVal;
        if (intVal !== undefined) return intVal;
      }

      return 0; // Default value if neither fpVal nor intVal is found
    });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('email');

    if (userEmail) {
      fetchUserData(userEmail);
    }
  }, [fetchUserData]);

  useEffect(() => {
    if (userData) {
      fetchWorkouts(userData.email);
    }
  }, [userData, fetchWorkouts]);

  if (error) {
    // Render error message if an error occurred while fetching data
    return (
      <>
        <Navbar />
        <div style={{ fontFamily: 'Roboto, sans-serif', backgroundColor: '#FAF3DD', padding: '50px', width: '100%' }}>
          <p>An error occurred while fetching data. Please try again later.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ fontFamily: 'Roboto, sans-serif', backgroundColor: '#FAF3DD', padding: '50px', width: '100%' }}>
        {userData && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                {profilePic ? (
                  <img src={profilePic} alt="User Profile Picture" style={{ width: '50%', height: 'auto', borderRadius: '50%' }} />
                ) : (
                  <AccountCircleIcon style={{ fontSize: 100 }} />
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <h1>{userData.fullName}</h1>
                <h2>{userData.email}</h2>
              </div>
              <div style={{ paddingLeft: '70px', paddingTop: '180px' }}>
              <div style={{justifyContent: 'center', textAlign: 'center',border: '6px solid black', borderRadius: '50%', width: '200px', height: '200px', padding: '50px'   }}>
                <h1>Level</h1>
                <h1>{userLevel}</h1>
                <LinearProgress variant="determinate" value={progressPercentage} style={{ width: '80%', margin: 'auto' }} />
              </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={5}>
                  <div style={{ padding: '0px' }}>
                    <h2>Steps</h2>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <Bar data={{ labels: dateLabels, datasets: [{ label: 'Steps', data: stepsData, backgroundColor: 'rgba(6, 187, 193, 0.5)', borderWidth: 1 }] }} options={{}} />
                    )}
                  </div>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <div style={{ padding: '0px' }}>
                    <h2>Calories</h2>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <Bar data={{ labels: dateLabels, datasets: [{ label: 'Calories', data: caloriesData, backgroundColor: 'rgba(190, 184, 235, 0.5)', borderWidth: 1 }] }} options={{}} />
                    )}
                  </div>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <div style={{ padding: '0px' }}>
                    <h2>Heart Points</h2>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <Bar data={{ labels: dateLabels, datasets: [{ label: 'Heart Points', data: heartPointsData, backgroundColor: 'rgba(219, 79, 74, 0.5)', borderWidth: 1 }] }} options={{}} />
                    )}
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        <hr style={{ margin: '50px 0', border: 'none', borderBottom: '2px solid #d4c69d', width: '90%', position: 'center' }} />
        <Grid container spacing={2}>
          <h1>Your Workouts!</h1>
          <Grid item xs={12} sm={12}>
            <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap' }}>
              {workouts && workouts.length > 0 ? (
                workouts.map((workout, index) => (
                  <div key={index} style={{ width: '30%', margin: '10px', minWidth: '150px' }}>
                    <WorkoutCard {...workout} />
                    <DeleteWorkoutButton workoutName={workout.name} />
                  </div>
                ))
              ) : (
                <h1>No Current Workouts</h1>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Home;
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';
import logo from '../img/logo.png';
import SearchBar from './SearchBar';
import { Link, useNavigate } from 'react-router-dom'; 
import { UserContext } from '../Context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, fetchUserData } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    fetchUserData(null);
    navigate('/'); 
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#095256' }}>
      <Toolbar>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Link to="/home" style={{ textDecoration: 'none', color: 'white' }}>
              <img src={logo} alt="Logo" style={{ width: 'auto', height: '50px' }} />
            </Link>
          </Grid>
          <Grid item>
            <Typography variant="h6" component="div">
              <a href="/home" style={{ textDecoration: 'none', color: 'white' }}>Home</a>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" component="div">
              <a href="/workouts" style={{ textDecoration: 'none', color: 'white' }}>Workouts</a>
            </Typography>
          </Grid>
          <Grid item xs />
          <Grid item>
            <SearchBar />
          </Grid>
          <Grid item>
            {userData && (
              <Button variant="outlined" style={{ color: 'white', borderColor: 'white' }} onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
import React from 'react';
import { AppBar, Toolbar, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';
import logo from '../img/logo.png';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom'; 



const Navbar = () => {
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
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
  

  export default Navbar;
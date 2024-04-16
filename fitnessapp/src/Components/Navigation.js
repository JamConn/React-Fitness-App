import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Link, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import logo from '../img/logo.jpg';



const Navbar = () => {
    return (
      <AppBar position="static">
        <Toolbar>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <img src={logo} alt="Logo" style={{ width: 'auto', height: '50px' }} />
            </Grid>
            <Grid item>
              <Typography variant="h6" component="div">
                <a href="/home" style={{ textDecoration: 'none', color: 'inherit' }}>Home</a>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" component="div">
                <a href="/workouts" style={{ textDecoration: 'none', color: 'inherit' }}>Workouts</a>
              </Typography>
            </Grid>
            <Grid item xs />
            <Grid item>
              <SearchContainer>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <InputBase
                  placeholder="Search..."
                  inputProps={{ 'aria-label': 'search' }}
                  style={{ color: 'inherit' }}
                />
              </SearchContainer>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  };
  
  const SearchContainer = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  export default Navbar;
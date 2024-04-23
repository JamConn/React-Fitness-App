import React from 'react';
import Button from '@mui/material/Button';
import logo from '../img/logo.png'; // Import the logo image
import './loginPage.css';

const LoginPage = ({ onLogin }) => {
  const handleLogin = async () => {
    try {
      window.location.href = 'https://still-refuge-99244-ad555b13e2bb.herokuapp.com/auth/google';
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-container">
        <div className="background-image"></div>
        <div className="login-content">
          <img src={logo} alt="Logo" style={{ width: '50%' }}  /> 
          <h1>First Time Fit</h1>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
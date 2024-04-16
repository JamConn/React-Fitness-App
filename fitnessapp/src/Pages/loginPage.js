import React from 'react';
import Button from '@mui/material/Button';
import './loginPage.css'; 

const LoginPage = ({ onLogin }) => {
  const handleLogin = async () => {
    try {
      window.location.href = 'http://localhost:5000/auth/google';
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="background-image"></div> 
      <div className="login-content">
        <h1>Login Page</h1>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login with Google
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
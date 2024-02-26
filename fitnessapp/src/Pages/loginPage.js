import React from 'react';


const Login = ({ onLogin }) => {
  const handleLogin = async () => {
    try {
      window.location.href = 'http://localhost:5000/auth/google';
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
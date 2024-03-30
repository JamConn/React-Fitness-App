import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/loginPage';
import Home from './Pages/homePage';
import { UserProvider } from './Context/AuthContext'; // Import the UserProvider

function App() {
  
  useEffect(() => {
    // Function to clear stored tokens
    const clearStoredTokens = () => {
      localStorage.removeItem('accessToken'); // Assuming you're using localStorage
    };

    // Check if stored tokens exist
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // If tokens exist, clear them
      clearStoredTokens();
    }
  }, []);

  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
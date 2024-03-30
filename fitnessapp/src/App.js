import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/loginPage';
import Home from './Pages/homePage';
import { UserProvider } from './Context/AuthContext';

function App() {
  
  useEffect(() => {

    const clearStoredTokens = () => {
      localStorage.removeItem('accessToken'); 
    };


    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {

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
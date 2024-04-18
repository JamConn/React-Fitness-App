import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/loginPage';
import Home from './Pages/homePage';
import { UserProvider } from './Context/AuthContext';
import Navbar from './Components/Navigation';
import WorkoutPage from './Pages/workoutPage';
import ListUsers from './Pages/listUsers';
import { WorkoutsProvider } from './Context/WorkoutContext'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    setIsLoggedIn(!!accessToken);
  }, []);

  return (
    <Router>
      <UserProvider>
      <WorkoutsProvider>
        {isLoggedIn && <Navbar />}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/workouts" element={<WorkoutPage />} />
          <Route path="/listUsers" element={<ListUsers />} />
          <Route path="/" element={<Login />} />
        </Routes>
        </WorkoutsProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
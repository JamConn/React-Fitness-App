import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/loginPage';
import Home from './Pages/homePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const fetchUserData = async (email) => {
    try {
      const response = await axios.get(`/get-user-data?email=${email}`);
      console.log('User data:', response.data);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      fetchUserData(userEmail);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userData, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {

    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const fetchUserData = async (email) => {
    try {

      const response = await axios.get(`https://still-refuge-99244-ad555b13e2bb.herokuapp.com/get-user-data?email=${email}`);
      setUserData(response.data);


      localStorage.setItem('userData', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
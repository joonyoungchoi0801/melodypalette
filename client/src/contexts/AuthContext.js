import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const login = (token) => {
    setIsLoggedIn(true);
    // Fetch user profile and set it
    fetchUserProfile(token);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    // Clear any tokens or user data
    localStorage.removeItem('token');
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else {
        console.error('Failed to fetch user profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  

  return (
    <AuthContext.Provider value={{ isLoggedIn, userProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

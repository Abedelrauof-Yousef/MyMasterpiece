// src/context/authContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is authenticated (on initial load or refresh)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/users/checkAuth', { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Handle logout
  const logout = async () => {
    try {
      await axios.post('http://localhost:5001/api/users/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

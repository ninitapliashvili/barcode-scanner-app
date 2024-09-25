import React, { createContext, useState } from 'react';

// Create a new context for authentication
const AuthContext = createContext();

// AuthProvider component to provide authentication state to the entire app
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    // Try to fetch the token from localStorage when the app starts
    const token = localStorage.getItem('token');
    return token ? { token } : null;
  });

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem('token');  // Clear the JWT token from localStorage
    setAuthData(null);  // Clear the auth data in context
  };

  // Function to handle user login and token storage
  const login = (token) => {
    localStorage.setItem('token', token);  // Store the JWT token in localStorage
    setAuthData({ token });  // Set the auth data in context
  };

  return (
    <AuthContext.Provider value={{ authData, setAuthData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
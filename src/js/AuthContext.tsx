
import * as React from 'react';
import { createContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedin: boolean;
  login: () => void;
  logout: () => void;
}

// Provide a default value for the context
const defaultAuthContext: AuthContextType = {
  isLoggedin: false,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);

  // Check for token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedin(!!token);
  }, []);

  // Function to handle login
  const login = () => {
    setIsLoggedin(true);
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
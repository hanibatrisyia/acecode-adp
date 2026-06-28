import React, { createContext, useState, useContext } from 'react';
import { mockUsers, loginCredentials } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (username, password) => {
    const creds = Object.values(loginCredentials).find(
      c => c.username === username && c.password === password
    );
    
    if (creds) {
      const userData = mockUsers.find(u => u.role === creds.role);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    }
    
    return { success: false, error: "Nama pengguna atau kata laluan tidak sah" };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, isAuthenticated, login, logout } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
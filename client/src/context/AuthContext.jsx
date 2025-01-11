import React, { createContext, useContext, useState } from 'react';
import { auth } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password, role) => {
    try {
      const { data } = await auth.login({ email, password, role });
      setUser(data.user);
      localStorage.setItem('token', data.token);
      toast.success('Login successful');
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email, password, role) => {
    try {
      const { data } = await auth.signup({ email, password, role });
      setUser(data.user);
      localStorage.setItem('token', data.token);
      toast.success('Signup successful');
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
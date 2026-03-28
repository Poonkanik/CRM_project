import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-spinner"><div className="spinner" /><span>Loading...</span></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

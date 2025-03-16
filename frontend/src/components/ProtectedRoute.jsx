import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { CircularProgress, Box } from '@mui/material';
import theme from './theme';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoadingAuth } = useAuthStore();

  if (isLoadingAuth) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} color='main' />
      </Box>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
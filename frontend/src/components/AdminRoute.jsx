import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { CircularProgress, Box } from '@mui/material';
import theme from './theme';

const AdminRoute = () => {
  const { isAuthenticated, isLoadingAuth, user } = useAuthStore();
  console.log('User data:', user);
  console.log('Role:', user?.role);

  if (isLoadingAuth) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} color='main' />
      </Box>
    );
  }

  return isAuthenticated && user?.role === 'admin' ? 
    <Outlet /> : 
    <Navigate to="/" replace />;
};

export default AdminRoute;
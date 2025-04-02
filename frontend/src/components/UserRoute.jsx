import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state if authentication check is in progress
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D0B24]"></div>
      </div>
    );
  }
  
  // If admin user, redirect to admin dashboard
  if (isAuthenticated() && isAdmin()) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // Allow access to non-admin users (whether authenticated or not)
  return <Outlet />;
};

export default UserRoute;
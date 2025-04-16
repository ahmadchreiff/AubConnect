import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
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
  
  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect admins to admin dashboard
  if (isAdmin()) {
    // Check if not already in admin area
    if (!location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
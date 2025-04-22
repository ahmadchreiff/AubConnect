import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RouteGuard = ({ children }) => {
  const { currentUser, loading, isAuthenticated, isAdmin, checkPageAccess } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until authentication check is complete
    if (loading) return;
    
    const pathname = location.pathname;
    
    // Check if the user has access to this page
    if (!checkPageAccess(pathname)) {
      // If user is not authenticated, redirect to login
      if (!isAuthenticated()) {
        navigate('/login', { replace: true });
      } 
      // If user is admin and trying to access non-admin pages, redirect to admin dashboard
      else if (isAdmin() && !pathname.startsWith('/admin')) {
        navigate('/admin/dashboard', { replace: true });
      }
      // If regular user trying to access admin pages, redirect to homepage
      else if (!isAdmin() && pathname.startsWith('/admin')) {
        navigate('/homepage', { replace: true });
      }
    }
  }, [location.pathname, loading, currentUser]);

  // Render children only after loading is complete
  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D0B24]"></div>
    </div>
  ) : (
    children
  );
};

export default RouteGuard;
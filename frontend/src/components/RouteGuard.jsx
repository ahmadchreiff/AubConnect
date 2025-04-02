// Create a new file: src/components/RouteGuard.jsx
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
      // Redirect based on user type
      if (!isAuthenticated()) {
        navigate('/login', { replace: true });
      } else if (isAdmin()) {
        navigate('/admin/dashboard', { replace: true });
      } else {
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
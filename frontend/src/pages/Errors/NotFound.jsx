// Create a file: src/pages/Errors/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NotFound = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  const getRedirectPath = () => {
    if (!isAuthenticated()) return '/login';
    if (isAdmin()) return '/admin/dashboard';
    return '/homepage';
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you're trying to access doesn't exist or you don't have permission to view it.
        </p>
        
        <Link 
          to={getRedirectPath()} 
          className="w-full inline-block bg-[#6D0B24] text-white py-2 px-4 rounded-md hover:bg-[#5a0a1e] transition duration-300"
        >
          Return to {isAdmin() ? 'Admin Dashboard' : 'Homepage'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
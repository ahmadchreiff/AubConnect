import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Set default auth header for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch current user data
        const response = await axios.get('https://aubconnectbackend-h22c.onrender.com/api/users/check-auth');
        setCurrentUser(response.data.user);
      } catch (err) {
        console.error('Auth check failed:', err);
        // If token is invalid, remove it
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password, recaptchaToken) => {
    try {
      const response = await axios.post('https://aubconnectbackend-h22c.onrender.com/api/auth/login', {
        email,
        password,
        recaptchaToken  // Add the reCAPTCHA token to the request body
      });

      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Update current user
      setCurrentUser(user);

      // Log the login success
      console.log('Login successful:', user.role);

      // Return the complete response data
      return response.data;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  // Get user info from token
  const getUserInfo = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (err) {
      console.error('Invalid token:', err);
      return null;
    }
  };

  // Check if token is valid and not expired
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      return decoded.exp > currentTime;
    } catch (err) {
      return false;
    }
  };

  // Check if user is an admin
  const isAdmin = () => {
    if (!currentUser) return false;
    return currentUser.role === 'admin';
  };

  // Check if admin should be redirected to admin dashboard
  const shouldRedirectAdmin = () => {
    if (!currentUser) return false;
    return currentUser.role === 'admin';
  };

  // Add this function to your AuthContext.jsx
  const checkPageAccess = (pathname) => {
    // If no user is logged in, they can only access public pages
    if (!currentUser) {
      const publicPaths = ['/', '/login', '/signup', '/forgot-password'];
      return publicPaths.includes(pathname);
    }

    // If user is admin, they can access admin pages and public pages
    if (currentUser.role === 'admin') {
      return pathname.startsWith('/admin') || 
             ['/', '/login', '/signup', '/forgot-password'].includes(pathname);
    }

    // Regular users can't access admin pages
    if (pathname.startsWith('/admin')) {
      return false;
    }

    // Regular users can access all other pages
    return true;
  };

  // Value to be provided by the context
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    getUserInfo,
    isAuthenticated,
    isAdmin,
    shouldRedirectAdmin,
    checkPageAccess // Add this new function
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
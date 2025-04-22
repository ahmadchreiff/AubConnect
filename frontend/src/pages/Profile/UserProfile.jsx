import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const UserProfile = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // State for user statistics
  const [userStats, setUserStats] = useState({
    reviewCount: 0,
    highestRating: 0,
    lastReviewDate: null,
    helpfulVotes: 0
  });

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setUsername(currentUser.username);
      fetchUserStats();
    }
  }, [currentUser]);
  
  // Lock body scroll when edit modal is open
  useEffect(() => {
    if (editMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [editMode]);

  // Fetch user reviews and calculate statistics
  const fetchUserStats = async () => {
    try {
      // Get the JWT token
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      // Fetch user's reviews
      const response = await axios.get('https://aubconnectbackend-h22c.onrender.com/api/reviews/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const reviews = response.data.reviews || [];
      
      // Calculate statistics from reviews
      if (reviews.length > 0) {
        // Total review count
        const reviewCount = reviews.length;
        
        // Find highest rating
        const highestRating = Math.max(...reviews.map(review => review.rating));
        
        // Find the most recent review date
        const sortedByDate = [...reviews].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        const lastReviewDate = sortedByDate.length > 0 ? new Date(sortedByDate[0].createdAt) : null;
        
        // Count total upvotes (helpful votes)
        const helpfulVotes = reviews.reduce((total, review) => 
          total + (review.upvotes ? review.upvotes.length : 0), 0
        );
        
        setUserStats({
          reviewCount,
          highestRating,
          lastReviewDate,
          helpfulVotes
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setUpdateSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.put(
        'https://aubconnectbackend-h22c.onrender.com/api/users/profile',
        { name, username },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      setEditMode(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  // Generate a color based on the user's name for the avatar
  const generateColor = (name) => {
    const colors = ['bg-blue-600', 'bg-purple-600', 'bg-indigo-600', 'bg-[#6D0B24]', 'bg-[#860033]'];
    let hash = 0;
    if (name) {
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
    }
    return colors[Math.abs(hash) % colors.length];
  };
  
  // Format the "time ago" for last review
  const formatTimeAgo = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-t-4 border-b-4 border-[#6D0B24] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#6D0B24] to-[#860033] pt-16 pb-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              className={`h-40 w-40 rounded-full ${generateColor(currentUser?.name)} text-white font-bold text-6xl flex items-center justify-center shadow-lg border-4 border-white mb-6`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentUser?.name}
            </motion.h1>
            <motion.p 
              className="text-white/90 text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              @{currentUser?.username}
            </motion.p>
            
            {!editMode && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setEditMode(true)}
                className="px-8 py-3 bg-white text-[#6D0B24] rounded-lg shadow-md hover:bg-gray-100 transition-colors font-medium flex items-center text-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 mb-16 relative z-20">
        {/* Success Message */}
        <AnimatePresence>
          {updateSuccess && (
            <motion.div 
              className="mb-6 rounded-lg bg-green-50 p-4 text-green-800 flex items-center shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <svg className="h-5 w-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Your profile has been updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Card */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>
            <div className="text-sm text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified User</span>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Full Name</label>
                  <div className="bg-gray-50 px-5 py-4 rounded-lg text-gray-800 border border-gray-100 font-medium text-lg">{currentUser?.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Username</label>
                  <div className="bg-gray-50 px-5 py-4 rounded-lg text-gray-800 border border-gray-100 font-medium text-lg">@{currentUser?.username}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Email Address</label>
                  <div className="bg-gray-50 px-5 py-4 rounded-lg text-gray-800 border border-gray-100 flex items-center font-medium text-lg">
                    <span>{currentUser?.email}</span>
                    <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Verified</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Member Since</label>
                  <div className="bg-gray-50 px-5 py-4 rounded-lg text-gray-800 border border-gray-100 font-medium">
                    {currentUser?.createdAt 
                      ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })
                      : new Date().toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Account Status</label>
                  <div className="bg-gray-50 px-5 py-4 rounded-lg text-gray-800 border border-gray-100 flex items-center font-medium">
                    <span className="h-3 w-3 rounded-full bg-green-500 mr-3"></span>
                    <span>Active</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Last Login</label>
                  <div className="bg-gray-50 px-5 py-4 rounded-lg text-gray-800 border border-gray-100 font-medium">
                    {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity Card */}
        <motion.div 
          className="bg-gradient-to-br from-[#6D0B24] to-[#860033] rounded-xl shadow-lg overflow-hidden text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="px-8 py-6 border-b border-white/10">
            <h2 className="text-2xl font-semibold">Your Activity</h2>
          </div>
          <div className="p-8">
            <div className="flex items-center justify-center">
              <div className="bg-white/10 rounded-2xl backdrop-blur-sm p-8 text-center w-full">
                <div className="flex flex-col items-center">
                  <div className="text-6xl font-bold mb-2">{userStats.reviewCount}</div>
                  <div className="text-xl opacity-90 mb-6">Reviews Posted</div>
                  <a href="/my-reviews" className="px-6 py-3 bg-white text-[#6D0B24] rounded-lg font-medium hover:bg-white/90 transition-colors">
                    View Your Reviews
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg backdrop-blur-sm p-4 flex items-center">
                <div className="bg-white/20 rounded-full h-12 w-12 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <div className="opacity-80 text-sm">Highest Rating</div>
                  <div className="font-bold text-xl">{userStats.highestRating.toFixed(1) || 'N/A'}</div>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg backdrop-blur-sm p-4 flex items-center">
                <div className="bg-white/20 rounded-full h-12 w-12 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="opacity-80 text-sm">Last Review</div>
                  <div className="font-bold text-xl">{formatTimeAgo(userStats.lastReviewDate)}</div>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg backdrop-blur-sm p-4 flex items-center">
                <div className="bg-white/20 rounded-full h-12 w-12 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="opacity-80 text-sm">Helpful Votes</div>
                  <div className="font-bold text-xl">{userStats.helpfulVotes}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setEditMode(false)}>
            <motion.div 
              className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#6D0B24] to-[#860033] py-5 px-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
                <button 
                  onClick={() => {
                    setEditMode(false);
                    setName(currentUser.name);
                    setUsername(currentUser.username);
                    setError('');
                  }}
                  className="text-white/80 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-[#6D0B24] focus:ring focus:ring-[#6D0B24]/20 rounded-lg"
                      required
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">@</span>
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 focus:border-[#6D0B24] focus:ring focus:ring-[#6D0B24]/20 rounded-lg"
                        required
                      />
                    </div>
                  </div> */}

                  {error && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setName(currentUser.name);
                        setUsername(currentUser.username);
                        setError('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-[#6D0B24] to-[#860033] rounded-md text-white shadow-sm hover:from-[#860033] hover:to-[#6D0B24]"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default UserProfile;
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

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setUsername(currentUser.username);
      setLoading(false);
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

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-t-4 border-b-4 border-[#6D0B24] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#6D0B24] to-[#860033] pt-12 pb-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              className={`h-32 w-32 rounded-full ${generateColor(currentUser?.name)} text-white font-bold text-5xl flex items-center justify-center shadow-lg border-4 border-white mb-4`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-1">{currentUser?.name}</h1>
            <p className="text-white/90 text-lg mb-6">@{currentUser?.username}</p>
            {!editMode && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setEditMode(true)}
                className="px-6 py-2 bg-white text-[#6D0B24] rounded-md shadow-md hover:bg-gray-100 transition-colors font-medium flex items-center"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-12">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Side - User Profile Card */}
          <div className="md:col-span-2">
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                <div className="text-sm text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Verified User</span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="bg-gray-50 px-4 py-3 rounded-lg text-gray-800 border border-gray-100">{currentUser?.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <div className="bg-gray-50 px-4 py-3 rounded-lg text-gray-800 border border-gray-100">@{currentUser?.username}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="bg-gray-50 px-4 py-3 rounded-lg text-gray-800 border border-gray-100 flex items-center">
                      <span>{currentUser?.email}</span>
                      <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Verified</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="bg-gray-50 rounded-lg border border-gray-100 p-4">
                      <div className="flex items-center">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6D0B24] mr-2" viewBox="0 0 20 20" fill="currentColor"> */}
                          {/* <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /> */}
                        {/* </svg> */}
                        {/* <p className="text-gray-700">Need to change your password? <a href="#" className="text-[#6D0B24] font-medium">Click here</a> to reset it.</p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Account Details & Stats */}
          <div className="space-y-6">
            {/* Account Details Card */}
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Account Details</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Member Since</p>
                    <p className="mt-1 text-gray-800 font-medium">
                      {currentUser?.createdAt 
                        ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })
                        : new Date().toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Status</p>
                    <div className="mt-1 flex items-center">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></span>
                      <p className="text-gray-800 font-medium">Active</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Login</p>
                    <p className="mt-1 text-gray-800 font-medium">
                      {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div 
              className="bg-gradient-to-br from-[#6D0B24] to-[#860033] rounded-xl shadow-md overflow-hidden text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your Activity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-white/70 text-sm">Reviews</p>
                    <p className="text-3xl font-bold mt-1">12</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-white/70 text-sm">Contributions</p>
                    <p className="text-3xl font-bold mt-1">28</p>
                  </div>
                </div>
                <div className="mt-4 text-center pt-2">
                  <a href="#" className="inline-block bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors">
                    View All Activity
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Additional Info Card
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md overflow-hidden text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold">Did you know?</h3>
                </div>
                <p className="text-white/90 mb-3">Complete your profile to increase visibility and connect with more members of the community.</p>
                <div className="w-full bg-white/20 rounded-full h-2 mb-1">
                  <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-white/70">Profile completeness: 75%</p>
              </div>
            </motion.div> */}
          </div>
        </div>
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
              <div className="bg-gradient-to-r from-[#6D0B24] to-[#860033] py-4 px-6 flex items-center justify-between">
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

                  <div>
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
                  </div>

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
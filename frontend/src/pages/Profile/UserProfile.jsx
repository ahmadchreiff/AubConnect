import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setUpdateSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.put(
        'http://localhost:5001/api/users/profile',
        { name, username },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEditMode(false);
      setUpdateSuccess(true);

      // Show success message for 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(
        error.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D0B24]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gradient-to-r from-[#6D0B24] to-[#860033] h-40 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-white text-[#6D0B24] font-bold text-4xl flex items-center justify-center shadow-md">
                {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>

            <div className="px-8 py-8">
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
                {currentUser?.name}
              </h2>

              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:outline-none focus:ring-[#6D0B24] focus:border-[#6D0B24]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:outline-none focus:ring-[#6D0B24] focus:border-[#6D0B24]"
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end space-x-4 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setName(currentUser.name);
                        setUsername(currentUser.username);
                        setError('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D0B24] hover:bg-[#860033] transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="space-y-4 divide-y divide-gray-200">
                      <div className="pt-4 first:pt-0">
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="mt-1 text-gray-800 font-medium">{currentUser?.name}</p>
                      </div>
                      <div className="pt-4">
                        <p className="text-sm font-medium text-gray-500">Username</p>
                        <p className="mt-1 text-gray-800 font-medium">{currentUser?.username}</p>
                      </div>
                      <div className="pt-4">
                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                        <p className="mt-1 text-gray-800 font-medium">{currentUser?.email}</p>
                      </div>
                      <div className="pt-4">
                        <p className="text-sm font-medium text-gray-500">Member Since</p>
                        <p className="mt-1 text-gray-800 font-medium">
                          {currentUser?.createdAt 
                            ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {updateSuccess && (
                    <div className="bg-green-50 text-green-800 rounded-md p-4 mb-6 flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Profile updated successfully!
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => setEditMode(true)}
                      className="w-full px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D0B24] hover:bg-[#860033] transition-colors"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
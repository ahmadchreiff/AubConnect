import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Navbar from '../Components/Navbar';

const UserProfile = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setUsername(currentUser.username);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5001/api/users/reviews', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
        setError('Failed to load your reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchUserReviews();
    }
  }, [isAuthenticated]);

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
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-[#6D0B24] h-32 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-white text-[#6D0B24] font-bold text-3xl flex items-center justify-center">
                  {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              </div>

              <div className="px-6 py-6">
                <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
                  {currentUser?.name}
                </h2>

                {editMode ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#6D0B24] focus:border-[#6D0B24]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#6D0B24] focus:border-[#6D0B24]"
                        required
                      />
                    </div>

                    {error && (
                      <div className="text-red-600 text-sm py-2">{error}</div>
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
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D0B24] hover:bg-[#860033]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="text-gray-800">{currentUser?.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">{currentUser?.email}</p>
                    </div>

                    {updateSuccess && (
                      <div className="bg-green-50 text-green-800 rounded-md p-2 text-sm">
                        Profile updated successfully!
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        onClick={() => setEditMode(true)}
                        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D0B24] hover:bg-[#860033]"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Reviews */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">My Reviews</h2>

              {userReviews.length === 0 ? (
                <div className="text-center py-6">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't written any reviews yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {userReviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {review.course?.name || 'Unknown Course'}
                        </h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
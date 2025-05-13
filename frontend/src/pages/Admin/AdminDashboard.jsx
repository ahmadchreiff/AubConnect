import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('https://aubconnectbackend-h22c.onrender.com/api/admin/stats');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to load platform statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D0B24]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#6D0B24] mb-1 sm:mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Welcome back, {currentUser.name}. Here's an overview of your platform.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded transition flex items-center justify-center w-full sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V8.5a1 1 0 00-1-1h-2a1 1 0 100 2h1v5.5H4V5h5.5v1a1 1 0 102 0V4a1 1 0 00-1-1H3z"
                clipRule="evenodd"
              />
              <path
                d="M14.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L15.586 6H8a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm sm:text-base">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-3xl sm:text-4xl font-bold text-[#6D0B24]">{stats.users.total}</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            +{stats.users.newInLast30Days} new in last 30 days
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Total Reviews</h2>
          <p className="text-3xl sm:text-4xl font-bold text-[#6D0B24]">{stats.content.reviews}</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            +{stats.content.newReviewsInLast30Days} new in last 30 days
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Courses</h2>
          <p className="text-3xl sm:text-4xl font-bold text-[#6D0B24]">{stats.content.courses}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Professors</h2>
          <p className="text-3xl sm:text-4xl font-bold text-[#6D0B24]">{stats.content.professors}</p>
        </div>
      </div>

      {/* User Status Overview */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">User Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
            <h3 className="font-medium text-green-700 text-sm sm:text-base">Active Users</h3>
            <p className="text-xl sm:text-2xl font-bold text-green-700">{stats.users.active}</p>
            <p className="text-xs sm:text-sm text-green-600">
              {((stats.users.active / stats.users.total) * 100).toFixed(1)}% of total
            </p>
          </div>

          <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
            <h3 className="font-medium text-yellow-700 text-sm sm:text-base">Suspended Users</h3>
            <p className="text-xl sm:text-2xl font-bold text-yellow-700">{stats.users.suspended}</p>
            <p className="text-xs sm:text-sm text-yellow-600">
              {((stats.users.suspended / stats.users.total) * 100).toFixed(1)}% of total
            </p>
          </div>

          <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
            <h3 className="font-medium text-red-700 text-sm sm:text-base">Banned Users</h3>
            <p className="text-xl sm:text-2xl font-bold text-red-700">{stats.users.banned}</p>
            <p className="text-xs sm:text-sm text-red-600">
              {((stats.users.banned / stats.users.total) * 100).toFixed(1)}% of total
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <Link
            to="/admin/users"
            className="block p-3 sm:p-4 bg-[#6D0B24] text-white rounded-lg hover:bg-[#5a0a1e] transition"
          >
            <h3 className="font-medium text-base sm:text-lg">User Management</h3>
            <p className="text-xs sm:text-sm opacity-80">View, suspend, or ban users</p>
          </Link>

          <Link
            to="/admin/reviews"
            className="block p-3 sm:p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            <h3 className="font-medium text-base sm:text-lg">Review Management</h3>
            <p className="text-xs sm:text-sm opacity-80">Moderate and manage reviews</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
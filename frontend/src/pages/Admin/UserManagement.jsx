import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Fetch users
  const fetchUsers = async (page = 1, searchTerm = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`https://aubconnectbackend-h22c.onrender.com/api/admin/users`, {
        params: {
          page,
          limit: pagination.limit,
          search: searchTerm
        }
      });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, search);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchUsers(newPage, search);
  };

  // Open modal for user action
  const openActionModal = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setActionType('');
    setActionReason('');
  };

  // Handle user status update
  const handleUpdateUserStatus = async () => {
    if (!selectedUser || !actionType) return;
    
    setProcessing(true);
    
    let newStatus;
    switch (actionType) {
      case 'suspend':
        newStatus = 'suspended';
        break;
      case 'ban':
        newStatus = 'banned';
        break;
      case 'activate':
        newStatus = 'active';
        break;
      default:
        setProcessing(false);
        return;
    }
    
    try {
      await axios.put('https://aubconnectbackend-h22c.onrender.com/api/admin/users/status', {
        userId: selectedUser._id,
        status: newStatus
      });
      
      // Update user in the list
      setUsers(users.map(user => 
        user._id === selectedUser._id 
          ? { ...user, status: newStatus } 
          : user
      ));
      
      closeModal();
    } catch (err) {
      console.error('Error updating user status:', err);
      setError(`Failed to ${actionType} user`);
    } finally {
      setProcessing(false);
    }
  };

  // Handle role update
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await axios.put('https://aubconnectbackend-h22c.onrender.com/api/admin/users/role', {
        userId,
        role: newRole
      });
      
      // Update user in the list
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, role: newRole } 
          : user
      ));
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(`Failed to update user role`);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor, textColor;
    switch (status) {
      case 'active':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'suspended':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'banned':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Role badge component
  const RoleBadge = ({ role }) => {
    const bgColor = role === 'admin' ? 'bg-purple-100' : 'bg-blue-100';
    const textColor = role === 'admin' ? 'text-purple-800' : 'text-blue-800';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D0B24]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#6D0B24] mb-1">User Management</h1>
          <p className="text-sm md:text-base text-gray-600">Manage and monitor user accounts</p>
        </div>
        <div className="w-full md:w-auto flex justify-end">
          <Link
            to="/admin/dashboard"
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition text-sm md:text-base w-full md:w-auto text-center"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm md:text-base">
          <p>{error}</p>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="flex-grow">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, username, or email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D0B24] text-sm md:text-base"
            />
          </div>
          <button
            type="submit"
            className="bg-[#6D0B24] hover:bg-[#5a0a1e] text-white px-6 py-2 rounded-lg transition text-sm md:text-base whitespace-nowrap"
          >
            Search Users
          </button>
        </form>
      </div>

      {/* Users Table - Mobile View */}
      <div className="lg:hidden space-y-4 mb-6">
        {users.map((user) => (
          <div key={user._id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="font-medium text-gray-900 truncate">{user.name}</div>
                <div className="text-sm text-gray-500 truncate">{user.email}</div>
                <div className="text-xs text-gray-400">@{user.username}</div>
              </div>
              <div className="ml-4 flex flex-col items-end space-y-1">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </div>
              
              <div className="flex space-x-2">
                {user.role !== 'admin' && (
                  <>
                    {user.status === 'active' ? (
                      <>
                        <button
                          onClick={() => openActionModal(user, 'suspend')}
                          className="text-xs text-yellow-600 hover:text-yellow-800 px-2 py-1 border border-yellow-200 rounded"
                        >
                          Suspend
                        </button>
                        <button
                          onClick={() => openActionModal(user, 'ban')}
                          className="text-xs text-red-600 hover:text-red-800 px-2 py-1 border border-red-200 rounded"
                        >
                          Ban
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => openActionModal(user, 'activate')}
                        className="text-xs text-green-600 hover:text-green-800 px-2 py-1 border border-green-200 rounded"
                      >
                        Activate
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {user.role !== 'admin' && (
              <div className="mt-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleUpdateUserRole(user._id, user.role === 'admin' ? 'student' : 'admin')}
                  className={`text-xs px-3 py-1 rounded ${
                    user.role === 'admin' 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-[#6D0B24] text-white hover:bg-[#5a0a1e]'
                  }`}
                >
                  {user.role === 'admin' ? 'Make Student' : 'Make Admin'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Users Table - Medium & Desktop View */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <RoleBadge role={user.role} />
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleUpdateUserRole(user._id, 'admin')}
                          className="ml-2 text-xs text-[#6D0B24] hover:text-[#5a0a1e] underline"
                        >
                          Make Admin
                        </button>
                      )}
                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleUpdateUserRole(user._id, 'student')}
                          className="ml-2 text-xs text-gray-600 hover:text-gray-800 underline"
                        >
                          Make Student
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.role !== 'admin' && (
                      <div className="space-x-2">
                        {user.status === 'active' && (
                          <>
                            <button
                              onClick={() => openActionModal(user, 'suspend')}
                              className="text-yellow-600 hover:text-yellow-800"
                            >
                              Suspend
                            </button>
                            <button
                              onClick={() => openActionModal(user, 'ban')}
                              className="text-red-600 hover:text-red-800"
                            >
                              Ban
                            </button>
                          </>
                        )}
                        {user.status !== 'active' && (
                          <button
                            onClick={() => openActionModal(user, 'activate')}
                            className="text-green-600 hover:text-green-800"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
              className={`px-3 py-1 rounded border text-sm ${
                pagination.page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-[#6D0B24] hover:bg-gray-50'
              }`}
            >
              &larr; Prev
            </button>
            
            {[...Array(pagination.pages)].map((_, index) => {
              // Show limited page numbers on mobile
              if (window.innerWidth < 640 && 
                  Math.abs(index + 1 - pagination.page) > 1 && 
                  index + 1 !== 1 && 
                  index + 1 !== pagination.pages) {
                if (Math.abs(index + 1 - pagination.page) === 2) {
                  return <span key={index} className="px-1">...</span>;
                }
                return null;
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded border text-sm ${
                    pagination.page === index + 1
                      ? 'bg-[#6D0B24] text-white'
                      : 'bg-white text-[#6D0B24] hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
              disabled={pagination.page === pagination.pages}
              className={`px-3 py-1 rounded border text-sm ${
                pagination.page === pagination.pages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-[#6D0B24] hover:bg-gray-50'
              }`}
            >
              Next &rarr;
            </button>
          </nav>
        </div>
      )}

      {/* Action Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {actionType === 'suspend'
                  ? 'Suspend User'
                  : actionType === 'ban'
                  ? 'Ban User'
                  : 'Activate User'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="mb-4 text-gray-600">
              {actionType === 'suspend'
                ? 'Are you sure you want to suspend this user? They will be temporarily unable to log in.'
                : actionType === 'ban'
                ? 'Are you sure you want to ban this user? This will permanently restrict their access.'
                : 'Are you sure you want to reactivate this user?'}
            </p>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-lg">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
            </div>
            
            {(actionType === 'suspend' || actionType === 'ban') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (optional):
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D0B24] text-sm"
                  rows="3"
                  placeholder="Enter reason for this action..."
                ></textarea>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUserStatus}
                disabled={processing}
                className={`px-4 py-2 rounded-lg transition text-white ${
                  actionType === 'activate'
                    ? 'bg-green-600 hover:bg-green-700'
                    : actionType === 'suspend'
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-red-600 hover:bg-red-700'
                } ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {processing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
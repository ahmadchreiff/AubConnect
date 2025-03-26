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
      const response = await axios.get(`http://localhost:5001/api/admin/users`, {
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
      await axios.put('http://localhost:5001/api/admin/users/status', {
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
      await axios.put('http://localhost:5001/api/admin/users/role', {
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#6D0B24] mb-2">User Management</h1>
          <p className="text-gray-600">Manage and monitor user accounts</p>
        </div>
        <Link
          to="/admin/dashboard"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
        >
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, username, or email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#6D0B24]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#6D0B24] hover:bg-[#5a0a1e] text-white px-6 py-2 rounded transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
              <tr key={user._id}>
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
                        className="ml-2 text-xs text-[#6D0B24] hover:text-[#5a0a1e]"
                      >
                        Make Admin
                      </button>
                    )}
                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleUpdateUserRole(user._id, 'student')}
                        className="ml-2 text-xs text-gray-600 hover:text-gray-800"
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
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Suspend
                          </button>
                          <button
                            onClick={() => openActionModal(user, 'ban')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Ban
                          </button>
                        </>
                      )}
                      {user.status !== 'active' && (
                        <button
                          onClick={() => openActionModal(user, 'activate')}
                          className="text-green-600 hover:text-green-900"
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

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
              className={`px-3 py-1 rounded border ${
                pagination.page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-[#6D0B24] hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            {[...Array(pagination.pages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded border ${
                  pagination.page === index + 1
                    ? 'bg-[#6D0B24] text-white'
                    : 'bg-white text-[#6D0B24] hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
              disabled={pagination.page === pagination.pages}
              className={`px-3 py-1 rounded border ${
                pagination.page === pagination.pages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-[#6D0B24] hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Action Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {actionType === 'suspend'
                ? 'Suspend User'
                : actionType === 'ban'
                ? 'Ban User'
                : 'Activate User'}
            </h2>
            
            <p className="mb-4">
              {actionType === 'suspend'
                ? 'Are you sure you want to suspend this user? They will be temporarily unable to log in.'
                : actionType === 'ban'
                ? 'Are you sure you want to ban this user? This will permanently restrict their access.'
                : 'Are you sure you want to reactivate this user?'}
            </p>
            
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="font-medium">{selectedUser.name}</p>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
              <p className="text-xs text-gray-400">@{selectedUser.username}</p>
            </div>
            
            {(actionType === 'suspend' || actionType === 'ban') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (optional):
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#6D0B24]"
                  rows="3"
                  placeholder="Enter reason for this action..."
                ></textarea>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUserStatus}
                disabled={processing}
                className={`px-4 py-2 rounded transition text-white ${
                  actionType === 'activate'
                    ? 'bg-green-600 hover:bg-green-700'
                    : actionType === 'suspend'
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-red-600 hover:bg-red-700'
                } ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {processing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
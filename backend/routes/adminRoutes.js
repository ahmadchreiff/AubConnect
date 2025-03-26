const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { 
  getPlatformStats,
  getAllUsers,
  updateUserStatus,
  updateUserRole
} = require('../controllers/adminController');

// All routes in this file require authentication and admin privileges
router.use(auth);
router.use(adminAuth);

// Get platform statistics
router.get('/stats', getPlatformStats);

// Get all users with pagination
router.get('/users', getAllUsers);

// Update user status (ban/suspend/activate)
router.put('/users/status', updateUserStatus);

// Update user role
router.put('/users/role', updateUserRole);

module.exports = router;
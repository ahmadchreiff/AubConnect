const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { 
  getPlatformStats,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getAllReviews,  // Add these new functions
  approveReview,
  rejectReview,
  deleteReview
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

// Get all reviews with pagination, filtering, and search
router.get('/reviews', getAllReviews);

// Approve a review
router.patch('/reviews/:reviewId/approve', approveReview);

// Reject a review
router.patch('/reviews/:reviewId/reject', rejectReview);

// Delete a review
router.delete('/reviews/:reviewId', deleteReview);

module.exports = router;
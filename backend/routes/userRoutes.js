const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getUserProfile, 
  getUserReviews,
  updateUserProfile,
  checkAuth
} = require('../controllers/userController');

// All routes in this file are protected
router.use(auth);

// Get current user profile
router.get('/profile', getUserProfile);

// Get user reviews
router.get('/reviews', getUserReviews);

// Update user profile
router.put('/profile', updateUserProfile);

// Check if user is authenticated
router.get('/check-auth', checkAuth);

module.exports = router;
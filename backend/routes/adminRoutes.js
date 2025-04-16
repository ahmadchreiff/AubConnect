const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Review = require('../models/Review');
const { 
  getPlatformStats,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getAllReviews,
  approveReview,
  rejectReview,
  deleteReview,
  getReportedReviews
} = require('../controllers/adminController');

// All routes in this file require authentication and admin privileges
router.use(auth);
router.use(adminAuth);

// Platform statistics
router.get('/stats', getPlatformStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/status', updateUserStatus);
router.put('/users/role', updateUserRole);

// Review management
router.get('/reviews', getAllReviews);
router.patch('/reviews/:reviewId/approve', approveReview);
router.patch('/reviews/:reviewId/reject', rejectReview);
router.delete('/reviews/:reviewId', deleteReview);

// Reported reviews
router.get('/reviews/reported', getReportedReviews);
// In adminRoutes.js
router.patch('/reviews/:reviewId/clear-reports', async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: 'Review not found',
        error: 'REVIEW_NOT_FOUND' 
      });
    }
    
    review.reports = [];
    review.reportCount = 0;
    await review.save();
    
    res.status(200).json({ 
      success: true,
      message: 'Reports cleared successfully',
      review
    });
  } catch (err) {
    console.error('Error clearing reports:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
});

router.patch('/reviews/:reviewId/reject', async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: 'Review not found',
        error: 'REVIEW_NOT_FOUND' 
      });
    }
    
    review.status = 'rejected';
    await review.save();
    
    res.status(200).json({ 
      success: true,
      message: 'Review rejected successfully',
      review
    });
  } catch (err) {
    console.error('Error rejecting review:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
});

module.exports = router;
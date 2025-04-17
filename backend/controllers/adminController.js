const User = require('../models/User');
const Review = require('../models/Review');
const Course = require('../models/Course');
const Professor = require('../models/Professor');
const Department = require('../models/Department');

// Get platform statistics
const getPlatformStats = async (req, res) => {
  try {
    // Get counts from each collection
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });
    const bannedUsers = await User.countDocuments({ status: 'banned' });
    
    const totalReviews = await Review.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalProfessors = await Professor.countDocuments();
    const totalDepartments = await Department.countDocuments();
    
    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const newReviews = await Review.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    
    res.status(200).json({
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers,
        banned: bannedUsers,
        newInLast30Days: newUsers
      },
      content: {
        reviews: totalReviews,
        courses: totalCourses,
        professors: totalProfessors,
        departments: totalDepartments,
        newReviewsInLast30Days: newReviews
      }
    });
  } catch (err) {
    console.error('Error getting platform stats:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all users with pagination
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    
    // Create search query
    const searchQuery = search 
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        } 
      : {};
    
    // Get users with pagination
    const users = await User.find(searchQuery)
      .select('-password -verificationCode -verificationCodeExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await User.countDocuments(searchQuery);
    
    res.status(200).json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error getting all users:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update user status (ban/suspend/activate)
const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;
  
  try {
    // Validate status
    if (!['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status', error: 'INVALID_STATUS' });
    }
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', error: 'USER_NOT_FOUND' });
    }
    
    // Don't allow admins to ban/suspend other admins
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot change status of admin users', error: 'ADMIN_PROTECTED' });
    }
    
    // Update user status
    user.status = status;
    await user.save();
    
    res.status(200).json({ 
      message: `User status updated to ${status}`,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Error updating user status:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  const { userId, role } = req.body;
  
  try {
    // Validate role
    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role', error: 'INVALID_ROLE' });
    }
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', error: 'USER_NOT_FOUND' });
    }
    
    // Update user role
    user.role = role;
    await user.save();
    
    res.status(200).json({ 
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all reviews with pagination and filtering
const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search || '';
    
    // Create filter query
    let filterQuery = {};
    
    // Add status filter if provided
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filterQuery.status = status;
    }
    
    // Add search filter if provided
    if (search) {
      filterQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { reviewText: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get reviews with pagination
    const reviews = await Review.find(filterQuery)
      .populate('course', 'code name')
      .populate('professor', 'name department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Review.countDocuments(filterQuery);
    
    res.status(200).json({
      reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error getting all reviews:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Approve a review
const approveReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found', error: 'REVIEW_NOT_FOUND' });
    }
    
    review.status = 'approved';
    await review.save();
    
    res.status(200).json({ 
      message: 'Review approved successfully',
      review
    });
  } catch (err) {
    console.error('Error approving review:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reject a review
const rejectReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found', error: 'REVIEW_NOT_FOUND' });
    }
    
    review.status = 'rejected';
    await review.save();
    
    res.status(200).json({ 
      message: 'Review rejected successfully',
      review
    });
  } catch (err) {
    console.error('Error rejecting review:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found', error: 'REVIEW_NOT_FOUND' });
    }
    
    await Review.findByIdAndDelete(reviewId);
    
    res.status(200).json({ 
      message: 'Review deleted successfully',
      reviewId
    });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const getReportedReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ reportCount: { $gt: 0 } })
      .populate('course', 'code name')
      .populate('professor', 'name department')
      .sort({ reportCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments({ reportCount: { $gt: 0 } });
    
    res.status(200).json({
      reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error getting reported reviews:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getAllReviews,  // Add these new functions
  approveReview,
  rejectReview,
  deleteReview,
  getReportedReviews
};
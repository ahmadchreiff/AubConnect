const User = require('../models/User');
const Review = require('../models/Review');

// Get current user profile
const getUserProfile = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    const user = req.user;
    
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Error getting user profile:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Get user reviews
const getUserReviews = async (req, res) => {
  try {
    // Find all reviews by the current user's username (not user ID)
    const reviews = await Review.find({ username: req.user.username })
      .populate('course', 'name courseNumber')
      .populate('department', 'name code')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ reviews });
  } catch (err) {
    console.error('Error getting user reviews:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { name, username } = req.body;
  
  try {
    // Check if username is being changed and if it already exists
    if (username && username !== req.user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username already taken', error: 'USERNAME_EXISTS' });
      }
    }
    
    // Update user information
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, username },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Check if user is authenticated (useful for frontend route protection)
const checkAuth = async (req, res) => {
  // If middleware passed, user is authenticated
  res.status(200).json({ 
    isAuthenticated: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      username: req.user.username,
      createdAt: req.user.createdAt
    }
  });
};

module.exports = {
  getUserProfile,
  getUserReviews,
  updateUserProfile,
  checkAuth
};
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    // The auth middleware should already have attached the user to the request
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required', error: 'NO_AUTH' });
    }

    // Check if user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.', error: 'NOT_ADMIN' });
    }

    // Check if the admin's account is active
    if (req.user.status !== 'active') {
      return res.status(403).json({ message: 'Your account has been suspended or banned', error: 'ACCOUNT_INACTIVE' });
    }

    // User is an admin, proceed
    next();
  } catch (err) {
    console.error('Admin auth middleware error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = adminAuth;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied', error: 'NO_TOKEN' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found', error: 'USER_NOT_FOUND' });
    }

    // Check if the user is banned or suspended
    if (user.status !== 'active') {
      return res.status(403).json({ 
        message: 'Your account has been suspended or banned', 
        error: 'ACCOUNT_INACTIVE' 
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', error: 'TOKEN_EXPIRED' });
    }
    
    return res.status(401).json({ message: 'Invalid token', error: 'INVALID_TOKEN' });
  }
};

module.exports = auth;
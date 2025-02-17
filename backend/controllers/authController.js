// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Signup
const signup = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists', error: 'EMAIL_ALREADY_EXISTS' });
    }

    // Check if username is already taken
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username is already taken', error: 'USERNAME_ALREADY_EXISTS' });
    }

    // Create new user
    user = new User({ name, username, email, password });
    await user.save();

    // Generate JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error("Error during signup:", err); // Log detailed error
    res.status(500).json({ message: 'Server error occurred', error: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials - User not found', error: 'USER_NOT_FOUND' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials - Incorrect password', error: 'INCORRECT_PASSWORD' });
    }

    // Generate JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error during login:", err); // Log detailed error
    res.status(500).json({ message: 'Server error occurred', error: err.message });
  }
};

module.exports = { signup, login };

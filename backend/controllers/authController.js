const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../services/emailService');
const crypto = require('crypto');

// Generate a random 6-digit verification code
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Temporary storage for unverified users (in-memory for simplicity)
const unverifiedUsers = {};

// Send verification code
const sendVerificationCode = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    // Check if the email or username is already registered
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already registered', error: 'EMAIL_OR_USERNAME_EXISTS' });
    }

    // Generate a verification code
    const verificationCode = generateVerificationCode();

    // Store user data temporarily
    unverifiedUsers[email] = {
      name,
      username,
      email,
      password,
      verificationCode,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    // Send the verification code via email
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (err) {
    console.error('Error sending verification code:', err);
    res.status(500).json({ message: 'Failed to send verification code', error: err.message });
  }
};

// Verify the code and register the user
const verifyCode = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    // Retrieve the unverified user
    const userData = unverifiedUsers[email];
    if (!userData) {
      return res.status(404).json({ message: 'User not found', error: 'USER_NOT_FOUND' });
    }

    // Check if the code matches and is not expired
    if (
      userData.verificationCode === verificationCode &&
      userData.verificationCodeExpires > Date.now()
    ) {
      // Create the user in the database
      const user = new User({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        isVerified: true,
      });
      await user.save();

      // Remove the user from temporary storage
      delete unverifiedUsers[email];

      // Generate JWT
      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: 'Email verified and user registered successfully', token });
    } else {
      res.status(400).json({ message: 'Invalid or expired verification code', error: 'INVALID_VERIFICATION_CODE' });
    }
  } catch (err) {
    console.error('Error verifying code:', err);
    res.status(500).json({ message: 'Failed to verify code', error: err.message });
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

    // Generate JWT with user's username included
    const payload = { 
      userId: user._id,
      username: user.username, // Include the username in the token
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return success response with redirect URL
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      redirectUrl: "/homepage" 
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error occurred', error: err.message });
  }
};
// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials - User not found', error: 'USER_NOT_FOUND' });
//     }

//     // Compare passwords
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials - Incorrect password', error: 'INCORRECT_PASSWORD' });
//     }

//     // Generate JWT
//     const payload = { userId: user._id };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     // Return success response with redirect URL
//     res.status(200).json({ 
//       message: 'Login successful', 
//       token, 
//       redirectUrl: "/homepage" // Redirect to the homepage
//     });
//   } catch (err) {
//     console.error('Error during login:', err);
//     res.status(500).json({ message: 'Server error occurred', error: err.message });
//   }
// };

module.exports = { sendVerificationCode, verifyCode, login };
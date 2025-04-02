const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../services/emailService');

const isPasswordResetRequest = (req) => {
  return req.get('X-Request-Type') === 'password-reset' || 
         req.originalUrl.includes('forgot-password');
};

// Generate a random 6-digit verification code
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Temporary storage for unverified users (in-memory for simplicity)
const unverifiedUsers = {};

// Send verification code
const sendVerificationCode = async (req, res) => {
  if (isPasswordResetRequest(req)) {
    return requestPasswordReset(req, res); // Handle as password reset
  }
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

//     // Generate JWT with user's username included
//     const payload = { 
//       userId: user._id,
//       username: user.username, // Include the username in the token
//     };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     // Return success response with redirect URL
//     res.status(200).json({ 
//       message: 'Login successful', 
//       token, 
//       redirectUrl: "/homepage" 
//     });
//   } catch (err) {
//     console.error('Error during login:', err);
//     res.status(500).json({ message: 'Server error occurred', error: err.message });
//   }
// };
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
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Return success response with user data and redirect URL
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username
      },
      redirectUrl: "/homepage" 
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error occurred', error: err.message });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reset Pass
const passwordResetRequests = {};

const sendPasswordResetCode = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Generate 6-digit code (same as verification)
    const resetCode = crypto.randomInt(100000, 999999).toString();
    
    // 2. Store in temporary object (same as verification)
    passwordResetRequests[email] = {
      resetCode,
      expires: Date.now() + 600000 // 10 minutes
    };

    // 3. Send email (same pattern as verification)
    await emailService.sendPasswordResetCode(email, resetCode);

    // 4. Return success (same structure as verification)
    return res.status(200).json({ 
      message: "Password reset code sent",
      debugCode: process.env.NODE_ENV === 'development' ? resetCode : undefined
    });

  } catch (err) {
    console.error("Password reset error:", err);
    return res.status(200).json({ 
      message: "If this email exists, a reset code has been sent"
    });
  }
};

const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  console.log(`Verification attempt - Email: ${email}, Code: ${code}`); // Debug log

  try {
    // 1. Find the reset request
    const request = passwordResetRequests[email];
    
    console.log('Stored request:', request); // Debug log

    if (!request) {
      console.log('No request found for email:', email);
      return res.status(400).json({ 
        success: false,
        error: 'NO_REQUEST_FOUND',
        message: 'No password reset request found. Please request a new code.'
      });
    }

    // 2. Check expiration
    if (request.expires < Date.now()) {
      console.log('Expired code - Current time:', Date.now(), 'Expires:', request.expires);
      delete passwordResetRequests[email];
      return res.status(400).json({ 
        success: false,
        error: 'EXPIRED_CODE',
        message: 'Verification code has expired. Please request a new one.'
      });
    }

    // 3. Verify code (case-sensitive exact match)
    const sanitizedCode = code.toString().trim();
    console.log('Comparing codes - Input:', sanitizedCode, 'Stored:', request.resetCode);
    
    if (request.resetCode !== sanitizedCode) {
      return res.status(400).json({ 
        success: false,
        error: 'INVALID_CODE',
        message: 'Invalid verification code. Please check the code and try again.'
      });
    }

    // 4. Generate token
    const resetToken = jwt.sign(
      { email, purpose: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    console.log('Code verification successful for email:', email);
    return res.status(200).json({
      success: true,
      message: 'Verification successful',
      token: resetToken
    });

  } catch (err) {
    console.error('Verification error:', err);
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'An error occurred during verification.'
    });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // 1. Verify token (same as auth middleware)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.purpose !== 'password_reset') {
      return res.status(401).json({ 
        message: 'Invalid token', 
        error: 'INVALID_TOKEN' 
      });
    }

    // 2. Update password (standard mongoose update)
    const user = await User.findOne({ email: decoded.email });
    user.password = newPassword;
    await user.save();

    // 3. Clean up
    delete passwordResetRequests[decoded.email];

    return res.status(200).json({ 
      message: 'Password reset successful' 
    });

  } catch (err) {
    console.error("Reset error:", err);
    return res.status(500).json({ 
      message: 'Failed to reset password',
      error: err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'SERVER_ERROR'
    });
  }
};

// Update exports
module.exports = {
  sendVerificationCode,
  verifyCode,
  login,
  getCurrentUser,
  sendPasswordResetCode,
  verifyResetCode,
  resetPassword

};

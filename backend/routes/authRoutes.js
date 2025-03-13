const express = require('express');
const router = express.Router();
const { sendVerificationCode, verifyCode, login, getCurrentUser } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Route to send verification code
router.post('/send-verification-code', sendVerificationCode);

// Route to verify the code
router.post('/verify-code', verifyCode);

// Route to log in
router.post('/login', login);

// Route to get current user (protected)
router.get('/me', auth, getCurrentUser);

module.exports = router;
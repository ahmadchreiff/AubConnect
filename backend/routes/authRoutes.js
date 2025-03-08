const express = require('express');
const router = express.Router();
const { sendVerificationCode, verifyCode, login } = require('../controllers/authController');

// Route to send verification code
router.post('/send-verification-code', sendVerificationCode);

// Route to verify the code
router.post('/verify-code', verifyCode);

// Route to log in
router.post('/login', login);

module.exports = router;
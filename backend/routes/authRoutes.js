const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Route to send verification code
router.post('/send-verification-code', authController.sendVerificationCode);

// Route to verify the code
router.post('/verify-code', authController.verifyCode);

// Route to log in
router.post('/login', authController.login);

// Route to get current user (protected)
router.get('/me', auth, authController.getCurrentUser);

// Password reset routes 
router.post('/forgot-password', authController.sendPasswordResetCode);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', authController.resetPassword);
module.exports = router;
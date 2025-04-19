const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const verifyRecaptcha = require('../middleware/recaptcha'); // Add this

// Apply reCAPTCHA middleware to login and signup routes
router.post('/login', verifyRecaptcha, authController.login);
router.post('/send-verification-code', verifyRecaptcha, authController.sendVerificationCode);

// Keep other routes as they are
router.post('/verify-code', authController.verifyCode);
router.get('/me', auth, authController.getCurrentUser);
router.post('/forgot-password', authController.sendPasswordResetCode);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
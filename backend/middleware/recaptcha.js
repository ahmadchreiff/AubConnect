const axios = require('axios');

const verifyRecaptcha = async (req, res, next) => {
  try {
    const { recaptchaToken } = req.body;
    
    // Skip verification in development if needed
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_RECAPTCHA === 'true') {
      return next();
    }
    
    // If no token is provided
    if (!recaptchaToken) {
      return res.status(400).json({ 
        message: 'reCAPTCHA verification failed', 
        error: 'RECAPTCHA_REQUIRED' 
      });
    }
    
    // Verify with Google
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const response = await axios.post(
      googleVerifyUrl, 
      null, 
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken
        }
      }
    );
    
    // Check Google's response
    if (!response.data.success) {
      return res.status(400).json({ 
        message: 'reCAPTCHA verification failed', 
        error: 'INVALID_RECAPTCHA' 
      });
    }
    
    // If verification is successful, continue
    next();
  } catch (err) {
    console.error('reCAPTCHA middleware error:', err);
    res.status(500).json({ 
      message: 'reCAPTCHA verification error', 
      error: err.message 
    });
  }
};

module.exports = verifyRecaptcha;
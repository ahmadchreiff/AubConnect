// Track login attempts - in-memory storage (for simplicity)
const loginAttempts = {};

// Constants
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

const loginRateLimiter = (req, res, next) => {
  const email = req.body.email;
  
  if (!email) {
    return next();
  }

  // Initialize if first attempt
  if (!loginAttempts[email]) {
    loginAttempts[email] = {
      count: 0,
      lastAttempt: Date.now(),
      lockedUntil: null
    };
  }

  const attempt = loginAttempts[email];
  const now = Date.now();

  // Check if account is locked
  if (attempt.lockedUntil && now < attempt.lockedUntil) {
    const minutesLeft = Math.ceil((attempt.lockedUntil - now) / 60000);
    return res.status(429).json({ 
      message: `Too many failed login attempts. Account locked for ${minutesLeft} more minutes.`,
      error: 'RATE_LIMITED',
      lockedUntil: attempt.lockedUntil
    });
  }

  // If lockout period is over, reset the counter
  if (attempt.lockedUntil && now >= attempt.lockedUntil) {
    attempt.count = 0;
    attempt.lockedUntil = null;
  }

  // Update last attempt time
  attempt.lastAttempt = now;
  
  // Continue to the next middleware
  next();
};

const trackLoginSuccess = (email) => {
  if (loginAttempts[email]) {
    // Reset attempts on successful login
    loginAttempts[email].count = 0;
    loginAttempts[email].lockedUntil = null;
  }
};

const trackLoginFailure = (email) => {
  if (!loginAttempts[email]) {
    return; // Should never happen but just in case
  }
  
  // Increment attempt counter
  loginAttempts[email].count += 1;
  
  // Lock account if max attempts exceeded
  if (loginAttempts[email].count >= MAX_ATTEMPTS) {
    loginAttempts[email].lockedUntil = Date.now() + LOCKOUT_TIME;
  }
};

module.exports = {
  loginRateLimiter,
  trackLoginSuccess,
  trackLoginFailure
};
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const { db } = require('../config/database');
const { createRateLimiter, logAuthAttempt } = require('../middleware/auth');
const winston = require('winston');

const router = express.Router();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

// Rate limiting for auth endpoints
const authRateLimiter = createRateLimiter(15 * 60 * 1000, 5, 'Too many authentication attempts');

// Validation schemas
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const passwordResetValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

const newPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

// Helper function to generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Register new user
router.post('/register', 
  authRateLimiter,
  logAuthAttempt,
  registerValidation,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password, firstName, lastName, location, phone } = req.body;

      // Check if user already exists
      const existingUser = await db('users')
        .where('email', email)
        .first();

      if (existingUser) {
        return res.status(409).json({
          error: 'User with this email already exists',
          code: 'USER_EXISTS'
        });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const [userId] = await db('users').insert({
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        location,
        phone,
        preferences: JSON.stringify({
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          privacy: {
            profileVisibility: 'public',
            showLocation: true,
            showContactInfo: false
          }
        })
      }).returning('id');

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(userId);

      // Store refresh token in database (for potential blacklisting)
      await db('refresh_tokens').insert({
        user_id: userId,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      // Get user data
      const user = await db('users')
        .select('id', 'email', 'first_name', 'last_name', 'avatar_url', 'created_at')
        .where('id', userId)
        .first();

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          avatarUrl: user.avatar_url,
          createdAt: user.created_at
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });

    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        error: 'Internal server error during registration',
        code: 'REGISTRATION_ERROR'
      });
    }
  }
);

// Login user
router.post('/login',
  authRateLimiter,
  logAuthAttempt,
  loginValidation,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await db('users')
        .where('email', email)
        .first();

      if (!user) {
        return res.status(401).json({
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Check if account is active
      if (!user.is_active) {
        return res.status(401).json({
          error: 'Account is deactivated. Please contact support.',
          code: 'ACCOUNT_DEACTIVATED'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user.id);

      // Store refresh token
      await db('refresh_tokens').insert({
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      // Update last active
      await db('users')
        .where('id', user.id)
        .update({ last_active: db.fn.now() });

      logger.info(`User logged in: ${email}`);

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          avatarUrl: user.avatar_url,
          lastActive: user.last_active
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });

    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        error: 'Internal server error during login',
        code: 'LOGIN_ERROR'
      });
    }
  }
);

// Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token is required',
        code: 'NO_REFRESH_TOKEN'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        error: 'Invalid token type',
        code: 'INVALID_TOKEN_TYPE'
      });
    }

    // Check if refresh token exists in database
    const storedToken = await db('refresh_tokens')
      .where('user_id', decoded.userId)
      .where('token', refreshToken)
      .where('expires_at', '>', new Date())
      .first();

    if (!storedToken) {
      return res.status(401).json({
        error: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Generate new tokens
    const newTokens = generateTokens(decoded.userId);

    // Update refresh token in database
    await db('refresh_tokens')
      .where('id', storedToken.id)
      .update({
        token: newTokens.refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

    res.json({
      message: 'Token refreshed successfully',
      tokens: newTokens
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Refresh token has expired',
        code: 'REFRESH_TOKEN_EXPIRED'
      });
    }

    logger.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Internal server error during token refresh',
      code: 'REFRESH_ERROR'
    });
  }
});

// Logout user
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remove refresh token from database
      await db('refresh_tokens')
        .where('token', refreshToken)
        .del();
    }

    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal server error during logout',
      code: 'LOGOUT_ERROR'
    });
  }
});

// Request password reset
router.post('/forgot-password',
  authRateLimiter,
  passwordResetValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email } = req.body;

      // Check if user exists
      const user = await db('users')
        .where('email', email)
        .first();

      if (!user) {
        // Don't reveal if user exists or not
        return res.json({
          message: 'If an account with that email exists, a password reset link has been sent'
        });
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.id, type: 'password-reset' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Store reset token
      await db('password_reset_tokens').insert({
        user_id: user.id,
        token: resetToken,
        expires_at: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      });

      // TODO: Send email with reset link
      // For now, just return success
      logger.info(`Password reset requested for: ${email}`);

      res.json({
        message: 'If an account with that email exists, a password reset link has been sent'
      });

    } catch (error) {
      logger.error('Password reset request error:', error);
      res.status(500).json({
        error: 'Internal server error during password reset request',
        code: 'PASSWORD_RESET_REQUEST_ERROR'
      });
    }
  }
);

// Reset password with token
router.post('/reset-password',
  newPasswordValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { token, password } = req.body;

      // Verify reset token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type !== 'password-reset') {
        return res.status(400).json({
          error: 'Invalid reset token',
          code: 'INVALID_RESET_TOKEN'
        });
      }

      // Check if token exists and is valid
      const resetToken = await db('password_reset_tokens')
        .where('user_id', decoded.userId)
        .where('token', token)
        .where('expires_at', '>', new Date())
        .first();

      if (!resetToken) {
        return res.status(400).json({
          error: 'Invalid or expired reset token',
          code: 'INVALID_RESET_TOKEN'
        });
      }

      // Hash new password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Update user password
      await db('users')
        .where('id', decoded.userId)
        .update({ password_hash: passwordHash });

      // Remove used reset token
      await db('password_reset_tokens')
        .where('id', resetToken.id)
        .del();

      // Invalidate all refresh tokens for security
      await db('refresh_tokens')
        .where('user_id', decoded.userId)
        .del();

      logger.info(`Password reset successful for user: ${decoded.userId}`);

      res.json({
        message: 'Password reset successful'
      });

    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({
          error: 'Invalid reset token',
          code: 'INVALID_RESET_TOKEN'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({
          error: 'Reset token has expired',
          code: 'RESET_TOKEN_EXPIRED'
        });
      }

      logger.error('Password reset error:', error);
      res.status(500).json({
        error: 'Internal server error during password reset',
        code: 'PASSWORD_RESET_ERROR'
      });
    }
  }
);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Handle successful Google OAuth
    const { accessToken, refreshToken } = generateTokens(req.user.id);
    
    // Redirect to frontend with tokens
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }
);

// LinkedIn OAuth routes
router.get('/linkedin',
  passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] })
);

router.get('/linkedin/callback',
  passport.authenticate('linkedin', { session: false }),
  (req, res) => {
    const { accessToken, refreshToken } = generateTokens(req.user.id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }
);

// GitHub OAuth routes
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    const { accessToken, refreshToken } = generateTokens(req.user.id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }
);

// Verify email endpoint
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Verification token is required',
        code: 'NO_VERIFICATION_TOKEN'
      });
    }

    // Verify token and update user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'email-verification') {
      return res.status(400).json({
        error: 'Invalid verification token',
        code: 'INVALID_VERIFICATION_TOKEN'
      });
    }

    await db('users')
      .where('id', decoded.userId)
      .update({ email_verified: true });

    res.json({
      message: 'Email verified successfully'
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        error: 'Invalid verification token',
        code: 'INVALID_VERIFICATION_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        error: 'Verification token has expired',
        code: 'VERIFICATION_TOKEN_EXPIRED'
      });
    }

    logger.error('Email verification error:', error);
    res.status(500).json({
      error: 'Internal server error during email verification',
      code: 'EMAIL_VERIFICATION_ERROR'
    });
  }
});

module.exports = router;

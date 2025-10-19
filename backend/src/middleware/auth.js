const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

// JWT token verification middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        error: 'Access denied. Invalid token format.',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded || !decoded.userId) {
        return res.status(401).json({
          error: 'Access denied. Invalid token.',
          code: 'INVALID_TOKEN'
        });
      }

      // Check if user exists and is active
      const user = await db('users')
        .select('id', 'email', 'first_name', 'last_name', 'avatar_url', 'is_active', 'last_active')
        .where('id', decoded.userId)
        .first();

      if (!user) {
        return res.status(401).json({
          error: 'Access denied. User not found.',
          code: 'USER_NOT_FOUND'
        });
      }

      if (!user.is_active) {
        return res.status(401).json({
          error: 'Access denied. Account is deactivated.',
          code: 'ACCOUNT_DEACTIVATED'
        });
      }

      // Update last active timestamp
      await db('users')
        .where('id', decoded.userId)
        .update({ last_active: db.fn.now() });

      // Add user info to request object
      req.user = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        avatarUrl: user.avatar_url,
        lastActive: user.last_active
      };

      // Add token info for potential refresh logic
      req.token = {
        token,
        decoded
      };

      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Access denied. Token has expired.',
          code: 'TOKEN_EXPIRED'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Access denied. Invalid token signature.',
          code: 'INVALID_SIGNATURE'
        });
      } else {
        logger.error('JWT verification error:', jwtError);
        return res.status(401).json({
          error: 'Access denied. Token verification failed.',
          code: 'VERIFICATION_FAILED'
        });
      }
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal server error during authentication.',
      code: 'AUTH_ERROR'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded && decoded.userId) {
          const user = await db('users')
            .select('id', 'email', 'first_name', 'last_name', 'avatar_url', 'is_active')
            .where('id', decoded.userId)
            .where('is_active', true)
            .first();

          if (user) {
            req.user = {
              id: user.id,
              email: user.email,
              firstName: user.first_name,
              lastName: user.last_name,
              avatarUrl: user.avatar_url
            };
          }
        }
      } catch (jwtError) {
        // Silently ignore JWT errors for optional auth
        logger.debug('Optional auth JWT error (ignored):', jwtError.message);
      }
    }
    
    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next(); // Continue without authentication
  }
};

// Role-based access control middleware
const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Access denied. Authentication required.',
          code: 'AUTH_REQUIRED'
        });
      }

      // Get user's role from database
      const userRole = await db('users')
        .select('role')
        .where('id', req.user.id)
        .first();

      if (!userRole || !roles.includes(userRole.role)) {
        return res.status(403).json({
          error: 'Access denied. Insufficient permissions.',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: roles,
          current: userRole?.role || 'none'
        });
      }

      next();
    } catch (error) {
      logger.error('Role middleware error:', error);
      return res.status(500).json({
        error: 'Internal server error during role verification.',
        code: 'ROLE_VERIFICATION_ERROR'
      });
    }
  };
};

// Rate limiting middleware for specific endpoints
const createRateLimiter = (windowMs, max, message) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old requests
    if (requests.has(key)) {
      requests.set(key, requests.get(key).filter(timestamp => timestamp > windowStart));
    }
    
    const currentRequests = requests.get(key) || [];
    
    if (currentRequests.length >= max) {
      return res.status(429).json({
        error: message || 'Too many requests, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    currentRequests.push(now);
    requests.set(key, currentRequests);
    
    next();
  };
};

// Logging middleware for authentication attempts
const logAuthAttempt = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { method, path, ip } = req;
    const { statusCode } = res;
    const userId = req.user?.id || 'anonymous';
    
    logger.info('API Request', {
      method,
      path,
      ip,
      statusCode,
      userId,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  requireRole,
  createRateLimiter,
  logAuthAttempt
};

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/app');
const { logger } = require('../config/database');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, config.security.jwtSecret, {
    expiresIn: config.security.jwtExpiresIn
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.security.jwtSecret);
  } catch (error) {
    throw new Error('Token tidak valid');
  }
};

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token akses diperlukan'
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }
    
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Akun tidak aktif'
      });
    }
    
    // Add user to request object
    req.user = user;
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error.message);
    
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau telah kedaluwarsa'
    });
  }
};

// Authorization middleware - check user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autentikasi diperlukan'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini'
      });
    }
    
    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
      
      if (user && user.is_active) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Check if user owns resource or is admin
const checkOwnership = (resourceUserIdField = 'author_id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autentikasi diperlukan'
      });
    }
    
    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if user owns the resource
    const resourceUserId = req.resource ? req.resource[resourceUserIdField] : null;
    
    if (resourceUserId && resourceUserId === req.user.id) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Anda hanya dapat mengakses resource milik Anda sendiri'
    });
  };
};

// Refresh token middleware
const refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token diperlukan'
      });
    }
    
    // Verify refresh token (you might want to store these in database)
    const decoded = verifyToken(refresh_token);
    
    // Get user
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token tidak valid'
      });
    }
    
    // Generate new access token
    const newAccessToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    res.json({
      success: true,
      data: {
        access_token: newAccessToken,
        token_type: 'Bearer',
        expires_in: config.security.jwtExpiresIn
      }
    });
    
  } catch (error) {
    logger.error('Refresh token error:', error.message);
    
    return res.status(401).json({
      success: false,
      message: 'Refresh token tidak valid atau telah kedaluwarsa'
    });
  }
};

// API Key authentication (for external services)
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API Key diperlukan'
    });
  }
  
  // In production, store API keys in database with proper hashing
  const validApiKeys = process.env.VALID_API_KEYS ? process.env.VALID_API_KEYS.split(',') : [];
  
  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      message: 'API Key tidak valid'
    });
  }
  
  next();
};

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  authorize,
  optionalAuth,
  checkOwnership,
  refreshToken,
  authenticateApiKey
};
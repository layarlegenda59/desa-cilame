const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/userController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validate, userSchemas } = require('../middleware/validation');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

// Apply rate limiting to all auth routes
router.use(authLimiter);

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 * @body    { name, email, username, password, phone }
 */
router.post('/register', 
  validate(userSchemas.register),
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 * @body    { email/username, password }
 */
router.post('/login',
  validate(userSchemas.login),
  login
);



/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate tokens)
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.post('/logout',
  authenticate,
  logout
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.get('/profile',
  authenticate,
  getProfile
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 * @headers Authorization: Bearer <token>
 * @body    { name, email, username, phone, bio, avatar_url }
 */
router.put('/profile',
  authenticate,
  validate(userSchemas.update),
  updateProfile
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 * @headers Authorization: Bearer <token>
 * @body    { currentPassword, newPassword }
 */
router.put('/change-password',
  authenticate,
  validate(userSchemas.changePassword),
  changePassword
);

module.exports = router;
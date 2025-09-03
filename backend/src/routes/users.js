const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  restoreUser,
  getUserStats
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  userUpdateSchema,
  paginationSchema,
  idSchema
} = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private (Admin)
 * @query   { page, limit, role, status, search, sortBy, sortOrder }
 */
router.get('/',
  authorize('admin'),
  validate(paginationSchema, 'query'),
  getAllUsers
);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics (admin only)
 * @access  Private (Admin)
 */
router.get('/stats',
  authorize('admin'),
  getUserStats
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (admin only)
 * @access  Private (Admin)
 * @params  { id }
 */
router.get('/:id',
  authorize('admin'),
  validate(idSchema, 'params'),
  getUserById
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user by ID (admin only)
 * @access  Private (Admin)
 * @params  { id }
 * @body    { name, email, username, phone, role, status, bio, avatar_url }
 */
router.put('/:id',
  authorize('admin'),
  validate(idSchema, 'params'),
  validate(userUpdateSchema),
  updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Soft delete user by ID (admin only)
 * @access  Private (Admin)
 * @params  { id }
 */
router.delete('/:id',
  authorize('admin'),
  validate(idSchema, 'params'),
  deleteUser
);

/**
 * @route   POST /api/users/:id/restore
 * @desc    Restore soft deleted user (admin only)
 * @access  Private (Admin)
 * @params  { id }
 */
router.post('/:id/restore',
  authorize('admin'),
  validate(idSchema, 'params'),
  restoreUser
);

module.exports = router;
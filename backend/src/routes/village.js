const express = require('express');
const {
  getVillageOfficials,
  getVillageOfficialById,
  createVillageOfficial,
  updateVillageOfficial,
  deleteVillageOfficial,
  getVillageStatistics,
  updateVillageStatistics,
  getVillageDocuments,
  downloadDocument
} = require('../controllers/villageController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  paginationSchema,
  idSchema
} = require('../middleware/validation');

const router = express.Router();

// Public routes (no authentication required)

/**
 * @route   GET /api/village/officials
 * @desc    Get all village officials (public)
 * @access  Public
 * @query   { page, limit, position, status, search, sortBy, sortOrder }
 */
router.get('/officials',
  validate(paginationSchema, 'query'),
  getVillageOfficials
);

/**
 * @route   GET /api/village/officials/:id
 * @desc    Get village official by ID (public)
 * @access  Public
 * @params  { id }
 */
router.get('/officials/:id',
  validate(idSchema, 'params'),
  getVillageOfficialById
);

/**
 * @route   GET /api/village/statistics
 * @desc    Get village statistics (public)
 * @access  Public
 */
router.get('/statistics',
  getVillageStatistics
);

/**
 * @route   GET /api/village/documents
 * @desc    Get village documents (public/private based on is_public)
 * @access  Public/Private
 * @query   { page, limit, type, search, sortBy, sortOrder }
 */
router.get('/documents',
  optionalAuth,
  validate(paginationSchema, 'query'),
  getVillageDocuments
);

/**
 * @route   GET /api/village/documents/:id/download
 * @desc    Download document (public/private based on is_public)
 * @access  Public/Private
 * @params  { id }
 */
router.get('/documents/:id/download',
  optionalAuth,
  validate(idSchema, 'params'),
  downloadDocument
);

// Protected routes (authentication required)

/**
 * @route   POST /api/village/officials
 * @desc    Create village official (admin only)
 * @access  Private (Admin)
 * @body    { name, position, position_order, phone, email, photo_url, bio, status, start_date, end_date }
 */
router.post('/officials',
  authenticate,
  authorize('admin'),
  createVillageOfficial
);

/**
 * @route   PUT /api/village/officials/:id
 * @desc    Update village official (admin only)
 * @access  Private (Admin)
 * @params  { id }
 * @body    { name, position, position_order, phone, email, photo_url, bio, status, start_date, end_date }
 */
router.put('/officials/:id',
  authenticate,
  authorize('admin'),
  validate(idSchema, 'params'),
  updateVillageOfficial
);

/**
 * @route   DELETE /api/village/officials/:id
 * @desc    Delete village official (admin only)
 * @access  Private (Admin)
 * @params  { id }
 */
router.delete('/officials/:id',
  authenticate,
  authorize('admin'),
  validate(idSchema, 'params'),
  deleteVillageOfficial
);

/**
 * @route   PUT /api/village/statistics
 * @desc    Update village statistics (admin only)
 * @access  Private (Admin)
 * @body    { population_total, population_male, population_female, families_count, area_size, villages_count, hamlets_count, rw_count, rt_count, year }
 */
router.put('/statistics',
  authenticate,
  authorize('admin'),
  updateVillageStatistics
);

module.exports = router;
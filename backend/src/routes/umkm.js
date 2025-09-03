const express = require('express');
const {
  createUMKM,
  getAllUMKM,
  getActiveUMKM,
  getUMKMById,
  getUMKMBySlug,
  updateUMKM,
  deleteUMKM,
  getUMKMByCategory,
  getNearbyUMKM,
  searchUMKM,
  getUMKMStats,
  getFeaturedUMKM,
  getLatestUMKM,
  bulkUpdateStatus,
  getUMKMCategories,
  createUMKMCategory
} = require('../controllers/umkmController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  umkmCreateSchema,
  umkmUpdateSchema,
  paginationSchema,
  idSchema,
  slugSchema
} = require('../middleware/validation');

const router = express.Router();

// Public routes (no authentication required)

/**
 * @route   GET /api/umkm/active
 * @desc    Get all active UMKM (public)
 * @access  Public
 * @query   { page, limit, category, search, sortBy, sortOrder, latitude, longitude, radius }
 */
router.get('/active',
  validate(paginationSchema, 'query'),
  getActiveUMKM
);

/**
 * @route   GET /api/umkm/featured
 * @desc    Get featured UMKM (public)
 * @access  Public
 * @query   { limit }
 */
router.get('/featured',
  getFeaturedUMKM
);

/**
 * @route   GET /api/umkm/latest
 * @desc    Get latest UMKM (public)
 * @access  Public
 * @query   { limit }
 */
router.get('/latest',
  getLatestUMKM
);

/**
 * @route   GET /api/umkm/search
 * @desc    Search UMKM (public)
 * @access  Public
 * @query   { q, page, limit, category, sortBy, sortOrder }
 */
router.get('/search',
  searchUMKM
);

/**
 * @route   GET /api/umkm/categories
 * @desc    Get UMKM categories (public)
 * @access  Public
 */
router.get('/categories',
  getUMKMCategories
);

/**
 * @route   GET /api/umkm/category/:categoryId
 * @desc    Get UMKM by category (public)
 * @access  Public
 * @params  { categoryId }
 * @query   { page, limit, search, sortBy, sortOrder }
 */
router.get('/category/:categoryId',
  validate(idSchema, 'params'),
  validate(paginationSchema, 'query'),
  getUMKMByCategory
);

/**
 * @route   GET /api/umkm/nearby/:latitude/:longitude
 * @desc    Get nearby UMKM (public)
 * @access  Public
 * @params  { latitude, longitude }
 * @query   { radius, limit }
 */
router.get('/nearby/:latitude/:longitude',
  getNearbyUMKM
);

/**
 * @route   GET /api/umkm/slug/:slug
 * @desc    Get UMKM by slug (public)
 * @access  Public
 * @params  { slug }
 */
router.get('/slug/:slug',
  validate(slugSchema, 'params'),
  getUMKMBySlug
);

// Protected routes (authentication required)

/**
 * @route   POST /api/umkm
 * @desc    Create new UMKM
 * @access  Private (User, Editor, Admin)
 * @body    { name, description, category_id, owner_name, owner_phone, owner_email, address, latitude, longitude, website, social_media, operating_hours, products_services, status, meta_title, meta_description }
 */
router.post('/',
  authenticate,
  validate(umkmCreateSchema),
  createUMKM
);

/**
 * @route   POST /api/umkm/categories
 * @desc    Create UMKM category (admin only)
 * @access  Private (Admin)
 * @body    { name, description, icon }
 */
router.post('/categories',
  authenticate,
  authorize('admin'),
  createUMKMCategory
);

/**
 * @route   GET /api/umkm
 * @desc    Get all UMKM (admin/editor)
 * @access  Private (Editor, Admin)
 * @query   { page, limit, status, category, search, sortBy, sortOrder, latitude, longitude, radius }
 */
router.get('/',
  authenticate,
  authorize(['editor', 'admin']),
  validate(paginationSchema, 'query'),
  getAllUMKM
);

/**
 * @route   GET /api/umkm/stats
 * @desc    Get UMKM statistics (admin/editor)
 * @access  Private (Editor, Admin)
 */
router.get('/stats',
  authenticate,
  authorize(['editor', 'admin']),
  getUMKMStats
);

/**
 * @route   POST /api/umkm/bulk-update
 * @desc    Bulk update UMKM status
 * @access  Private (Editor, Admin)
 * @body    { ids, status }
 */
router.post('/bulk-update',
  authenticate,
  authorize(['editor', 'admin']),
  bulkUpdateStatus
);

/**
 * @route   GET /api/umkm/:id
 * @desc    Get UMKM by ID
 * @access  Private/Public (depends on status)
 * @params  { id }
 */
router.get('/:id',
  optionalAuth,
  validate(idSchema, 'params'),
  getUMKMById
);

/**
 * @route   PUT /api/umkm/:id
 * @desc    Update UMKM
 * @access  Private (Owner, Editor, Admin)
 * @params  { id }
 * @body    { name, description, category_id, owner_name, owner_phone, owner_email, address, latitude, longitude, website, social_media, operating_hours, products_services, status, meta_title, meta_description }
 */
router.put('/:id',
  authenticate,
  validate(idSchema, 'params'),
  validate(umkmUpdateSchema),
  updateUMKM
);

/**
 * @route   DELETE /api/umkm/:id
 * @desc    Delete UMKM
 * @access  Private (Owner, Editor, Admin)
 * @params  { id }
 */
router.delete('/:id',
  authenticate,
  validate(idSchema, 'params'),
  deleteUMKM
);

module.exports = router;
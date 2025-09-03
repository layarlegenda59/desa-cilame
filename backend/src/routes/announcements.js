const express = require('express');
const {
  createAnnouncement,
  getAllAnnouncements,
  getActiveAnnouncements,
  getUrgentAnnouncements,
  getAnnouncementById,
  getAnnouncementBySlug,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementsByPriority,
  getExpiredAnnouncements,
  getLatestAnnouncements,
  searchAnnouncements,
  getAnnouncementStats,
  bulkUpdateStatus
} = require('../controllers/announcementController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  announcementCreateSchema,
  announcementUpdateSchema,
  paginationSchema,
  idSchema,
  slugSchema
} = require('../middleware/validation');

const router = express.Router();

// Public routes (no authentication required)

/**
 * @route   GET /api/announcements/active
 * @desc    Get all active announcements (public)
 * @access  Public
 * @query   { page, limit, priority, search, sortBy, sortOrder }
 */
router.get('/active',
  validate(paginationSchema, 'query'),
  getActiveAnnouncements
);

/**
 * @route   GET /api/announcements/urgent
 * @desc    Get urgent announcements (public)
 * @access  Public
 * @query   { limit }
 */
router.get('/urgent',
  getUrgentAnnouncements
);

/**
 * @route   GET /api/announcements/latest
 * @desc    Get latest announcements (public)
 * @access  Public
 * @query   { limit }
 */
router.get('/latest',
  getLatestAnnouncements
);

/**
 * @route   GET /api/announcements/search
 * @desc    Search announcements (public)
 * @access  Public
 * @query   { q, page, limit, priority, sortBy, sortOrder }
 */
router.get('/search',
  searchAnnouncements
);

/**
 * @route   GET /api/announcements/priority/:priority
 * @desc    Get announcements by priority (public)
 * @access  Public
 * @params  { priority }
 * @query   { limit }
 */
router.get('/priority/:priority',
  getAnnouncementsByPriority
);

/**
 * @route   GET /api/announcements/slug/:slug
 * @desc    Get announcement by slug (public)
 * @access  Public
 * @params  { slug }
 */
router.get('/slug/:slug',
  validate(slugSchema, 'params'),
  getAnnouncementBySlug
);

// Protected routes (authentication required)

/**
 * @route   POST /api/announcements
 * @desc    Create new announcement
 * @access  Private (Editor, Admin)
 * @body    { title, content, excerpt, priority, status, published_at, expires_at, meta_title, meta_description }
 */
router.post('/',
  authenticate,
  authorize(['editor', 'admin']),
  validate(announcementCreateSchema),
  createAnnouncement
);

/**
 * @route   GET /api/announcements
 * @desc    Get all announcements (admin/editor)
 * @access  Private (Editor, Admin)
 * @query   { page, limit, status, priority, author, search, sortBy, sortOrder, include_expired }
 */
router.get('/',
  authenticate,
  authorize(['editor', 'admin']),
  validate(paginationSchema, 'query'),
  getAllAnnouncements
);

/**
 * @route   GET /api/announcements/stats
 * @desc    Get announcement statistics (admin/editor)
 * @access  Private (Editor, Admin)
 */
router.get('/stats',
  authenticate,
  authorize(['editor', 'admin']),
  getAnnouncementStats
);

/**
 * @route   GET /api/announcements/expired
 * @desc    Get expired announcements (admin/editor)
 * @access  Private (Editor, Admin)
 */
router.get('/expired',
  authenticate,
  authorize(['editor', 'admin']),
  getExpiredAnnouncements
);

/**
 * @route   POST /api/announcements/bulk-update
 * @desc    Bulk update announcement status
 * @access  Private (Editor, Admin)
 * @body    { ids, status }
 */
router.post('/bulk-update',
  authenticate,
  authorize(['editor', 'admin']),
  bulkUpdateStatus
);

/**
 * @route   GET /api/announcements/:id
 * @desc    Get announcement by ID
 * @access  Private/Public (depends on status)
 * @params  { id }
 */
router.get('/:id',
  optionalAuth,
  validate(idSchema, 'params'),
  getAnnouncementById
);

/**
 * @route   PUT /api/announcements/:id
 * @desc    Update announcement
 * @access  Private (Owner, Editor, Admin)
 * @params  { id }
 * @body    { title, content, excerpt, priority, status, published_at, expires_at, meta_title, meta_description }
 */
router.put('/:id',
  authenticate,
  authorize(['editor', 'admin']),
  validate(idSchema, 'params'),
  validate(announcementUpdateSchema),
  updateAnnouncement
);

/**
 * @route   DELETE /api/announcements/:id
 * @desc    Delete announcement
 * @access  Private (Owner, Editor, Admin)
 * @params  { id }
 */
router.delete('/:id',
  authenticate,
  authorize(['editor', 'admin']),
  validate(idSchema, 'params'),
  deleteAnnouncement
);

module.exports = router;
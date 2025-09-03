const express = require('express');
const {
  createNews,
  getAllNews,
  getPublishedNews,
  getNewsById,
  getNewsBySlug,
  updateNews,
  deleteNews,
  getFeaturedNews,
  getLatestNews,
  getNewsByCategory,
  getNewsByTag,
  getRelatedNews,
  searchNews,
  getNewsStats
} = require('../controllers/newsController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  newsCreateSchema,
  newsUpdateSchema,
  paginationSchema,
  idSchema,
  slugSchema
} = require('../middleware/validation');

const router = express.Router();

// Public routes (no authentication required)

/**
 * @route   GET /api/news/published
 * @desc    Get all published news (public)
 * @access  Public
 * @query   { page, limit, category, tag, search, sortBy, sortOrder }
 */
router.get('/published',
  validate(paginationSchema, 'query'),
  getPublishedNews
);

/**
 * @route   GET /api/news/featured
 * @desc    Get featured news (public)
 * @access  Public
 * @query   { limit }
 */
router.get('/featured',
  getFeaturedNews
);

/**
 * @route   GET /api/news/latest
 * @desc    Get latest news (public)
 * @access  Public
 * @query   { limit }
 */
router.get('/latest',
  getLatestNews
);

/**
 * @route   GET /api/news/search
 * @desc    Search news (public)
 * @access  Public
 * @query   { q, page, limit, category, tag, sortBy, sortOrder }
 */
router.get('/search',
  searchNews
);

/**
 * @route   GET /api/news/category/:categoryId
 * @desc    Get news by category (public)
 * @access  Public
 * @params  { categoryId }
 * @query   { page, limit, sortBy, sortOrder }
 */
router.get('/category/:categoryId',
  validate(idSchema, 'params'),
  validate(paginationSchema, 'query'),
  getNewsByCategory
);

/**
 * @route   GET /api/news/tag/:tagName
 * @desc    Get news by tag (public)
 * @access  Public
 * @params  { tagName }
 * @query   { page, limit, sortBy, sortOrder }
 */
router.get('/tag/:tagName',
  validate(paginationSchema, 'query'),
  getNewsByTag
);

/**
 * @route   GET /api/news/slug/:slug
 * @desc    Get news by slug (public)
 * @access  Public
 * @params  { slug }
 */
router.get('/slug/:slug',
  validate(slugSchema, 'params'),
  getNewsBySlug
);

/**
 * @route   GET /api/news/:id/related
 * @desc    Get related news (public)
 * @access  Public
 * @params  { id }
 * @query   { limit }
 */
router.get('/:id/related',
  validate(idSchema, 'params'),
  getRelatedNews
);

// Protected routes (authentication required)

/**
 * @route   POST /api/news
 * @desc    Create new news
 * @access  Private (Editor, Admin)
 * @body    { title, content, excerpt, category_id, tags, status, featured, meta_title, meta_description }
 */
router.post('/',
  authenticate,
  authorize(['editor', 'admin']),
  validate(newsCreateSchema),
  createNews
);

/**
 * @route   GET /api/news
 * @desc    Get all news (admin/editor)
 * @access  Private (Editor, Admin)
 * @query   { page, limit, status, category, author, search, sortBy, sortOrder }
 */
router.get('/',
  authenticate,
  authorize(['editor', 'admin']),
  validate(paginationSchema, 'query'),
  getAllNews
);

/**
 * @route   GET /api/news/stats
 * @desc    Get news statistics (admin/editor)
 * @access  Private (Editor, Admin)
 */
router.get('/stats',
  authenticate,
  authorize(['editor', 'admin']),
  getNewsStats
);

/**
 * @route   GET /api/news/:id
 * @desc    Get news by ID
 * @access  Private/Public (depends on status)
 * @params  { id }
 */
router.get('/:id',
  optionalAuth,
  validate(idSchema, 'params'),
  getNewsById
);

/**
 * @route   PUT /api/news/:id
 * @desc    Update news
 * @access  Private (Owner, Editor, Admin)
 * @params  { id }
 * @body    { title, content, excerpt, category_id, tags, status, featured, meta_title, meta_description }
 */
router.put('/:id',
  authenticate,
  authorize(['editor', 'admin']),
  validate(idSchema, 'params'),
  validate(newsUpdateSchema),
  updateNews
);

/**
 * @route   DELETE /api/news/:id
 * @desc    Delete news
 * @access  Private (Owner, Editor, Admin)
 * @params  { id }
 */
router.delete('/:id',
  authenticate,
  authorize(['editor', 'admin']),
  validate(idSchema, 'params'),
  deleteNews
);

module.exports = router;
const News = require('../models/News');
const { AppError, catchAsync } = require('../middleware/errorHandler');
const { logger } = require('../config/database');

// Create new news
const createNews = catchAsync(async (req, res, next) => {
  const {
    title,
    content,
    excerpt,
    featured_image,
    category_id,
    tags,
    status,
    published_at,
    meta_title,
    meta_description
  } = req.body;
  
  const newsData = {
    title,
    content,
    excerpt,
    featured_image,
    category_id,
    tags,
    status: status || 'draft',
    published_at,
    author_id: req.user.id,
    meta_title,
    meta_description
  };
  
  const news = await News.create(newsData);
  
  logger.info(`News created: ${news.id} by user: ${req.user.email}`);
  
  res.status(201).json({
    success: true,
    message: 'Berita berhasil dibuat',
    data: { news }
  });
});

// Get all news with pagination and filters
const getAllNews = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    category,
    status,
    author,
    tag,
    search,
    date_from,
    date_to,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  } = req.query;
  
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    category,
    status,
    author,
    tag,
    search,
    dateFrom: date_from,
    dateTo: date_to,
    sortBy,
    sortOrder
  };
  
  const result = await News.findAll(options);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

// Get published news (public endpoint)
const getPublishedNews = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    category,
    tag,
    search,
    sortBy = 'published_at',
    sortOrder = 'DESC'
  } = req.query;
  
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    category,
    tag,
    search,
    status: 'published',
    sortBy,
    sortOrder
  };
  
  const result = await News.findAll(options);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

// Get news by ID
const getNewsById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const news = await News.findById(id);
  if (!news) {
    return next(new AppError('Berita tidak ditemukan', 404));
  }
  
  // Increment views for published news
  if (news.status === 'published') {
    await News.incrementViews(id);
    news.views = (news.views || 0) + 1;
  }
  
  res.json({
    success: true,
    data: { news }
  });
});

// Get news by slug (public endpoint)
const getNewsBySlug = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  
  const news = await News.findBySlug(slug);
  if (!news) {
    return next(new AppError('Berita tidak ditemukan', 404));
  }
  
  // Only show published news to public
  if (news.status !== 'published') {
    return next(new AppError('Berita tidak ditemukan', 404));
  }
  
  // Increment views
  await News.incrementViews(news.id);
  news.views = (news.views || 0) + 1;
  
  res.json({
    success: true,
    data: { news }
  });
});

// Update news
const updateNews = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    content,
    excerpt,
    featured_image,
    category_id,
    tags,
    status,
    published_at,
    meta_title,
    meta_description
  } = req.body;
  
  // Check if news exists
  const existingNews = await News.findById(id);
  if (!existingNews) {
    return next(new AppError('Berita tidak ditemukan', 404));
  }
  
  // Check ownership (non-admin users can only edit their own news)
  if (req.user.role !== 'admin' && existingNews.author_id !== req.user.id) {
    return next(new AppError('Anda tidak memiliki izin untuk mengedit berita ini', 403));
  }
  
  const updateData = {
    title,
    content,
    excerpt,
    featured_image,
    category_id,
    tags,
    status,
    published_at,
    meta_title,
    meta_description
  };
  
  const updatedNews = await News.update(id, updateData);
  
  logger.info(`News updated: ${id} by user: ${req.user.email}`);
  
  res.json({
    success: true,
    message: 'Berita berhasil diperbarui',
    data: { news: updatedNews }
  });
});

// Delete news
const deleteNews = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  // Check if news exists
  const existingNews = await News.findById(id);
  if (!existingNews) {
    return next(new AppError('Berita tidak ditemukan', 404));
  }
  
  // Check ownership (non-admin users can only delete their own news)
  if (req.user.role !== 'admin' && existingNews.author_id !== req.user.id) {
    return next(new AppError('Anda tidak memiliki izin untuk menghapus berita ini', 403));
  }
  
  await News.delete(id);
  
  logger.info(`News deleted: ${id} by user: ${req.user.email}`);
  
  res.json({
    success: true,
    message: 'Berita berhasil dihapus'
  });
});

// Get featured news
const getFeaturedNews = catchAsync(async (req, res, next) => {
  const { limit = 5 } = req.query;
  
  const options = {
    page: 1,
    limit: parseInt(limit),
    status: 'published',
    sortBy: 'views',
    sortOrder: 'DESC'
  };
  
  const result = await News.findAll(options);
  
  res.json({
    success: true,
    data: result.data
  });
});

// Get latest news
const getLatestNews = catchAsync(async (req, res, next) => {
  const { limit = 5 } = req.query;
  
  const options = {
    page: 1,
    limit: parseInt(limit),
    status: 'published',
    sortBy: 'published_at',
    sortOrder: 'DESC'
  };
  
  const result = await News.findAll(options);
  
  res.json({
    success: true,
    data: result.data
  });
});

// Get news by category
const getNewsByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const {
    page = 1,
    limit = 10,
    sortBy = 'published_at',
    sortOrder = 'DESC'
  } = req.query;
  
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    category: categoryId,
    status: 'published',
    sortBy,
    sortOrder
  };
  
  const result = await News.findAll(options);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

// Get news by tag
const getNewsByTag = catchAsync(async (req, res, next) => {
  const { tag } = req.params;
  const {
    page = 1,
    limit = 10,
    sortBy = 'published_at',
    sortOrder = 'DESC'
  } = req.query;
  
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    tag,
    status: 'published',
    sortBy,
    sortOrder
  };
  
  const result = await News.findAll(options);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

// Get news statistics
const getNewsStats = catchAsync(async (req, res, next) => {
  const stats = await News.getStatistics();
  
  res.json({
    success: true,
    data: { statistics: stats }
  });
});

// Search news
const searchNews = catchAsync(async (req, res, next) => {
  const {
    q: search,
    page = 1,
    limit = 10,
    category,
    tag,
    sortBy = 'relevance',
    sortOrder = 'DESC'
  } = req.query;
  
  if (!search) {
    return next(new AppError('Parameter pencarian diperlukan', 400));
  }
  
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    category,
    tag,
    status: 'published',
    sortBy: sortBy === 'relevance' ? 'published_at' : sortBy,
    sortOrder
  };
  
  const result = await News.findAll(options);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    query: search
  });
});

// Get related news
const getRelatedNews = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { limit = 5 } = req.query;
  
  // Get current news to find related ones
  const currentNews = await News.findById(id);
  if (!currentNews) {
    return next(new AppError('Berita tidak ditemukan', 404));
  }
  
  // Find related news by category
  const options = {
    page: 1,
    limit: parseInt(limit) + 1, // +1 to exclude current news
    category: currentNews.category_id,
    status: 'published',
    sortBy: 'published_at',
    sortOrder: 'DESC'
  };
  
  const result = await News.findAll(options);
  
  // Remove current news from results
  const relatedNews = result.data.filter(news => news.id !== parseInt(id)).slice(0, limit);
  
  res.json({
    success: true,
    data: relatedNews
  });
});

module.exports = {
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
  getNewsStats,
  searchNews,
  getRelatedNews
};
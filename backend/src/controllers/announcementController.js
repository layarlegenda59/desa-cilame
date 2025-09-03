const Announcement = require('../models/Announcement');
const { AppError, catchAsync } = require('../middleware/errorHandler');
const { logger } = require('../config/database');

// Create new announcement
const createAnnouncement = catchAsync(async (req, res, next) => {
  const {
    title,
    content,
    excerpt,
    priority,
    status,
    published_at,
    expires_at,
    meta_title,
    meta_description
  } = req.body;
  
  const announcementData = {
    title,
    content,
    excerpt,
    priority: priority || 'medium',
    status: status || 'draft',
    published_at,
    expires_at,
    author_id: req.user.id,
    meta_title,
    meta_description
  };
  
  const announcement = await Announcement.create(announcementData);
  
  logger.info(`Announcement created: ${announcement.id} by user: ${req.user.email}`);
  
  res.status(201).json({
    success: true,
    message: 'Pengumuman berhasil dibuat',
    data: { announcement }
  });
});

// Get all announcements with pagination and filters
const getAllAnnouncements = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    author,
    search,
    sortBy = 'created_at',
    sortOrder = 'DESC',
    include_expired = false
  } = req.query;
  
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    status,
    priority,
    author,
    search,
    sortBy,
    sortOrder,
    includeExpired: include_expired === 'true'
  };
  
  const result = await Announcement.findAll(options);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

// Get active announcements (public endpoint)
const getActiveAnnouncements = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    priority,
    search,
    sortBy = 'priority',
    sortOrder = 'DESC'
  } = req.query;
  
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    priority,
    search,
    sortBy,
    sortOrder
  };
  
  const result = await Announcement.getActive(options);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

// Get urgent announcements
const getUrgentAnnouncements = catchAsync(async (req, res, next) => {
  const { limit = 5 } = req.query;
  
  const announcements = await Announcement.getUrgent(parseInt(limit));
  
  res.json({
    success: true,
    data: announcements
  });
});

// Get announcement by ID
const getAnnouncementById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const announcement = await Announcement.findById(id);
  if (!announcement) {
    return next(new AppError('Pengumuman tidak ditemukan', 404));
  }
  
  // Increment views for published announcements
  if (announcement.status === 'published') {
    await Announcement.incrementViews(id);
    announcement.views = (announcement.views || 0) + 1;
  }
  
  res.json({
    success: true,
    data: { announcement }
  });
});

// Get announcement by slug (public endpoint)
const getAnnouncementBySlug = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  
  const announcement = await Announcement.findBySlug(slug);
  if (!announcement) {
    return next(new AppError('Pengumuman tidak ditemukan', 404));
  }
  
  // Only show published announcements to public
  if (announcement.status !== 'published') {
    return next(new AppError('Pengumuman tidak ditemukan', 404));
  }
  
  // Check if announcement is expired
  if (announcement.expires_at && new Date(announcement.expires_at) < new Date()) {
    return next(new AppError('Pengumuman sudah kedaluwarsa', 404));
  }
  
  // Increment views
  await Announcement.incrementViews(announcement.id);
  announcement.views = (announcement.views || 0) + 1;
  
  res.json({
    success: true,
    data: { announcement }
  });
});

// Update announcement
const updateAnnouncement = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    content,
    excerpt,
    priority,
    status,
    published_at,
    expires_at,
    meta_title,
    meta_description
  } = req.body;
  
  // Check if announcement exists
  const existingAnnouncement = await Announcement.findById(id);
  if (!existingAnnouncement) {
    return next(new AppError('Pengumuman tidak ditemukan', 404));
  }
  
  // Check ownership (non-admin users can only edit their own announcements)
  if (req.user.role !== 'admin' && existingAnnouncement.author_id !== req.user.id) {
    return next(new AppError('Anda tidak memiliki izin untuk mengedit pengumuman ini', 403));
  }
  
  const updateData = {
    title,
    content,
    excerpt,
    priority,
    status,
    published_at,
    expires_at,
    meta_title,
    meta_description
  };
  
  const updatedAnnouncement = await Announcement.update(id, updateData);
  
  logger.info(`Announcement updated: ${id} by user: ${req.user.email}`);
  
  res.json({
    success: true,
    message: 'Pengumuman berhasil diperbarui',
    data: { announcement: updatedAnnouncement }
  });
});

// Delete announcement
const deleteAnnouncement = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  // Check if announcement exists
  const existingAnnouncement = await Announcement.findById(id);
  if (!existingAnnouncement) {
    return next(new AppError('Pengumuman tidak ditemukan', 404));
  }
  
  // Check ownership (non-admin users can only delete their own announcements)
  if (req.user.role !== 'admin' && existingAnnouncement.author_id !== req.user.id) {
    return next(new AppError('Anda tidak memiliki izin untuk menghapus pengumuman ini', 403));
  }
  
  await Announcement.delete(id);
  
  logger.info(`Announcement deleted: ${id} by user: ${req.user.email}`);
  
  res.json({
    success: true,
    message: 'Pengumuman berhasil dihapus'
  });
});

// Get announcements by priority
const getAnnouncementsByPriority = catchAsync(async (req, res, next) => {
  const { priority } = req.params;
  const { limit = 10 } = req.query;
  
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (!validPriorities.includes(priority)) {
    return next(new AppError('Prioritas tidak valid', 400));
  }
  
  const announcements = await Announcement.getByPriority(priority, parseInt(limit));
  
  res.json({
    success: true,
    data: announcements
  });
});

// Get expired announcements
const getExpiredAnnouncements = catchAsync(async (req, res, next) => {
  const announcements = await Announcement.getExpired();
  
  res.json({
    success: true,
    data: announcements
  });
});

// Get latest announcements
const getLatestAnnouncements = catchAsync(async (req, res, next) => {
  const { limit = 5 } = req.query;
  
  const options = {
    page: 1,
    limit: parseInt(limit),
    sortBy: 'published_at',
    sortOrder: 'DESC'
  };
  
  const result = await Announcement.getActive(options);
  
  res.json({
    success: true,
    data: result.data
  });
});

// Search announcements
const searchAnnouncements = catchAsync(async (req, res, next) => {
  const {
    q: search,
    page = 1,
    limit = 10,
    priority,
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
    priority,
    sortBy: sortBy === 'relevance' ? 'created_at' : sortBy,
    sortOrder
  };
  
  const result = await Announcement.getActive(options);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    query: search
  });
});

// Get announcement statistics
const getAnnouncementStats = catchAsync(async (req, res, next) => {
  // Get basic counts
  const allOptions = { page: 1, limit: 1 };
  const activeResult = await Announcement.getActive(allOptions);
  const expiredAnnouncements = await Announcement.getExpired();
  
  // Get priority distribution
  const urgentResult = await Announcement.getByPriority('urgent', 1000);
  const highResult = await Announcement.getByPriority('high', 1000);
  const mediumResult = await Announcement.getByPriority('medium', 1000);
  const lowResult = await Announcement.getByPriority('low', 1000);
  
  const stats = {
    total_active: activeResult.pagination.total,
    total_expired: expiredAnnouncements.length,
    by_priority: {
      urgent: urgentResult.length,
      high: highResult.length,
      medium: mediumResult.length,
      low: lowResult.length
    }
  };
  
  res.json({
    success: true,
    data: { statistics: stats }
  });
});

// Bulk update announcement status
const bulkUpdateStatus = catchAsync(async (req, res, next) => {
  const { ids, status } = req.body;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return next(new AppError('ID pengumuman diperlukan', 400));
  }
  
  if (!['draft', 'published'].includes(status)) {
    return next(new AppError('Status tidak valid', 400));
  }
  
  const results = [];
  const errors = [];
  
  for (const id of ids) {
    try {
      // Check if announcement exists and user has permission
      const announcement = await Announcement.findById(id);
      if (!announcement) {
        errors.push({ id, error: 'Pengumuman tidak ditemukan' });
        continue;
      }
      
      if (req.user.role !== 'admin' && announcement.author_id !== req.user.id) {
        errors.push({ id, error: 'Tidak memiliki izin' });
        continue;
      }
      
      const updated = await Announcement.update(id, { status });
      results.push(updated);
    } catch (error) {
      errors.push({ id, error: error.message });
    }
  }
  
  logger.info(`Bulk update announcements: ${results.length} updated, ${errors.length} errors by user: ${req.user.email}`);
  
  res.json({
    success: true,
    message: `${results.length} pengumuman berhasil diperbarui`,
    data: {
      updated: results,
      errors: errors
    }
  });
});

module.exports = {
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
};
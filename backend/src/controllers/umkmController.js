const UMKM = require('../models/UMKM');
const { AppError, catchAsync } = require('../middleware/errorHandler');
const { logger } = require('../config/database');

// Create new UMKM
const createUMKM = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    category_id,
    owner_name,
    owner_phone,
    owner_email,
    address,
    latitude,
    longitude,
    website,
    social_media,
    operating_hours,
    products_services,
    status,
    meta_title,
    meta_description
  } = req.body;
  
  const umkmData = {
    name,
    description,
    category_id,
    owner_name,
    owner_phone,
    owner_email,
    address,
    latitude,
    longitude,
    website,
    social_media,
    operating_hours,
    products_services,
    status: status || 'active',
    created_by: req.user.id,
    meta_title,
    meta_description
  };
  
  const umkm = await UMKM.create(umkmData);
  
  logger.info(`UMKM created: ${umkm.id} by user: ${req.user.email}`);
  
  res.status(201).json({
    success: true,
    message: 'UMKM berhasil dibuat',
    data: { umkm }
  });
});

// Get all UMKM with pagination and filters
const getAllUMKM = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    search,
    sortBy = 'created_at',
    sortOrder = 'DESC',
    latitude,
    longitude,
    radius
  } = req.query;
  
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    status,
    category,
    search,
    sortBy,
    sortOrder,
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    radius: radius ? parseFloat(radius) : null
  };
  
  const result = await UMKM.findAll(options);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

// Get active UMKM (public endpoint)
const getActiveUMKM = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    category,
    search,
    sortBy = 'name',
    sortOrder = 'ASC',
    latitude,
    longitude,
    radius
  } = req.query;
  
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    category,
    search,
    sortBy,
    sortOrder,
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    radius: radius ? parseFloat(radius) : null
  };
  
  const result = await UMKM.getActive(options);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

// Get UMKM by ID
const getUMKMById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const umkm = await UMKM.findById(id);
  if (!umkm) {
    return next(new AppError('UMKM tidak ditemukan', 404));
  }
  
  // Increment views for active UMKM
  if (umkm.status === 'active') {
    await UMKM.incrementViews(id);
    umkm.views = (umkm.views || 0) + 1;
  }
  
  res.json({
    success: true,
    data: { umkm }
  });
});

// Get UMKM by slug (public endpoint)
const getUMKMBySlug = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  
  const umkm = await UMKM.findBySlug(slug);
  if (!umkm) {
    return next(new AppError('UMKM tidak ditemukan', 404));
  }
  
  // Only show active UMKM to public
  if (umkm.status !== 'active') {
    return next(new AppError('UMKM tidak ditemukan', 404));
  }
  
  // Increment views
  await UMKM.incrementViews(umkm.id);
  umkm.views = (umkm.views || 0) + 1;
  
  res.json({
    success: true,
    data: { umkm }
  });
});

// Update UMKM
const updateUMKM = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    description,
    category_id,
    owner_name,
    owner_phone,
    owner_email,
    address,
    latitude,
    longitude,
    website,
    social_media,
    operating_hours,
    products_services,
    status,
    meta_title,
    meta_description
  } = req.body;
  
  // Check if UMKM exists
  const existingUMKM = await UMKM.findById(id);
  if (!existingUMKM) {
    return next(new AppError('UMKM tidak ditemukan', 404));
  }
  
  // Check ownership (non-admin users can only edit their own UMKM)
  if (req.user.role !== 'admin' && existingUMKM.created_by !== req.user.id) {
    return next(new AppError('Anda tidak memiliki izin untuk mengedit UMKM ini', 403));
  }
  
  const updateData = {
    name,
    description,
    category_id,
    owner_name,
    owner_phone,
    owner_email,
    address,
    latitude,
    longitude,
    website,
    social_media,
    operating_hours,
    products_services,
    status,
    meta_title,
    meta_description
  };
  
  const updatedUMKM = await UMKM.update(id, updateData);
  
  logger.info(`UMKM updated: ${id} by user: ${req.user.email}`);
  
  res.json({
    success: true,
    message: 'UMKM berhasil diperbarui',
    data: { umkm: updatedUMKM }
  });
});

// Delete UMKM
const deleteUMKM = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  // Check if UMKM exists
  const existingUMKM = await UMKM.findById(id);
  if (!existingUMKM) {
    return next(new AppError('UMKM tidak ditemukan', 404));
  }
  
  // Check ownership (non-admin users can only delete their own UMKM)
  if (req.user.role !== 'admin' && existingUMKM.created_by !== req.user.id) {
    return next(new AppError('Anda tidak memiliki izin untuk menghapus UMKM ini', 403));
  }
  
  await UMKM.delete(id);
  
  logger.info(`UMKM deleted: ${id} by user: ${req.user.email}`);
  
  res.json({
    success: true,
    message: 'UMKM berhasil dihapus'
  });
});

// Get UMKM by category
const getUMKMByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = 'name',
    sortOrder = 'ASC'
  } = req.query;
  
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    category: categoryId,
    search,
    sortBy,
    sortOrder
  };
  
  const result = await UMKM.getByCategory(categoryId, options);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

// Get nearby UMKM
const getNearbyUMKM = catchAsync(async (req, res, next) => {
  const { latitude, longitude } = req.params;
  const { radius = 5, limit = 10 } = req.query;
  
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const radiusKm = parseFloat(radius);
  const limitNum = parseInt(limit);
  
  if (isNaN(lat) || isNaN(lng)) {
    return next(new AppError('Koordinat latitude dan longitude harus berupa angka', 400));
  }
  
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return next(new AppError('Koordinat tidak valid', 400));
  }
  
  const umkmList = await UMKM.getNearby(lat, lng, radiusKm, limitNum);
  
  res.json({
    success: true,
    data: umkmList,
    center: { latitude: lat, longitude: lng },
    radius: radiusKm
  });
});

// Search UMKM
const searchUMKM = catchAsync(async (req, res, next) => {
  const {
    q: search,
    page = 1,
    limit = 10,
    category,
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
    sortBy: sortBy === 'relevance' ? 'name' : sortBy,
    sortOrder
  };
  
  const result = await UMKM.getActive(options);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    query: search
  });
});

// Get UMKM statistics
const getUMKMStats = catchAsync(async (req, res, next) => {
  const stats = await UMKM.getStatistics();
  
  res.json({
    success: true,
    data: { statistics: stats }
  });
});

// Get featured UMKM
const getFeaturedUMKM = catchAsync(async (req, res, next) => {
  const { limit = 6 } = req.query;
  
  // Get UMKM with highest views
  const options = {
    page: 1,
    limit: parseInt(limit),
    sortBy: 'views',
    sortOrder: 'DESC'
  };
  
  const result = await UMKM.getActive(options);
  
  res.json({
    success: true,
    data: result.data
  });
});

// Get latest UMKM
const getLatestUMKM = catchAsync(async (req, res, next) => {
  const { limit = 6 } = req.query;
  
  const options = {
    page: 1,
    limit: parseInt(limit),
    sortBy: 'created_at',
    sortOrder: 'DESC'
  };
  
  const result = await UMKM.getActive(options);
  
  res.json({
    success: true,
    data: result.data
  });
});

// Bulk update UMKM status
const bulkUpdateStatus = catchAsync(async (req, res, next) => {
  const { ids, status } = req.body;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return next(new AppError('ID UMKM diperlukan', 400));
  }
  
  if (!['active', 'inactive', 'pending'].includes(status)) {
    return next(new AppError('Status tidak valid', 400));
  }
  
  const results = [];
  const errors = [];
  
  for (const id of ids) {
    try {
      // Check if UMKM exists and user has permission
      const umkm = await UMKM.findById(id);
      if (!umkm) {
        errors.push({ id, error: 'UMKM tidak ditemukan' });
        continue;
      }
      
      if (req.user.role !== 'admin' && umkm.created_by !== req.user.id) {
        errors.push({ id, error: 'Tidak memiliki izin' });
        continue;
      }
      
      const updated = await UMKM.update(id, { status });
      results.push(updated);
    } catch (error) {
      errors.push({ id, error: error.message });
    }
  }
  
  logger.info(`Bulk update UMKM: ${results.length} updated, ${errors.length} errors by user: ${req.user.email}`);
  
  res.json({
    success: true,
    message: `${results.length} UMKM berhasil diperbarui`,
    data: {
      updated: results,
      errors: errors
    }
  });
});

// Get UMKM categories
const getUMKMCategories = catchAsync(async (req, res, next) => {
  const { db } = require('../config/database');
  
  const query = `
    SELECT 
      uc.*,
      COUNT(u.id) as umkm_count
    FROM umkm_categories uc
    LEFT JOIN umkm u ON uc.id = u.category_id AND u.status = 'active'
    GROUP BY uc.id, uc.name, uc.description, uc.icon, uc.created_at, uc.updated_at
    ORDER BY uc.name ASC
  `;
  
  const result = await db.query(query);
  
  res.json({
    success: true,
    data: result.rows
  });
});

// Create UMKM category (admin only)
const createUMKMCategory = catchAsync(async (req, res, next) => {
  const { name, description, icon } = req.body;
  
  if (req.user.role !== 'admin') {
    return next(new AppError('Hanya admin yang dapat membuat kategori UMKM', 403));
  }
  
  const { db } = require('../config/database');
  
  const query = `
    INSERT INTO umkm_categories (name, description, icon)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  
  const result = await db.query(query, [name, description, icon]);
  
  logger.info(`UMKM category created: ${result.rows[0].id} by user: ${req.user.email}`);
  
  res.status(201).json({
    success: true,
    message: 'Kategori UMKM berhasil dibuat',
    data: { category: result.rows[0] }
  });
});

module.exports = {
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
};
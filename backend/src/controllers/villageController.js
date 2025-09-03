const { AppError, catchAsync } = require('../middleware/errorHandler');
const { logger } = require('../config/database');
const { db } = require('../config/database');

// Get all village officials
const getVillageOfficials = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    position,
    status = 'active',
    search,
    sortBy = 'position_order',
    sortOrder = 'ASC'
  } = req.query;
  
  let query = `
    SELECT 
      id,
      name,
      position,
      position_order,
      phone,
      email,
      photo_url,
      bio,
      status,
      start_date,
      end_date,
      created_at,
      updated_at
    FROM village_officials
    WHERE 1=1
  `;
  
  const queryParams = [];
  let paramCount = 0;
  
  // Add filters
  if (status) {
    paramCount++;
    query += ` AND status = $${paramCount}`;
    queryParams.push(status);
  }
  
  if (position) {
    paramCount++;
    query += ` AND position ILIKE $${paramCount}`;
    queryParams.push(`%${position}%`);
  }
  
  if (search) {
    paramCount++;
    query += ` AND (name ILIKE $${paramCount} OR position ILIKE $${paramCount} OR bio ILIKE $${paramCount})`;
    queryParams.push(`%${search}%`);
  }
  
  // Add sorting
  const validSortFields = ['name', 'position', 'position_order', 'start_date', 'created_at'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'position_order';
  const sortDirection = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  query += ` ORDER BY ${sortField} ${sortDirection}`;
  
  // Add pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  paramCount++;
  query += ` LIMIT $${paramCount}`;
  queryParams.push(parseInt(limit));
  
  paramCount++;
  query += ` OFFSET $${paramCount}`;
  queryParams.push(offset);
  
  // Get total count
  let countQuery = `
    SELECT COUNT(*) as total
    FROM village_officials
    WHERE 1=1
  `;
  
  const countParams = [];
  let countParamCount = 0;
  
  if (status) {
    countParamCount++;
    countQuery += ` AND status = $${countParamCount}`;
    countParams.push(status);
  }
  
  if (position) {
    countParamCount++;
    countQuery += ` AND position ILIKE $${countParamCount}`;
    countParams.push(`%${position}%`);
  }
  
  if (search) {
    countParamCount++;
    countQuery += ` AND (name ILIKE $${countParamCount} OR position ILIKE $${countParamCount} OR bio ILIKE $${countParamCount})`;
    countParams.push(`%${search}%`);
  }
  
  const [result, countResult] = await Promise.all([
    db.query(query, queryParams),
    db.query(countQuery, countParams)
  ]);
  
  const total = parseInt(countResult.rows[0].total);
  const totalPages = Math.ceil(total / parseInt(limit));
  
  res.json({
    success: true,
    data: result.rows,
    pagination: {
      current_page: parseInt(page),
      total_pages: totalPages,
      total_items: total,
      items_per_page: parseInt(limit),
      has_next: parseInt(page) < totalPages,
      has_prev: parseInt(page) > 1
    }
  });
});

// Get village official by ID
const getVillageOfficialById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      id,
      name,
      position,
      position_order,
      phone,
      email,
      photo_url,
      bio,
      status,
      start_date,
      end_date,
      created_at,
      updated_at
    FROM village_officials
    WHERE id = $1
  `;
  
  const result = await db.query(query, [id]);
  
  if (result.rows.length === 0) {
    return next(new AppError('Perangkat desa tidak ditemukan', 404));
  }
  
  res.json({
    success: true,
    data: { official: result.rows[0] }
  });
});

// Create village official (admin only)
const createVillageOfficial = catchAsync(async (req, res, next) => {
  const {
    name,
    position,
    position_order,
    phone,
    email,
    photo_url,
    bio,
    status = 'active',
    start_date,
    end_date
  } = req.body;
  
  if (req.user.role !== 'admin') {
    return next(new AppError('Hanya admin yang dapat menambah perangkat desa', 403));
  }
  
  const query = `
    INSERT INTO village_officials (
      name, position, position_order, phone, email, 
      photo_url, bio, status, start_date, end_date
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;
  
  const result = await db.query(query, [
    name, position, position_order, phone, email,
    photo_url, bio, status, start_date, end_date
  ]);
  
  logger.info(`Village official created: ${result.rows[0].id} by user: ${req.user.email}`);
  
  res.status(201).json({
    success: true,
    message: 'Perangkat desa berhasil ditambahkan',
    data: { official: result.rows[0] }
  });
});

// Update village official (admin only)
const updateVillageOfficial = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    position,
    position_order,
    phone,
    email,
    photo_url,
    bio,
    status,
    start_date,
    end_date
  } = req.body;
  
  if (req.user.role !== 'admin') {
    return next(new AppError('Hanya admin yang dapat mengubah data perangkat desa', 403));
  }
  
  // Check if official exists
  const checkQuery = 'SELECT id FROM village_officials WHERE id = $1';
  const checkResult = await db.query(checkQuery, [id]);
  
  if (checkResult.rows.length === 0) {
    return next(new AppError('Perangkat desa tidak ditemukan', 404));
  }
  
  const query = `
    UPDATE village_officials
    SET 
      name = COALESCE($2, name),
      position = COALESCE($3, position),
      position_order = COALESCE($4, position_order),
      phone = COALESCE($5, phone),
      email = COALESCE($6, email),
      photo_url = COALESCE($7, photo_url),
      bio = COALESCE($8, bio),
      status = COALESCE($9, status),
      start_date = COALESCE($10, start_date),
      end_date = COALESCE($11, end_date),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  
  const result = await db.query(query, [
    id, name, position, position_order, phone, email,
    photo_url, bio, status, start_date, end_date
  ]);
  
  logger.info(`Village official updated: ${id} by user: ${req.user.email}`);
  
  res.json({
    success: true,
    message: 'Data perangkat desa berhasil diperbarui',
    data: { official: result.rows[0] }
  });
});

// Delete village official (admin only)
const deleteVillageOfficial = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  if (req.user.role !== 'admin') {
    return next(new AppError('Hanya admin yang dapat menghapus perangkat desa', 403));
  }
  
  // Check if official exists
  const checkQuery = 'SELECT id FROM village_officials WHERE id = $1';
  const checkResult = await db.query(checkQuery, [id]);
  
  if (checkResult.rows.length === 0) {
    return next(new AppError('Perangkat desa tidak ditemukan', 404));
  }
  
  const query = 'DELETE FROM village_officials WHERE id = $1';
  await db.query(query, [id]);
  
  logger.info(`Village official deleted: ${id} by user: ${req.user.email}`);
  
  res.json({
    success: true,
    message: 'Perangkat desa berhasil dihapus'
  });
});

// Get village statistics
const getVillageStatistics = catchAsync(async (req, res, next) => {
  const query = `
    SELECT 
      id,
      population_total,
      population_male,
      population_female,
      families_count,
      area_size,
      villages_count,
      hamlets_count,
      rw_count,
      rt_count,
      year,
      created_at,
      updated_at
    FROM village_statistics
    ORDER BY year DESC
    LIMIT 1
  `;
  
  const result = await db.query(query);
  
  if (result.rows.length === 0) {
    return res.json({
      success: true,
      data: { statistics: null },
      message: 'Data statistik desa belum tersedia'
    });
  }
  
  res.json({
    success: true,
    data: { statistics: result.rows[0] }
  });
});

// Update village statistics (admin only)
const updateVillageStatistics = catchAsync(async (req, res, next) => {
  const {
    population_total,
    population_male,
    population_female,
    families_count,
    area_size,
    villages_count,
    hamlets_count,
    rw_count,
    rt_count,
    year
  } = req.body;
  
  if (req.user.role !== 'admin') {
    return next(new AppError('Hanya admin yang dapat mengubah statistik desa', 403));
  }
  
  const currentYear = year || new Date().getFullYear();
  
  // Check if statistics for this year already exist
  const checkQuery = 'SELECT id FROM village_statistics WHERE year = $1';
  const checkResult = await db.query(checkQuery, [currentYear]);
  
  let query;
  let queryParams;
  
  if (checkResult.rows.length > 0) {
    // Update existing record
    query = `
      UPDATE village_statistics
      SET 
        population_total = COALESCE($2, population_total),
        population_male = COALESCE($3, population_male),
        population_female = COALESCE($4, population_female),
        families_count = COALESCE($5, families_count),
        area_size = COALESCE($6, area_size),
        villages_count = COALESCE($7, villages_count),
        hamlets_count = COALESCE($8, hamlets_count),
        rw_count = COALESCE($9, rw_count),
        rt_count = COALESCE($10, rt_count),
        updated_at = CURRENT_TIMESTAMP
      WHERE year = $1
      RETURNING *
    `;
    
    queryParams = [
      currentYear, population_total, population_male, population_female,
      families_count, area_size, villages_count, hamlets_count,
      rw_count, rt_count
    ];
  } else {
    // Insert new record
    query = `
      INSERT INTO village_statistics (
        population_total, population_male, population_female,
        families_count, area_size, villages_count, hamlets_count,
        rw_count, rt_count, year
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    queryParams = [
      population_total, population_male, population_female,
      families_count, area_size, villages_count, hamlets_count,
      rw_count, rt_count, currentYear
    ];
  }
  
  const result = await db.query(query, queryParams);
  
  logger.info(`Village statistics updated for year ${currentYear} by user: ${req.user.email}`);
  
  res.json({
    success: true,
    message: 'Statistik desa berhasil diperbarui',
    data: { statistics: result.rows[0] }
  });
});

// Get village documents
const getVillageDocuments = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    type,
    search,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  } = req.query;
  
  let query = `
    SELECT 
      id,
      title,
      description,
      file_url,
      file_type,
      file_size,
      document_type,
      is_public,
      download_count,
      created_at,
      updated_at
    FROM documents
    WHERE 1=1
  `;
  
  const queryParams = [];
  let paramCount = 0;
  
  // Add filters
  if (type) {
    paramCount++;
    query += ` AND document_type = $${paramCount}`;
    queryParams.push(type);
  }
  
  if (search) {
    paramCount++;
    query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
    queryParams.push(`%${search}%`);
  }
  
  // For non-admin users, only show public documents
  if (!req.user || req.user.role !== 'admin') {
    query += ` AND is_public = true`;
  }
  
  // Add sorting
  const validSortFields = ['title', 'document_type', 'download_count', 'created_at'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
  const sortDirection = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  query += ` ORDER BY ${sortField} ${sortDirection}`;
  
  // Add pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  paramCount++;
  query += ` LIMIT $${paramCount}`;
  queryParams.push(parseInt(limit));
  
  paramCount++;
  query += ` OFFSET $${paramCount}`;
  queryParams.push(offset);
  
  // Get total count
  let countQuery = `
    SELECT COUNT(*) as total
    FROM documents
    WHERE 1=1
  `;
  
  const countParams = [];
  let countParamCount = 0;
  
  if (type) {
    countParamCount++;
    countQuery += ` AND document_type = $${countParamCount}`;
    countParams.push(type);
  }
  
  if (search) {
    countParamCount++;
    countQuery += ` AND (title ILIKE $${countParamCount} OR description ILIKE $${countParamCount})`;
    countParams.push(`%${search}%`);
  }
  
  if (!req.user || req.user.role !== 'admin') {
    countQuery += ` AND is_public = true`;
  }
  
  const [result, countResult] = await Promise.all([
    db.query(query, queryParams),
    db.query(countQuery, countParams)
  ]);
  
  const total = parseInt(countResult.rows[0].total);
  const totalPages = Math.ceil(total / parseInt(limit));
  
  res.json({
    success: true,
    data: result.rows,
    pagination: {
      current_page: parseInt(page),
      total_pages: totalPages,
      total_items: total,
      items_per_page: parseInt(limit),
      has_next: parseInt(page) < totalPages,
      has_prev: parseInt(page) > 1
    }
  });
});

// Download document
const downloadDocument = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      id,
      title,
      file_url,
      file_type,
      is_public,
      download_count
    FROM documents
    WHERE id = $1
  `;
  
  const result = await db.query(query, [id]);
  
  if (result.rows.length === 0) {
    return next(new AppError('Dokumen tidak ditemukan', 404));
  }
  
  const document = result.rows[0];
  
  // Check if document is public or user is admin
  if (!document.is_public && (!req.user || req.user.role !== 'admin')) {
    return next(new AppError('Anda tidak memiliki izin untuk mengunduh dokumen ini', 403));
  }
  
  // Increment download count
  const updateQuery = `
    UPDATE documents
    SET download_count = download_count + 1
    WHERE id = $1
  `;
  
  await db.query(updateQuery, [id]);
  
  logger.info(`Document downloaded: ${id} by user: ${req.user ? req.user.email : 'anonymous'}`);
  
  res.json({
    success: true,
    data: {
      download_url: document.file_url,
      filename: document.title,
      file_type: document.file_type
    }
  });
});

module.exports = {
  getVillageOfficials,
  getVillageOfficialById,
  createVillageOfficial,
  updateVillageOfficial,
  deleteVillageOfficial,
  getVillageStatistics,
  updateVillageStatistics,
  getVillageDocuments,
  downloadDocument
};
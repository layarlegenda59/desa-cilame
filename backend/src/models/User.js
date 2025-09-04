const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { query, transaction } = require('../config/database');
const config = require('../config/app');

// User validation schemas
const userSchemas = {
  create: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(50)
      .required()
      .messages({
        'string.alphanum': 'Username hanya boleh mengandung huruf dan angka',
        'string.min': 'Username minimal 3 karakter',
        'string.max': 'Username maksimal 50 karakter',
        'any.required': 'Username wajib diisi'
      }),
    
    email: Joi.string()
      .email()
      .max(255)
      .required()
      .messages({
        'string.email': 'Format email tidak valid',
        'string.max': 'Email maksimal 255 karakter',
        'any.required': 'Email wajib diisi'
      }),
    
    password: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        'string.min': 'Password minimal 6 karakter',
        'string.max': 'Password maksimal 100 karakter',
        'any.required': 'Password wajib diisi'
      }),
    
    full_name: Joi.string()
      .min(2)
      .max(255)
      .required()
      .messages({
        'string.min': 'Nama lengkap minimal 2 karakter',
        'string.max': 'Nama lengkap maksimal 255 karakter',
        'any.required': 'Nama lengkap wajib diisi'
      }),
    
    role: Joi.string()
      .valid('admin', 'operator', 'user')
      .default('user')
      .messages({
        'any.only': 'Role harus salah satu dari: admin, operator, user'
      })
  }),
  
  update: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(50)
      .messages({
        'string.alphanum': 'Username hanya boleh mengandung huruf dan angka',
        'string.min': 'Username minimal 3 karakter',
        'string.max': 'Username maksimal 50 karakter'
      }),
    
    email: Joi.string()
      .email()
      .max(255)
      .messages({
        'string.email': 'Format email tidak valid',
        'string.max': 'Email maksimal 255 karakter'
      }),
    
    full_name: Joi.string()
      .min(2)
      .max(255)
      .messages({
        'string.min': 'Nama lengkap minimal 2 karakter',
        'string.max': 'Nama lengkap maksimal 255 karakter'
      }),
    
    role: Joi.string()
      .valid('admin', 'operator', 'user')
      .messages({
        'any.only': 'Role harus salah satu dari: admin, operator, user'
      }),
    
    is_active: Joi.boolean()
  }).min(1),
  
  changePassword: Joi.object({
    current_password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password saat ini wajib diisi'
      }),
    
    new_password: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        'string.min': 'Password baru minimal 6 karakter',
        'string.max': 'Password baru maksimal 100 karakter',
        'any.required': 'Password baru wajib diisi'
      }),
    
    confirm_password: Joi.string()
      .valid(Joi.ref('new_password'))
      .required()
      .messages({
        'any.only': 'Konfirmasi password tidak cocok',
        'any.required': 'Konfirmasi password wajib diisi'
      })
  }),
  
  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Format email tidak valid',
        'any.required': 'Email wajib diisi'
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password wajib diisi'
      })
  })
};

class User {
  // Validate data
  static validate(data, schema = 'create') {
    const { error, value } = userSchemas[schema].validate(data, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      throw new Error(JSON.stringify(errors));
    }
    
    return value;
  }
  
  // Hash password
  static async hashPassword(password) {
    return await bcrypt.hash(password, config.security.bcryptRounds);
  }
  
  // Compare password
  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
  
  // Create user
  static async create(userData) {
    const validatedData = this.validate(userData, 'create');
    
    // Check if email or username already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [validatedData.email, validatedData.username]
    );
    
    if (existingUser.rows.length > 0) {
      throw new Error('Email atau username sudah digunakan');
    }
    
    // Hash password
    const passwordHash = await this.hashPassword(validatedData.password);
    
    // Insert user
    const result = await query(`
      INSERT INTO users (username, email, password_hash, full_name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, full_name, role, is_active, email_verified, created_at
    `, [
      validatedData.username,
      validatedData.email,
      passwordHash,
      validatedData.full_name,
      validatedData.role
    ]);
    
    return result.rows[0];
  }
  
  // Find user by ID
  static async findById(id) {
    const result = await query(`
      SELECT id, username, email, full_name, role, is_active, email_verified, last_login, created_at, updated_at
      FROM users
      WHERE id = $1
    `, [id]);
    
    return result.rows[0] || null;
  }
  
  // Find user by email
  static async findByEmail(email) {
    const result = await query(`
      SELECT id, username, email, password, full_name, role, status, created_at, updated_at
      FROM users
      WHERE email = ?
    `, [email]);
    
    return result.rows[0] || null;
  }
  
  // Find user by username
  static async findByUsername(username) {
    const result = await query(`
      SELECT id, username, email, password_hash, full_name, role, is_active, email_verified, last_login, created_at, updated_at
      FROM users
      WHERE username = $1
    `, [username]);
    
    return result.rows[0] || null;
  }
  
  // Get all users with pagination
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      is_active = null,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = options;
    
    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;
    
    // Build WHERE conditions
    if (search) {
      whereConditions.push(`(full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR username ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    
    if (role) {
      whereConditions.push(`role = $${paramIndex}`);
      queryParams.push(role);
      paramIndex++;
    }
    
    if (is_active !== null) {
      whereConditions.push(`is_active = $${paramIndex}`);
      queryParams.push(is_active);
      paramIndex++;
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM users
      ${whereClause}
    `, queryParams);
    
    const total = parseInt(countResult.rows[0].total);
    
    // Get users
    const usersResult = await query(`
      SELECT id, username, email, full_name, role, is_active, email_verified, last_login, created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY ${sort_by} ${sort_order}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...queryParams, limit, offset]);
    
    return {
      users: usersResult.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  // Update user
  static async update(id, userData) {
    const validatedData = this.validate(userData, 'update');
    
    // Check if user exists
    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new Error('User tidak ditemukan');
    }
    
    // Check for duplicate email/username if being updated
    if (validatedData.email || validatedData.username) {
      const duplicateCheck = await query(
        'SELECT id FROM users WHERE (email = $1 OR username = $2) AND id != $3',
        [validatedData.email || '', validatedData.username || '', id]
      );
      
      if (duplicateCheck.rows.length > 0) {
        throw new Error('Email atau username sudah digunakan');
      }
    }
    
    // Build update query
    const updateFields = [];
    const queryParams = [];
    let paramIndex = 1;
    
    Object.keys(validatedData).forEach(key => {
      updateFields.push(`${key} = $${paramIndex}`);
      queryParams.push(validatedData[key]);
      paramIndex++;
    });
    
    queryParams.push(id);
    
    const result = await query(`
      UPDATE users
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING id, username, email, full_name, role, is_active, email_verified, created_at, updated_at
    `, queryParams);
    
    return result.rows[0];
  }
  
  // Change password
  static async changePassword(id, passwordData) {
    const validatedData = this.validate(passwordData, 'changePassword');
    
    // Get user with password hash
    const user = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [id]
    );
    
    if (user.rows.length === 0) {
      throw new Error('User tidak ditemukan');
    }
    
    // Verify current password
    const isValidPassword = await this.comparePassword(
      validatedData.current_password,
      user.rows[0].password_hash
    );
    
    if (!isValidPassword) {
      throw new Error('Password saat ini tidak valid');
    }
    
    // Hash new password
    const newPasswordHash = await this.hashPassword(validatedData.new_password);
    
    // Update password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, id]
    );
    
    return { message: 'Password berhasil diubah' };
  }
  
  // Update last login (disabled for SQLite schema)
  static async updateLastLogin(id) {
    // Skip last_login update as column doesn't exist in current schema
    return;
  }
  
  // Delete user (soft delete)
  static async delete(id) {
    const result = await query(
      'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User tidak ditemukan');
    }
    
    return { message: 'User berhasil dihapus' };
  }
  
  // Permanently delete user
  static async permanentDelete(id) {
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User tidak ditemukan');
    }
    
    return { message: 'User berhasil dihapus permanen' };
  }
}

module.exports = User;
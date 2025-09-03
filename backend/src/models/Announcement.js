const Joi = require('joi');
const { pool, logger } = require('../config/database');
const slugify = require('slugify');

// Validation schemas
const createSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  content: Joi.string().min(20).required(),
  excerpt: Joi.string().max(300).optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  status: Joi.string().valid('draft', 'published').default('draft'),
  published_at: Joi.date().optional(),
  expires_at: Joi.date().optional(),
  author_id: Joi.number().integer().positive().required(),
  meta_title: Joi.string().max(60).optional(),
  meta_description: Joi.string().max(160).optional()
});

const updateSchema = Joi.object({
  title: Joi.string().min(5).max(200),
  content: Joi.string().min(20),
  excerpt: Joi.string().max(300),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  status: Joi.string().valid('draft', 'published'),
  published_at: Joi.date(),
  expires_at: Joi.date(),
  meta_title: Joi.string().max(60),
  meta_description: Joi.string().max(160)
});

class Announcement {
  // Generate unique slug
  static async generateSlug(title, excludeId = null) {
    let baseSlug = slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"`!:@]/g
    });
    
    let slug = baseSlug;
    let counter = 1;
    
    while (await this.isSlugExists(slug, excludeId)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  }
  
  // Check if slug exists
  static async isSlugExists(slug, excludeId = null) {
    try {
      let query = 'SELECT id FROM announcements WHERE slug = $1';
      const params = [slug];
      
      if (excludeId) {
        query += ' AND id != $2';
        params.push(excludeId);
      }
      
      const result = await pool.query(query, params);
      return result.rows.length > 0;
    } catch (error) {
      logger.error('Error checking slug existence:', error);
      throw error;
    }
  }
  
  // Create new announcement
  static async create(data) {
    try {
      // Validate input
      const { error, value } = createSchema.validate(data);
      if (error) {
        throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);
      }
      
      // Generate slug
      const slug = await this.generateSlug(value.title);
      
      // Handle published_at
      if (value.status === 'published' && !value.published_at) {
        value.published_at = new Date();
      }
      
      const query = `
        INSERT INTO announcements (
          title, slug, content, excerpt, priority, status, 
          published_at, expires_at, author_id, meta_title, meta_description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;
      
      const params = [
        value.title,
        slug,
        value.content,
        value.excerpt || null,
        value.priority,
        value.status,
        value.published_at || null,
        value.expires_at || null,
        value.author_id,
        value.meta_title || null,
        value.meta_description || null
      ];
      
      const result = await pool.query(query, params);
      logger.info(`Announcement created: ${result.rows[0].id}`);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating announcement:', error);
      throw error;
    }
  }
  
  // Find announcement by ID
  static async findById(id) {
    try {
      const query = `
        SELECT a.*, u.full_name as author_name, u.email as author_email
        FROM announcements a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.id = $1
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding announcement by ID:', error);
      throw error;
    }
  }
  
  // Find announcement by slug
  static async findBySlug(slug) {
    try {
      const query = `
        SELECT a.*, u.full_name as author_name, u.email as author_email
        FROM announcements a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.slug = $1
      `;
      
      const result = await pool.query(query, [slug]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding announcement by slug:', error);
      throw error;
    }
  }
  
  // Find all announcements with pagination and filters
  static async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        priority,
        author,
        search,
        sortBy = 'created_at',
        sortOrder = 'DESC',
        includeExpired = false
      } = options;
      
      const offset = (page - 1) * limit;
      let whereConditions = [];
      let params = [];
      let paramCount = 0;
      
      // Build WHERE conditions
      if (status) {
        paramCount++;
        whereConditions.push(`a.status = $${paramCount}`);
        params.push(status);
      }
      
      if (priority) {
        paramCount++;
        whereConditions.push(`a.priority = $${paramCount}`);
        params.push(priority);
      }
      
      if (author) {
        paramCount++;
        whereConditions.push(`u.full_name ILIKE $${paramCount}`);
        params.push(`%${author}%`);
      }
      
      if (search) {
        paramCount++;
        whereConditions.push(`(a.title ILIKE $${paramCount} OR a.content ILIKE $${paramCount} OR a.excerpt ILIKE $${paramCount})`);
        params.push(`%${search}%`);
      }
      
      if (!includeExpired) {
        whereConditions.push(`(a.expires_at IS NULL OR a.expires_at > NOW())`);
      }
      
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
      
      // Count total records
      const countQuery = `
        SELECT COUNT(*) as total
        FROM announcements a
        LEFT JOIN users u ON a.author_id = u.id
        ${whereClause}
      `;
      
      const countResult = await pool.query(countQuery, params);
      const total = parseInt(countResult.rows[0].total);
      
      // Get announcements
      const query = `
        SELECT a.*, u.full_name as author_name, u.email as author_email
        FROM announcements a
        LEFT JOIN users u ON a.author_id = u.id
        ${whereClause}
        ORDER BY a.${sortBy} ${sortOrder}
        LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
      `;
      
      params.push(limit, offset);
      const result = await pool.query(query, params);
      
      return {
        data: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error finding announcements:', error);
      throw error;
    }
  }
  
  // Get active announcements (published and not expired)
  static async getActive(options = {}) {
    const activeOptions = {
      ...options,
      status: 'published',
      includeExpired: false
    };
    
    return this.findAll(activeOptions);
  }
  
  // Get urgent announcements
  static async getUrgent(limit = 5) {
    try {
      const query = `
        SELECT a.*, u.full_name as author_name
        FROM announcements a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.status = 'published' 
          AND a.priority = 'urgent'
          AND (a.expires_at IS NULL OR a.expires_at > NOW())
        ORDER BY a.created_at DESC
        LIMIT $1
      `;
      
      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      logger.error('Error getting urgent announcements:', error);
      throw error;
    }
  }
  
  // Update announcement
  static async update(id, data) {
    try {
      // Validate input
      const { error, value } = updateSchema.validate(data);
      if (error) {
        throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);
      }
      
      // Get current announcement
      const current = await this.findById(id);
      if (!current) {
        throw new Error('Announcement not found');
      }
      
      // Generate new slug if title changed
      let slug = current.slug;
      if (value.title && value.title !== current.title) {
        slug = await this.generateSlug(value.title, id);
      }
      
      // Handle published_at
      if (value.status === 'published' && current.status === 'draft' && !value.published_at) {
        value.published_at = new Date();
      }
      
      const updateFields = [];
      const params = [];
      let paramCount = 0;
      
      // Build dynamic update query
      Object.keys(value).forEach(key => {
        if (value[key] !== undefined) {
          paramCount++;
          updateFields.push(`${key} = $${paramCount}`);
          params.push(value[key]);
        }
      });
      
      if (slug !== current.slug) {
        paramCount++;
        updateFields.push(`slug = $${paramCount}`);
        params.push(slug);
      }
      
      if (updateFields.length === 0) {
        return current;
      }
      
      paramCount++;
      params.push(id);
      
      const query = `
        UPDATE announcements 
        SET ${updateFields.join(', ')}, updated_at = NOW()
        WHERE id = $${paramCount}
        RETURNING *
      `;
      
      const result = await pool.query(query, params);
      logger.info(`Announcement updated: ${id}`);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error updating announcement:', error);
      throw error;
    }
  }
  
  // Increment views
  static async incrementViews(id) {
    try {
      const query = `
        UPDATE announcements 
        SET views = views + 1, updated_at = NOW()
        WHERE id = $1
        RETURNING views
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0]?.views || 0;
    } catch (error) {
      logger.error('Error incrementing announcement views:', error);
      throw error;
    }
  }
  
  // Delete announcement
  static async delete(id) {
    try {
      const query = 'DELETE FROM announcements WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Announcement not found');
      }
      
      logger.info(`Announcement deleted: ${id}`);
      return result.rows[0];
    } catch (error) {
      logger.error('Error deleting announcement:', error);
      throw error;
    }
  }
  
  // Get announcements by priority
  static async getByPriority(priority, limit = 10) {
    try {
      const query = `
        SELECT a.*, u.full_name as author_name
        FROM announcements a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.status = 'published' 
          AND a.priority = $1
          AND (a.expires_at IS NULL OR a.expires_at > NOW())
        ORDER BY a.created_at DESC
        LIMIT $2
      `;
      
      const result = await pool.query(query, [priority, limit]);
      return result.rows;
    } catch (error) {
      logger.error('Error getting announcements by priority:', error);
      throw error;
    }
  }
  
  // Get expired announcements
  static async getExpired() {
    try {
      const query = `
        SELECT a.*, u.full_name as author_name
        FROM announcements a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.expires_at IS NOT NULL AND a.expires_at <= NOW()
        ORDER BY a.expires_at DESC
      `;
      
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      logger.error('Error getting expired announcements:', error);
      throw error;
    }
  }
}

module.exports = Announcement;
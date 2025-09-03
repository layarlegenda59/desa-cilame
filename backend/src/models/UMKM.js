const Joi = require('joi');
const { pool, logger } = require('../config/database');
const slugify = require('slugify');

// Validation schemas
const createSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  owner_name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^(\+62|62|0)[0-9]{9,13}$/).required(),
  email: Joi.string().email().optional(),
  address: Joi.string().min(10).max(300).required(),
  category_id: Joi.number().integer().positive().required(),
  website: Joi.string().uri().optional(),
  social_media: Joi.object({
    facebook: Joi.string().uri().optional(),
    instagram: Joi.string().uri().optional(),
    whatsapp: Joi.string().pattern(/^(\+62|62|0)[0-9]{9,13}$/).optional()
  }).optional(),
  images: Joi.array().items(Joi.string().uri()).max(5).optional(),
  status: Joi.string().valid('pending', 'active', 'inactive').default('pending'),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional()
});

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().min(10).max(1000),
  owner_name: Joi.string().min(2).max(100),
  phone: Joi.string().pattern(/^(\+62|62|0)[0-9]{9,13}$/),
  email: Joi.string().email(),
  address: Joi.string().min(10).max(300),
  category_id: Joi.number().integer().positive(),
  website: Joi.string().uri(),
  social_media: Joi.object({
    facebook: Joi.string().uri(),
    instagram: Joi.string().uri(),
    whatsapp: Joi.string().pattern(/^(\+62|62|0)[0-9]{9,13}$/)
  }),
  images: Joi.array().items(Joi.string().uri()).max(5),
  status: Joi.string().valid('pending', 'active', 'inactive'),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180)
});

class UMKM {
  // Generate unique slug
  static async generateSlug(name, excludeId = null) {
    let baseSlug = slugify(name, {
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
      let query = 'SELECT id FROM umkm WHERE slug = $1';
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
  
  // Create new UMKM
  static async create(data) {
    try {
      // Validate input
      const { error, value } = createSchema.validate(data);
      if (error) {
        throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);
      }
      
      // Generate slug
      const slug = await this.generateSlug(value.name);
      
      const query = `
        INSERT INTO umkm (
          name, slug, description, owner_name, phone, email, address, 
          category_id, website, social_media, images, status, latitude, longitude
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;
      
      const params = [
        value.name,
        slug,
        value.description,
        value.owner_name,
        value.phone,
        value.email || null,
        value.address,
        value.category_id,
        value.website || null,
        JSON.stringify(value.social_media || {}),
        JSON.stringify(value.images || []),
        value.status,
        value.latitude || null,
        value.longitude || null
      ];
      
      const result = await pool.query(query, params);
      logger.info(`UMKM created: ${result.rows[0].id}`);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating UMKM:', error);
      throw error;
    }
  }
  
  // Find UMKM by ID
  static async findById(id) {
    try {
      const query = `
        SELECT u.*, c.name as category_name, c.description as category_description
        FROM umkm u
        LEFT JOIN umkm_categories c ON u.category_id = c.id
        WHERE u.id = $1
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows[0]) {
        // Parse JSON fields
        result.rows[0].social_media = JSON.parse(result.rows[0].social_media || '{}');
        result.rows[0].images = JSON.parse(result.rows[0].images || '[]');
      }
      
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding UMKM by ID:', error);
      throw error;
    }
  }
  
  // Find UMKM by slug
  static async findBySlug(slug) {
    try {
      const query = `
        SELECT u.*, c.name as category_name, c.description as category_description
        FROM umkm u
        LEFT JOIN umkm_categories c ON u.category_id = c.id
        WHERE u.slug = $1
      `;
      
      const result = await pool.query(query, [slug]);
      
      if (result.rows[0]) {
        // Parse JSON fields
        result.rows[0].social_media = JSON.parse(result.rows[0].social_media || '{}');
        result.rows[0].images = JSON.parse(result.rows[0].images || '[]');
      }
      
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding UMKM by slug:', error);
      throw error;
    }
  }
  
  // Find all UMKM with pagination and filters
  static async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        category,
        search,
        sortBy = 'created_at',
        sortOrder = 'DESC',
        hasLocation = null
      } = options;
      
      const offset = (page - 1) * limit;
      let whereConditions = [];
      let params = [];
      let paramCount = 0;
      
      // Build WHERE conditions
      if (status) {
        paramCount++;
        whereConditions.push(`u.status = $${paramCount}`);
        params.push(status);
      }
      
      if (category) {
        paramCount++;
        whereConditions.push(`c.name ILIKE $${paramCount}`);
        params.push(`%${category}%`);
      }
      
      if (search) {
        paramCount++;
        whereConditions.push(`(u.name ILIKE $${paramCount} OR u.description ILIKE $${paramCount} OR u.owner_name ILIKE $${paramCount})`);
        params.push(`%${search}%`);
      }
      
      if (hasLocation !== null) {
        if (hasLocation) {
          whereConditions.push(`u.latitude IS NOT NULL AND u.longitude IS NOT NULL`);
        } else {
          whereConditions.push(`u.latitude IS NULL OR u.longitude IS NULL`);
        }
      }
      
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
      
      // Count total records
      const countQuery = `
        SELECT COUNT(*) as total
        FROM umkm u
        LEFT JOIN umkm_categories c ON u.category_id = c.id
        ${whereClause}
      `;
      
      const countResult = await pool.query(countQuery, params);
      const total = parseInt(countResult.rows[0].total);
      
      // Get UMKM
      const query = `
        SELECT u.*, c.name as category_name, c.description as category_description
        FROM umkm u
        LEFT JOIN umkm_categories c ON u.category_id = c.id
        ${whereClause}
        ORDER BY u.${sortBy} ${sortOrder}
        LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
      `;
      
      params.push(limit, offset);
      const result = await pool.query(query, params);
      
      // Parse JSON fields
      result.rows.forEach(row => {
        row.social_media = JSON.parse(row.social_media || '{}');
        row.images = JSON.parse(row.images || '[]');
      });
      
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
      logger.error('Error finding UMKM:', error);
      throw error;
    }
  }
  
  // Get active UMKM
  static async getActive(options = {}) {
    const activeOptions = {
      ...options,
      status: 'active'
    };
    
    return this.findAll(activeOptions);
  }
  
  // Get UMKM by category
  static async getByCategory(categoryId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status = 'active'
      } = options;
      
      const offset = (page - 1) * limit;
      
      const query = `
        SELECT u.*, c.name as category_name
        FROM umkm u
        LEFT JOIN umkm_categories c ON u.category_id = c.id
        WHERE u.category_id = $1 AND u.status = $2
        ORDER BY u.created_at DESC
        LIMIT $3 OFFSET $4
      `;
      
      const result = await pool.query(query, [categoryId, status, limit, offset]);
      
      // Parse JSON fields
      result.rows.forEach(row => {
        row.social_media = JSON.parse(row.social_media || '{}');
        row.images = JSON.parse(row.images || '[]');
      });
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting UMKM by category:', error);
      throw error;
    }
  }
  
  // Get nearby UMKM
  static async getNearby(latitude, longitude, radiusKm = 10, limit = 10) {
    try {
      const query = `
        SELECT u.*, c.name as category_name,
               (
                 6371 * acos(
                   cos(radians($1)) * cos(radians(u.latitude)) *
                   cos(radians(u.longitude) - radians($2)) +
                   sin(radians($1)) * sin(radians(u.latitude))
                 )
               ) AS distance
        FROM umkm u
        LEFT JOIN umkm_categories c ON u.category_id = c.id
        WHERE u.status = 'active'
          AND u.latitude IS NOT NULL
          AND u.longitude IS NOT NULL
        HAVING distance <= $3
        ORDER BY distance
        LIMIT $4
      `;
      
      const result = await pool.query(query, [latitude, longitude, radiusKm, limit]);
      
      // Parse JSON fields
      result.rows.forEach(row => {
        row.social_media = JSON.parse(row.social_media || '{}');
        row.images = JSON.parse(row.images || '[]');
        row.distance = parseFloat(row.distance).toFixed(2);
      });
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting nearby UMKM:', error);
      throw error;
    }
  }
  
  // Update UMKM
  static async update(id, data) {
    try {
      // Validate input
      const { error, value } = updateSchema.validate(data);
      if (error) {
        throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);
      }
      
      // Get current UMKM
      const current = await this.findById(id);
      if (!current) {
        throw new Error('UMKM not found');
      }
      
      // Generate new slug if name changed
      let slug = current.slug;
      if (value.name && value.name !== current.name) {
        slug = await this.generateSlug(value.name, id);
      }
      
      const updateFields = [];
      const params = [];
      let paramCount = 0;
      
      // Build dynamic update query
      Object.keys(value).forEach(key => {
        if (value[key] !== undefined) {
          paramCount++;
          if (key === 'social_media' || key === 'images') {
            updateFields.push(`${key} = $${paramCount}`);
            params.push(JSON.stringify(value[key]));
          } else {
            updateFields.push(`${key} = $${paramCount}`);
            params.push(value[key]);
          }
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
        UPDATE umkm 
        SET ${updateFields.join(', ')}, updated_at = NOW()
        WHERE id = $${paramCount}
        RETURNING *
      `;
      
      const result = await pool.query(query, params);
      logger.info(`UMKM updated: ${id}`);
      
      // Parse JSON fields
      if (result.rows[0]) {
        result.rows[0].social_media = JSON.parse(result.rows[0].social_media || '{}');
        result.rows[0].images = JSON.parse(result.rows[0].images || '[]');
      }
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error updating UMKM:', error);
      throw error;
    }
  }
  
  // Increment views
  static async incrementViews(id) {
    try {
      const query = `
        UPDATE umkm 
        SET views = views + 1, updated_at = NOW()
        WHERE id = $1
        RETURNING views
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0]?.views || 0;
    } catch (error) {
      logger.error('Error incrementing UMKM views:', error);
      throw error;
    }
  }
  
  // Delete UMKM
  static async delete(id) {
    try {
      const query = 'DELETE FROM umkm WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        throw new Error('UMKM not found');
      }
      
      logger.info(`UMKM deleted: ${id}`);
      return result.rows[0];
    } catch (error) {
      logger.error('Error deleting UMKM:', error);
      throw error;
    }
  }
  
  // Get UMKM statistics
  static async getStatistics() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive,
          COUNT(CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 1 END) as with_location
        FROM umkm
      `;
      
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      logger.error('Error getting UMKM statistics:', error);
      throw error;
    }
  }
  
  // Get categories with UMKM count
  static async getCategoriesWithCount() {
    try {
      const query = `
        SELECT c.*, COUNT(u.id) as umkm_count
        FROM umkm_categories c
        LEFT JOIN umkm u ON c.id = u.category_id AND u.status = 'active'
        GROUP BY c.id, c.name, c.description, c.created_at, c.updated_at
        ORDER BY umkm_count DESC, c.name
      `;
      
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      logger.error('Error getting categories with count:', error);
      throw error;
    }
  }
}

module.exports = UMKM;
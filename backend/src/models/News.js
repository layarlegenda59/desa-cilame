const Joi = require('joi');
const { query, transaction } = require('../config/database');

// News validation schemas
const newsSchemas = {
  create: Joi.object({
    title: Joi.string()
      .min(5)
      .max(255)
      .required()
      .messages({
        'string.min': 'Judul minimal 5 karakter',
        'string.max': 'Judul maksimal 255 karakter',
        'any.required': 'Judul wajib diisi'
      }),
    
    slug: Joi.string()
      .pattern(/^[a-z0-9-]+$/)
      .max(255)
      .required()
      .messages({
        'string.pattern.base': 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung',
        'string.max': 'Slug maksimal 255 karakter',
        'any.required': 'Slug wajib diisi'
      }),
    
    excerpt: Joi.string()
      .max(500)
      .allow('')
      .messages({
        'string.max': 'Ringkasan maksimal 500 karakter'
      }),
    
    content: Joi.string()
      .min(10)
      .required()
      .messages({
        'string.min': 'Konten minimal 10 karakter',
        'any.required': 'Konten wajib diisi'
      }),
    
    featured_image: Joi.string()
      .uri()
      .max(500)
      .allow('')
      .messages({
        'string.uri': 'URL gambar tidak valid',
        'string.max': 'URL gambar maksimal 500 karakter'
      }),
    
    category_id: Joi.string()
      .uuid()
      .allow(null)
      .messages({
        'string.uuid': 'ID kategori tidak valid'
      }),
    
    status: Joi.string()
      .valid('draft', 'published', 'archived')
      .default('draft')
      .messages({
        'any.only': 'Status harus salah satu dari: draft, published, archived'
      }),
    
    is_featured: Joi.boolean()
      .default(false),
    
    published_at: Joi.date()
      .iso()
      .allow(null)
      .messages({
        'date.format': 'Format tanggal publikasi tidak valid'
      }),
    
    tags: Joi.array()
      .items(Joi.string().min(1).max(50))
      .max(10)
      .default([])
      .messages({
        'array.max': 'Maksimal 10 tag',
        'string.min': 'Tag minimal 1 karakter',
        'string.max': 'Tag maksimal 50 karakter'
      })
  }),
  
  update: Joi.object({
    title: Joi.string()
      .min(5)
      .max(255)
      .messages({
        'string.min': 'Judul minimal 5 karakter',
        'string.max': 'Judul maksimal 255 karakter'
      }),
    
    slug: Joi.string()
      .pattern(/^[a-z0-9-]+$/)
      .max(255)
      .messages({
        'string.pattern.base': 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung',
        'string.max': 'Slug maksimal 255 karakter'
      }),
    
    excerpt: Joi.string()
      .max(500)
      .allow('')
      .messages({
        'string.max': 'Ringkasan maksimal 500 karakter'
      }),
    
    content: Joi.string()
      .min(10)
      .messages({
        'string.min': 'Konten minimal 10 karakter'
      }),
    
    featured_image: Joi.string()
      .uri()
      .max(500)
      .allow('')
      .messages({
        'string.uri': 'URL gambar tidak valid',
        'string.max': 'URL gambar maksimal 500 karakter'
      }),
    
    category_id: Joi.string()
      .uuid()
      .allow(null)
      .messages({
        'string.uuid': 'ID kategori tidak valid'
      }),
    
    status: Joi.string()
      .valid('draft', 'published', 'archived')
      .messages({
        'any.only': 'Status harus salah satu dari: draft, published, archived'
      }),
    
    is_featured: Joi.boolean(),
    
    published_at: Joi.date()
      .iso()
      .allow(null)
      .messages({
        'date.format': 'Format tanggal publikasi tidak valid'
      }),
    
    tags: Joi.array()
      .items(Joi.string().min(1).max(50))
      .max(10)
      .messages({
        'array.max': 'Maksimal 10 tag',
        'string.min': 'Tag minimal 1 karakter',
        'string.max': 'Tag maksimal 50 karakter'
      })
  }).min(1)
};

class News {
  // Validate data
  static validate(data, schema = 'create') {
    const { error, value } = newsSchemas[schema].validate(data, {
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
  
  // Generate slug from title
  static generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Create news
  static async create(newsData, authorId) {
    const validatedData = this.validate(newsData, 'create');
    
    // Auto-generate slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = this.generateSlug(validatedData.title);
    }
    
    // Check if slug already exists
    const existingNews = await query(
      'SELECT id FROM news WHERE slug = $1',
      [validatedData.slug]
    );
    
    if (existingNews.rows.length > 0) {
      // Add timestamp to make slug unique
      validatedData.slug += '-' + Date.now();
    }
    
    // Set published_at if status is published and not set
    if (validatedData.status === 'published' && !validatedData.published_at) {
      validatedData.published_at = new Date();
    }
    
    return await transaction(async (client) => {
      // Insert news
      const newsResult = await client.query(`
        INSERT INTO news (title, slug, excerpt, content, featured_image, category_id, author_id, status, is_featured, published_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        validatedData.title,
        validatedData.slug,
        validatedData.excerpt,
        validatedData.content,
        validatedData.featured_image,
        validatedData.category_id,
        authorId,
        validatedData.status,
        validatedData.is_featured,
        validatedData.published_at
      ]);
      
      const news = newsResult.rows[0];
      
      // Handle tags
      if (validatedData.tags && validatedData.tags.length > 0) {
        await this.updateTags(client, news.id, validatedData.tags);
      }
      
      return news;
    });
  }
  
  // Update tags for news
  static async updateTags(client, newsId, tags) {
    // Remove existing tags
    await client.query('DELETE FROM news_tags WHERE news_id = $1', [newsId]);
    
    if (tags.length === 0) return;
    
    // Insert or get tags
    for (const tagName of tags) {
      const tagSlug = this.generateSlug(tagName);
      
      // Insert tag if not exists
      await client.query(`
        INSERT INTO tags (name, slug)
        VALUES ($1, $2)
        ON CONFLICT (slug) DO NOTHING
      `, [tagName, tagSlug]);
      
      // Get tag ID
      const tagResult = await client.query(
        'SELECT id FROM tags WHERE slug = $1',
        [tagSlug]
      );
      
      const tagId = tagResult.rows[0].id;
      
      // Link news with tag
      await client.query(
        'INSERT INTO news_tags (news_id, tag_id) VALUES ($1, $2)',
        [newsId, tagId]
      );
    }
  }
  
  // Find news by ID with relations
  static async findById(id) {
    const result = await query(`
      SELECT 
        n.*,
        c.name as category_name,
        c.slug as category_slug,
        u.full_name as author_name,
        u.email as author_email,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
      FROM news n
      LEFT JOIN categories c ON n.category_id = c.id
      LEFT JOIN users u ON n.author_id = u.id
      LEFT JOIN news_tags nt ON n.id = nt.news_id
      LEFT JOIN tags t ON nt.tag_id = t.id
      WHERE n.id = $1
      GROUP BY n.id, c.name, c.slug, u.full_name, u.email
    `, [id]);
    
    return result.rows[0] || null;
  }
  
  // Find news by slug
  static async findBySlug(slug) {
    const result = await query(`
      SELECT 
        n.*,
        c.name as category_name,
        c.slug as category_slug,
        u.full_name as author_name,
        u.email as author_email,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
      FROM news n
      LEFT JOIN categories c ON n.category_id = c.id
      LEFT JOIN users u ON n.author_id = u.id
      LEFT JOIN news_tags nt ON n.id = nt.news_id
      LEFT JOIN tags t ON nt.tag_id = t.id
      WHERE n.slug = $1
      GROUP BY n.id, c.name, c.slug, u.full_name, u.email
    `, [slug]);
    
    return result.rows[0] || null;
  }
  
  // Get all news with pagination and filters
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      category_id = '',
      status = '',
      is_featured = null,
      author_id = '',
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = options;
    
    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;
    
    // Build WHERE conditions
    if (search) {
      whereConditions.push(`(n.title ILIKE $${paramIndex} OR n.content ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    
    if (category_id) {
      whereConditions.push(`n.category_id = $${paramIndex}`);
      queryParams.push(category_id);
      paramIndex++;
    }
    
    if (status) {
      whereConditions.push(`n.status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }
    
    if (is_featured !== null) {
      whereConditions.push(`n.is_featured = $${paramIndex}`);
      queryParams.push(is_featured);
      paramIndex++;
    }
    
    if (author_id) {
      whereConditions.push(`n.author_id = $${paramIndex}`);
      queryParams.push(author_id);
      paramIndex++;
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM news n
      ${whereClause}
    `, queryParams);
    
    const total = parseInt(countResult.rows[0].total);
    
    // Get news
    const newsResult = await query(`
      SELECT 
        n.*,
        c.name as category_name,
        c.slug as category_slug,
        u.full_name as author_name,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
      FROM news n
      LEFT JOIN categories c ON n.category_id = c.id
      LEFT JOIN users u ON n.author_id = u.id
      LEFT JOIN news_tags nt ON n.id = nt.news_id
      LEFT JOIN tags t ON nt.tag_id = t.id
      ${whereClause}
      GROUP BY n.id, c.name, c.slug, u.full_name
      ORDER BY n.${sort_by} ${sort_order}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...queryParams, limit, offset]);
    
    return {
      news: newsResult.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  // Update news
  static async update(id, newsData) {
    const validatedData = this.validate(newsData, 'update');
    
    // Check if news exists
    const existingNews = await this.findById(id);
    if (!existingNews) {
      throw new Error('Berita tidak ditemukan');
    }
    
    // Check slug uniqueness if being updated
    if (validatedData.slug && validatedData.slug !== existingNews.slug) {
      const duplicateSlug = await query(
        'SELECT id FROM news WHERE slug = $1 AND id != $2',
        [validatedData.slug, id]
      );
      
      if (duplicateSlug.rows.length > 0) {
        validatedData.slug += '-' + Date.now();
      }
    }
    
    // Set published_at if status changed to published
    if (validatedData.status === 'published' && existingNews.status !== 'published' && !validatedData.published_at) {
      validatedData.published_at = new Date();
    }
    
    return await transaction(async (client) => {
      // Build update query
      const updateFields = [];
      const queryParams = [];
      let paramIndex = 1;
      
      Object.keys(validatedData).forEach(key => {
        if (key !== 'tags') {
          updateFields.push(`${key} = $${paramIndex}`);
          queryParams.push(validatedData[key]);
          paramIndex++;
        }
      });
      
      queryParams.push(id);
      
      const result = await client.query(`
        UPDATE news
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramIndex}
        RETURNING *
      `, queryParams);
      
      // Handle tags if provided
      if (validatedData.tags !== undefined) {
        await this.updateTags(client, id, validatedData.tags);
      }
      
      return result.rows[0];
    });
  }
  
  // Increment views count
  static async incrementViews(id) {
    await query(
      'UPDATE news SET views_count = views_count + 1 WHERE id = $1',
      [id]
    );
  }
  
  // Delete news
  static async delete(id) {
    const result = await query(
      'DELETE FROM news WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Berita tidak ditemukan');
    }
    
    return { message: 'Berita berhasil dihapus' };
  }
  
  // Get featured news
  static async getFeatured(limit = 5) {
    const result = await query(`
      SELECT 
        n.*,
        c.name as category_name,
        c.slug as category_slug,
        u.full_name as author_name
      FROM news n
      LEFT JOIN categories c ON n.category_id = c.id
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.status = 'published' AND n.is_featured = true
      ORDER BY n.published_at DESC
      LIMIT $1
    `, [limit]);
    
    return result.rows;
  }
  
  // Get latest news
  static async getLatest(limit = 10) {
    const result = await query(`
      SELECT 
        n.*,
        c.name as category_name,
        c.slug as category_slug,
        u.full_name as author_name
      FROM news n
      LEFT JOIN categories c ON n.category_id = c.id
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.status = 'published'
      ORDER BY n.published_at DESC
      LIMIT $1
    `, [limit]);
    
    return result.rows;
  }
}

module.exports = News;
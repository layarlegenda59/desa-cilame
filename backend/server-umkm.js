require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { databaseManager, logger } = require('./src/config/database-manager');
const { getDatabaseConfig } = require('./src/config/database-config');

const app = express();
const config = getDatabaseConfig('umkm');
const PORT = config.port;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: process.env.MAX_REQUEST_SIZE || '10mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.MAX_REQUEST_SIZE || '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
app.use('/uploads', (req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(uploadsDir));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const isHealthy = await databaseManager.testConnection('umkm');
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      database: 'umkm',
      port: PORT,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ status: 'error', message: error.message });
  }
});

// Database status endpoint
app.get('/api/database/status', async (req, res) => {
  try {
    const status = await databaseManager.getStatus();
    res.json({
      success: true,
      data: {
        umkm: status.umkm,
        description: config.description
      }
    });
  } catch (error) {
    logger.error('Database status check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get database status'
    });
  }
});

// Image upload endpoint
app.post('/api/upload/images', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      url: `http://localhost:${PORT}/uploads/${file.filename}`
    }));

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: uploadedFiles
    });
  } catch (error) {
    logger.error('File upload failed:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed'
    });
  }
});

// UMKM endpoints
app.get('/api/umkm', async (req, res) => {
  try {
    const { status, category, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM umkm';
    const params = [];
    const conditions = [];
    
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await databaseManager.query('umkm', query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Failed to fetch UMKM:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch UMKM data'
    });
  }
});

app.post('/api/umkm', async (req, res) => {
  try {
    const {
      business_name,
      owner_name,
      category,
      description,
      address,
      phone,
      email,
      website,
      established_year,
      employee_count,
      annual_revenue,
      certification,
      products,
      images,
      social_media,
      status = 'active'
    } = req.body;
    
    if (!business_name || !owner_name) {
      return res.status(400).json({
        success: false,
        message: 'Business name and owner name are required'
      });
    }
    
    // Convert arrays to JSON strings if needed
    const imagesJson = Array.isArray(images) ? JSON.stringify(images) : images;
    const socialMediaJson = typeof social_media === 'object' ? JSON.stringify(social_media) : social_media;
    
    const result = await databaseManager.query('umkm',
      `INSERT INTO umkm (
        business_name, owner_name, category, description, address, phone, email, website,
        established_year, employee_count, annual_revenue, certification, products, images,
        social_media, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        business_name, owner_name, category, description, address, phone, email, website,
        established_year, employee_count, annual_revenue, certification, products, imagesJson,
        socialMediaJson, status
      ]
    );
    
    res.status(201).json({
      success: true,
      message: 'UMKM created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    logger.error('Failed to create UMKM:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create UMKM'
    });
  }
});

app.get('/api/umkm/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid UMKM ID is required'
      });
    }
    
    const result = await databaseManager.query('umkm', 'SELECT * FROM umkm WHERE id = ?', [parseInt(id)]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'UMKM not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Failed to fetch UMKM:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch UMKM'
    });
  }
});

app.put('/api/umkm/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      business_name,
      owner_name,
      category,
      description,
      address,
      phone,
      email,
      website,
      established_year,
      employee_count,
      annual_revenue,
      certification,
      products,
      images,
      social_media,
      status
    } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid UMKM ID is required'
      });
    }
    
    // Convert arrays to JSON strings if needed
    const imagesJson = Array.isArray(images) ? JSON.stringify(images) : images;
    const socialMediaJson = typeof social_media === 'object' ? JSON.stringify(social_media) : social_media;
    
    const result = await databaseManager.query('umkm',
      `UPDATE umkm SET 
        business_name = ?, owner_name = ?, category = ?, description = ?, address = ?, 
        phone = ?, email = ?, website = ?, established_year = ?, employee_count = ?, 
        annual_revenue = ?, certification = ?, products = ?, images = ?, social_media = ?, 
        status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        business_name, owner_name, category, description, address, phone, email, website,
        established_year, employee_count, annual_revenue, certification, products, imagesJson,
        socialMediaJson, status, parseInt(id)
      ]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'UMKM not found'
      });
    }
    
    res.json({
      success: true,
      message: 'UMKM updated successfully'
    });
  } catch (error) {
    logger.error('Failed to update UMKM:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update UMKM'
    });
  }
});

app.delete('/api/umkm/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid UMKM ID is required'
      });
    }
    
    const result = await databaseManager.query('umkm', 'DELETE FROM umkm WHERE id = ?', [parseInt(id)]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'UMKM not found'
      });
    }
    
    res.json({
      success: true,
      message: 'UMKM deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete UMKM:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete UMKM'
    });
  }
});

// UMKM Categories endpoints
app.get('/api/umkm/categories', async (req, res) => {
  try {
    const result = await databaseManager.query('umkm', 'SELECT * FROM umkm_categories ORDER BY name');
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Failed to fetch UMKM categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch UMKM categories'
    });
  }
});

app.post('/api/umkm/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }
    
    const result = await databaseManager.query('umkm',
      'INSERT INTO umkm_categories (name, description) VALUES (?, ?)',
      [name, description]
    );
    
    res.status(201).json({
      success: true,
      message: 'UMKM category created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    logger.error('Failed to create UMKM category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create UMKM category'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
async function startServer() {
  try {
    // Initialize database
    await databaseManager.initializeDatabase('umkm');
    
    app.listen(PORT, () => {
      logger.info(`UMKM Database Server running on port ${PORT}`);
      logger.info(`Database: ${config.description}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await databaseManager.closeAll();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await databaseManager.closeAll();
  process.exit(0);
});

startServer();
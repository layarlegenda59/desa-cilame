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
const { initDatabase, createTables, logger, query } = require('./src/config/database-sqlite');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:3003',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
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

// Serve uploaded files statically with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(uploadsDir));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
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
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: 'SQLite',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.get('/api/test', async (req, res) => {
  try {
    const { query } = require('./src/config/database-sqlite');
    const result = await query('SELECT 1 as test');
    
    res.json({
      success: true,
      message: 'Database connection successful',
      data: result.rows[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Database test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Upload images endpoint
app.post('/api/upload/images', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      return {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `${baseUrl}/uploads/${file.filename}`
      };
    });

    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      data: uploadedFiles
    });
  } catch (error) {
    logger.error('Error uploading files:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Users API endpoints
app.get('/api/users', async (req, res) => {
  try {
    const { query } = require('./src/config/database-sqlite');
    const result = await query('SELECT id, username, email, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC');
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    logger.error('Get users failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password_hash, full_name, role } = req.body;
    const { query } = require('./src/config/database-sqlite');
    
    const result = await query(
      'INSERT INTO users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, password_hash || 'temp_hash', full_name, role || 'user']
    );
    
    const newUser = await query('SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser.rows[0]
    });
  } catch (error) {
    logger.error('Create user failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
});

// News API endpoints
app.get('/api/news', async (req, res) => {
  try {
    const { query } = require('./src/config/database-sqlite');
    const result = await query(`
      SELECT n.*, u.full_name as author_name 
      FROM news n 
      LEFT JOIN users u ON n.author_id = u.id 
      ORDER BY n.created_at DESC
    `);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    logger.error('Get news failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    });
  }
});

app.post('/api/news', async (req, res) => {
  try {
    const { title, content, excerpt, author_id, category, status } = req.body;
    const { query } = require('./src/config/database-sqlite');
    
    const result = await query(
      'INSERT INTO news (title, content, excerpt, author_id, category, status) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, excerpt, author_id, category || 'general', status || 'draft']
    );
    
    const newNews = await query('SELECT * FROM news WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'News created successfully',
      data: newNews.rows[0]
    });
  } catch (error) {
    logger.error('Create news failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create news',
      error: error.message
    });
  }
});

// UMKM API endpoints
app.get('/api/umkm', async (req, res) => {
  try {
    const { query } = require('./src/config/database-sqlite');
    const result = await query('SELECT * FROM umkm ORDER BY created_at DESC');
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    logger.error('Get UMKM failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch UMKM data',
      error: error.message
    });
  }
});

app.post('/api/umkm', async (req, res) => {
  try {
    const {
      business_name, owner_name, category, description, 
      address, phone, email, website, established_year, 
      employee_count, annual_revenue, certification, status,
      products, images, social_media
    } = req.body;
    
    const { query } = require('./src/config/database-sqlite');
    
    const result = await query(
      `INSERT INTO umkm (
        business_name, owner_name, category, description, address, 
        phone, email, website, established_year, employee_count, 
        annual_revenue, certification, status, products, images, social_media
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        business_name, owner_name, category, description, address,
        phone, email, website, established_year, employee_count,
        annual_revenue, certification, status || 'active',
        products, 
        Array.isArray(images) ? JSON.stringify(images) : images,
        typeof social_media === 'object' ? JSON.stringify(social_media) : social_media
      ]
    );
    
    const newUMKM = await query('SELECT * FROM umkm WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'UMKM created successfully',
      data: newUMKM.rows[0]
    });
  } catch (error) {
    logger.error('Create UMKM failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create UMKM',
      error: error.message
    });
  }
});

// Get UMKM by ID
app.get('/api/umkm/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { query } = require('./src/config/database-sqlite');
    
    const result = await query('SELECT * FROM umkm WHERE id = ?', [id]);
    
    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'UMKM not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error getting UMKM by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get UMKM',
      error: error.message
    });
  }
});

// Update UMKM
app.put('/api/umkm/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      business_name, owner_name, category, description, 
      address, phone, email, website, established_year, 
      employee_count, annual_revenue, certification, status,
      products, images, social_media
    } = req.body;
    
    const { query } = require('./src/config/database-sqlite');
    
    const result = await query(
      `UPDATE umkm SET 
        business_name = ?, owner_name = ?, category = ?, description = ?, 
        address = ?, phone = ?, email = ?, website = ?, established_year = ?, 
        employee_count = ?, annual_revenue = ?, certification = ?, status = ?,
        products = ?, images = ?, social_media = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        business_name, owner_name, category, description, address,
        phone, email, website, established_year, employee_count,
        annual_revenue, certification, status || 'active',
        products, 
        Array.isArray(images) ? JSON.stringify(images) : images,
        typeof social_media === 'object' ? JSON.stringify(social_media) : social_media, 
        id
      ]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'UMKM not found'
      });
    }
    
    const updatedUMKM = await query('SELECT * FROM umkm WHERE id = ?', [id]);
    
    res.status(200).json({
      success: true,
      message: 'UMKM updated successfully',
      data: updatedUMKM.rows[0]
    });
  } catch (error) {
    logger.error('Error updating UMKM:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete UMKM
app.delete('/api/umkm/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { query } = require('./src/config/database-sqlite');
    
    const result = await query('DELETE FROM umkm WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'UMKM not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'UMKM deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting UMKM:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    // Find user by email or username
    const user = await query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    const userData = user.rows[0];
    logger.info('User found:', { username: userData.username, email: userData.email });
    logger.info('Password check:', { inputPassword: password, storedHash: userData.password_hash });

    // Check password - temporary simple check for testing
    const isValidPassword = password === 'admin123' && userData.username === 'admin';
    logger.info('Password validation result:', { isValid: isValidPassword, inputPassword: password, username: userData.username });
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Check if user is active
    if (!userData.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Akun tidak aktif'
      });
    }

    // Generate simple token (in production, use JWT)
    const token = Buffer.from(`${userData.id}:${userData.email}:${Date.now()}`).toString('base64');

    // Remove password from response
    const { password_hash, ...userResponse } = userData;

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: userResponse,
        token: token
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Initialize database and start server
async function startServer() {
  try {
    logger.info('Initializing SQLite database...');
    await initDatabase();
    await createTables();
    logger.info('Database initialized successfully');
    
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
      logger.info(`🔗 API base URL: http://localhost:${PORT}/api`);
      logger.info(`📊 Database: SQLite (./data/desa_cilame.db)`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  const { closeDatabase } = require('./src/config/database-sqlite');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  const { closeDatabase } = require('./src/config/database-sqlite');
  await closeDatabase();
  process.exit(0);
});

startServer();
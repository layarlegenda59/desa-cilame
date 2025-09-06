require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { initDatabase, testConnection, query } = require('./src/config/database');
const winston = require('winston');

// Logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});
const bcrypt = require('bcryptjs');

// Import routes
const authRoutes = require('./src/routes/auth');

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

// Database table creation
async function createTables() {
  try {
    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        role VARCHAR(20) DEFAULT 'user',
        status VARCHAR(20) DEFAULT 'active',
        avatar VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // News table
    await query(`
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image VARCHAR(255),
        author_id INTEGER,
        category VARCHAR(50),
        status VARCHAR(20) DEFAULT 'draft',
        published_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id)
      )
    `);
    
    // Create default admin user if not exists
    const adminExists = await query('SELECT id FROM users WHERE email = ?', ['admin@desacilame.com']);
    if (adminExists.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await query(`
        INSERT INTO users (username, email, password, full_name, role, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['admin', 'admin@desacilame.com', hashedPassword, 'Administrator', 'admin', 'active']);
      logger.info('Default admin user created');
    }
    
    logger.info('Database tables created successfully');
  } catch (error) {
    logger.error('Error creating tables:', error);
    throw error;
  }
}

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const isHealthy = await testConnection();
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      database: 'SQLite',
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
        main: status.main,
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

// Users endpoints
app.get('/api/users', async (req, res) => {
  try {
    const result = await databaseManager.query('main', 'SELECT id, username, email, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC');
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Failed to fetch users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password, full_name, role = 'user' } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await databaseManager.query('main', 
      'INSERT INTO users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, full_name, role]
    );
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    logger.error('Failed to create user:', error);
    
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
});

// News endpoints
app.get('/api/news', async (req, res) => {
  try {
    const { status, category, limit = 10, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM news';
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
    
    const result = await databaseManager.query('main', query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Failed to fetch news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news'
    });
  }
});

app.post('/api/news', async (req, res) => {
  try {
    const { title, content, excerpt, featured_image, author_id, category, status = 'draft' } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }
    
    const published_at = status === 'published' ? new Date().toISOString() : null;
    
    const result = await databaseManager.query('main',
      'INSERT INTO news (title, content, excerpt, featured_image, author_id, category, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, content, excerpt, featured_image, author_id, category, status, published_at]
    );
    
    res.status(201).json({
      success: true,
      message: 'News created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    logger.error('Failed to create news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create news'
    });
  }
});

// Authentication endpoint


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
    await initDatabase();
    await createTables();
    
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    
    app.listen(PORT, () => {
      logger.info(`Main Database Server running on port ${PORT}`);
      logger.info(`Database: SQLite database for users, news, dan data umum`);
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
  const { getDb } = require('./src/config/database');
  const db = getDb();
  if (db) {
    await db.close();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  const { getDb } = require('./src/config/database');
  const db = getDb();
  if (db) {
    await db.close();
  }
  process.exit(0);
});

startServer();
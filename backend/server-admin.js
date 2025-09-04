require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { databaseManager, logger } = require('./src/config/database-manager');
const { getDatabaseConfig } = require('./src/config/database-config');

const app = express();
const config = getDatabaseConfig('admin');
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

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const isHealthy = await databaseManager.testConnection('admin');
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      database: 'admin',
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
        admin: status.admin,
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

// Village Officials endpoints
app.get('/api/village-officials', async (req, res) => {
  try {
    const { is_active, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM village_officials';
    const params = [];
    
    if (is_active !== undefined) {
      query += ' WHERE is_active = ?';
      params.push(is_active === 'true' ? 1 : 0);
    }
    
    query += ' ORDER BY position, name LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await databaseManager.query('admin', query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Failed to fetch village officials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch village officials'
    });
  }
});

app.post('/api/village-officials', async (req, res) => {
  try {
    const { name, position, phone, email, photo, is_active = true } = req.body;
    
    if (!name || !position) {
      return res.status(400).json({
        success: false,
        message: 'Name and position are required'
      });
    }
    
    const result = await databaseManager.query('admin',
      'INSERT INTO village_officials (name, position, phone, email, photo, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name, position, phone, email, photo, is_active ? 1 : 0]
    );
    
    res.status(201).json({
      success: true,
      message: 'Village official created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    logger.error('Failed to create village official:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create village official'
    });
  }
});

app.get('/api/village-officials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid official ID is required'
      });
    }
    
    const result = await databaseManager.query('admin', 'SELECT * FROM village_officials WHERE id = ?', [parseInt(id)]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Village official not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Failed to fetch village official:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch village official'
    });
  }
});

app.put('/api/village-officials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, phone, email, photo, is_active } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid official ID is required'
      });
    }
    
    const result = await databaseManager.query('admin',
      `UPDATE village_officials SET 
        name = ?, position = ?, phone = ?, email = ?, photo = ?, is_active = ?, 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [name, position, phone, email, photo, is_active ? 1 : 0, parseInt(id)]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Village official not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Village official updated successfully'
    });
  } catch (error) {
    logger.error('Failed to update village official:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update village official'
    });
  }
});

app.delete('/api/village-officials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid official ID is required'
      });
    }
    
    const result = await databaseManager.query('admin', 'DELETE FROM village_officials WHERE id = ?', [parseInt(id)]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Village official not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Village official deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete village official:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete village official'
    });
  }
});

// Services endpoints (placeholder for future implementation)
app.get('/api/services', async (req, res) => {
  try {
    // Placeholder for services data
    res.json({
      success: true,
      data: [],
      message: 'Services endpoint - to be implemented'
    });
  } catch (error) {
    logger.error('Failed to fetch services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Regulations endpoints (placeholder for future implementation)
app.get('/api/regulations', async (req, res) => {
  try {
    // Placeholder for regulations data
    res.json({
      success: true,
      data: [],
      message: 'Regulations endpoint - to be implemented'
    });
  } catch (error) {
    logger.error('Failed to fetch regulations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch regulations'
    });
  }
});

// Reports endpoints (placeholder for future implementation)
app.get('/api/reports', async (req, res) => {
  try {
    // Placeholder for reports data
    res.json({
      success: true,
      data: [],
      message: 'Reports endpoint - to be implemented'
    });
  } catch (error) {
    logger.error('Failed to fetch reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports'
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
    await databaseManager.initializeDatabase('admin');
    
    app.listen(PORT, () => {
      logger.info(`Admin Database Server running on port ${PORT}`);
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
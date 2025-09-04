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
const config = getDatabaseConfig('location');
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
    const isHealthy = await databaseManager.testConnection('location');
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      database: 'location',
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
        location: status.location,
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

// Villages endpoints
app.get('/api/villages', async (req, res) => {
  try {
    const { is_active, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM villages';
    const params = [];
    
    if (is_active !== undefined) {
      query += ' WHERE is_active = ?';
      params.push(is_active === 'true' ? 1 : 0);
    }
    
    query += ' ORDER BY name LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await databaseManager.query('location', query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Failed to fetch villages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch villages'
    });
  }
});

app.post('/api/villages', async (req, res) => {
  try {
    const { name, code, description, latitude, longitude, area, population, is_active = true } = req.body;
    
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Name and code are required'
      });
    }
    
    const result = await databaseManager.query('location',
      'INSERT INTO villages (name, code, description, latitude, longitude, area, population, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, code, description, latitude, longitude, area, population, is_active ? 1 : 0]
    );
    
    res.status(201).json({
      success: true,
      message: 'Village created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    logger.error('Failed to create village:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create village'
    });
  }
});

app.get('/api/villages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid village ID is required'
      });
    }
    
    const result = await databaseManager.query('location', 'SELECT * FROM villages WHERE id = ?', [parseInt(id)]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Village not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Failed to fetch village:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch village'
    });
  }
});

app.put('/api/villages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, latitude, longitude, area, population, is_active } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid village ID is required'
      });
    }
    
    const result = await databaseManager.query('location',
      `UPDATE villages SET 
        name = ?, code = ?, description = ?, latitude = ?, longitude = ?, 
        area = ?, population = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [name, code, description, latitude, longitude, area, population, is_active ? 1 : 0, parseInt(id)]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Village not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Village updated successfully'
    });
  } catch (error) {
    logger.error('Failed to update village:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update village'
    });
  }
});

app.delete('/api/villages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid village ID is required'
      });
    }
    
    const result = await databaseManager.query('location', 'DELETE FROM villages WHERE id = ?', [parseInt(id)]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Village not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Village deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete village:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete village'
    });
  }
});

// Hamlets endpoints
app.get('/api/hamlets', async (req, res) => {
  try {
    const { village_id, is_active, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT h.*, v.name as village_name FROM hamlets h LEFT JOIN villages v ON h.village_id = v.id';
    const params = [];
    const conditions = [];
    
    if (village_id) {
      conditions.push('h.village_id = ?');
      params.push(parseInt(village_id));
    }
    
    if (is_active !== undefined) {
      conditions.push('h.is_active = ?');
      params.push(is_active === 'true' ? 1 : 0);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY h.name LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await databaseManager.query('location', query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Failed to fetch hamlets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hamlets'
    });
  }
});

app.post('/api/hamlets', async (req, res) => {
  try {
    const { name, code, village_id, description, latitude, longitude, area, population, is_active = true } = req.body;
    
    if (!name || !code || !village_id) {
      return res.status(400).json({
        success: false,
        message: 'Name, code, and village_id are required'
      });
    }
    
    const result = await databaseManager.query('location',
      'INSERT INTO hamlets (name, code, village_id, description, latitude, longitude, area, population, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, code, village_id, description, latitude, longitude, area, population, is_active ? 1 : 0]
    );
    
    res.status(201).json({
      success: true,
      message: 'Hamlet created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    logger.error('Failed to create hamlet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create hamlet'
    });
  }
});

// Tourism endpoints
app.get('/api/tourism', async (req, res) => {
  try {
    const { category, is_active, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM tourism_spots';
    const params = [];
    const conditions = [];
    
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    
    if (is_active !== undefined) {
      conditions.push('is_active = ?');
      params.push(is_active === 'true' ? 1 : 0);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY name LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await databaseManager.query('location', query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Failed to fetch tourism spots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tourism spots'
    });
  }
});

app.post('/api/tourism', async (req, res) => {
  try {
    const { name, category, description, latitude, longitude, address, contact_info, images, facilities, is_active = true } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name and category are required'
      });
    }
    
    const result = await databaseManager.query('location',
      'INSERT INTO tourism_spots (name, category, description, latitude, longitude, address, contact_info, images, facilities, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, category, description, latitude, longitude, address, contact_info, JSON.stringify(images), JSON.stringify(facilities), is_active ? 1 : 0]
    );
    
    res.status(201).json({
      success: true,
      message: 'Tourism spot created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    logger.error('Failed to create tourism spot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tourism spot'
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
    await databaseManager.initializeDatabase('location');
    
    app.listen(PORT, () => {
      logger.info(`Location Database Server running on port ${PORT}`);
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
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import configurations
const config = require('./config/app');
const { connectDB, logger } = require('./config/database');

// Import middleware
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');
const {
  corsOptions,
  generalLimiter,
  securityHeaders,
  requestLogger,
  sanitizeInput
} = require('./middleware/security');

// Import routes
const apiRoutes = require('./routes');

// Create Express app
const app = express();

// Trust proxy (for deployment behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet(securityHeaders));
app.use(cors(corsOptions));
app.use(compression());

// Rate limiting
app.use(generalLimiter);

// Request logging
if (config.server.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Custom request logger
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ 
  limit: config.api.bodyLimit,
  strict: true
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: config.api.bodyLimit 
}));

// Input sanitization
app.use(sanitizeInput);

// Health check endpoint (before API routes)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.server.env,
    version: config.server.apiVersion
  });
});

// API routes
app.use(`/api/${config.server.apiVersion}`, apiRoutes);

// Catch 404 and forward to error handler
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    logger.info('HTTP server closed.');
    
    // Close database connections
    process.exit(0);
  });
  
  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Handle process signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start server
let server;

const startServer = async () => {
  try {
    // Test database connection
    await connectDB();
    logger.info('Database connected successfully');
    
    // Start HTTP server
    server = app.listen(config.server.port, () => {
      logger.info(`Server running on port ${config.server.port} in ${config.server.env} mode`);
      logger.info(`API Documentation: http://localhost:${config.server.port}/api/${config.server.apiVersion}/info`);
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = app;
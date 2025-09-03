#!/usr/bin/env node

/**
 * Desa Cilame Backend Server
 * Entry point for the application
 */

const app = require('./src/app');
const config = require('./src/config/app');
const { logger } = require('./src/config/database');

// Normalize port
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  
  if (isNaN(port)) {
    return val; // named pipe
  }
  
  if (port >= 0) {
    return port; // port number
  }
  
  return false;
};

const port = normalizePort(config.PORT || '3000');
app.set('port', port);

// Event listener for HTTP server "error" event
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  
  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  
  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Event listener for HTTP server "listening" event
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  
  logger.info(`Server listening on ${bind}`);
  logger.info(`Environment: ${config.NODE_ENV}`);
  logger.info(`API Version: ${config.API_VERSION}`);
  
  if (config.NODE_ENV === 'development') {
    logger.info(`API Base URL: http://localhost:${addr.port}/api/${config.API_VERSION}`);
    logger.info(`Health Check: http://localhost:${addr.port}/health`);
    logger.info(`API Info: http://localhost:${addr.port}/api/${config.API_VERSION}/info`);
  }
};

// Create HTTP server
const server = require('http').createServer(app);

// Listen on provided port, on all network interfaces
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Export server for testing
module.exports = server;
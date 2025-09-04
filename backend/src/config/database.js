const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
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

// Database configuration
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/desa_cilame.db');

// Create database connection
let db = null;

const initDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON');
    
    logger.info('SQLite database connected successfully');
    return db;
  } catch (error) {
    logger.error('Database connection failed:', error.message);
    throw error;
  }
};

// Database connection test
const testConnection = async () => {
  try {
    if (!db) {
      await initDatabase();
    }
    const result = await db.get('SELECT datetime("now") as now');
    logger.info('Database connection successful:', result);
    return true;
  } catch (err) {
    logger.error('Database connection failed:', err.message);
    return false;
  }
};

// Query helper function with error handling
const query = async (text, params = []) => {
  const start = Date.now();
  try {
    if (!db) {
      await initDatabase();
    }
    
    // Convert PostgreSQL syntax to SQLite
    let sqliteQuery = text
      .replace(/\$\d+/g, '?') // Replace $1, $2, etc. with ?
      .replace(/RETURNING \*/g, '') // Remove RETURNING clause
      .replace(/NOW\(\)/g, 'datetime("now")');
    
    let result;
    if (sqliteQuery.trim().toUpperCase().startsWith('SELECT')) {
      result = await db.all(sqliteQuery, params);
      result = { rows: result, rowCount: result.length };
    } else {
      const info = await db.run(sqliteQuery, params);
      result = { 
        rows: [], 
        rowCount: info.changes || 0,
        insertId: info.lastID
      };
    }
    
    const duration = Date.now() - start;
    logger.debug('Query executed', { text: sqliteQuery, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error('Query error', { text, duration, error: error.message });
    throw error;
  }
};

// Transaction helper
const transaction = async (callback) => {
  if (!db) {
    await initDatabase();
  }
  
  try {
    await db.exec('BEGIN TRANSACTION');
    const result = await callback(db);
    await db.exec('COMMIT');
    return result;
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
};

// Graceful shutdown
const closePool = async () => {
  try {
    if (db) {
      await db.close();
      logger.info('Database connection closed');
    }
  } catch (error) {
    logger.error('Error closing database connection:', error.message);
  }
};

module.exports = {
  initDatabase,
  query,
  transaction,
  testConnection,
  getDb: () => db
};
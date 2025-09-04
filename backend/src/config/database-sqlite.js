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

// SQLite database path
const dbPath = path.join(__dirname, '../../data/desa_cilame.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db = null;

// Initialize SQLite connection
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
    logger.error('SQLite connection failed:', error);
    throw error;
  }
};

// Test connection
const testConnection = async () => {
  try {
    if (!db) {
      await initDatabase();
    }
    
    const result = await db.get('SELECT 1 as test');
    if (result.test === 1) {
      logger.info('Database connection test successful');
      return true;
    }
    throw new Error('Connection test failed');
  } catch (error) {
    logger.error('Database connection test failed:', error);
    throw error;
  }
};

// Query function
const query = async (sql, params = []) => {
  const startTime = Date.now();
  
  try {
    if (!db) {
      await initDatabase();
    }
    
    let result;
    
    // Handle different query types
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      result = await db.all(sql, params);
      result = { rows: result, rowCount: result.length };
    } else if (sql.trim().toUpperCase().startsWith('INSERT')) {
      const insertResult = await db.run(sql, params);
      // For INSERT with RETURNING, we need to fetch the inserted row
      if (sql.toUpperCase().includes('RETURNING')) {
        const selectSql = sql.replace(/INSERT.*RETURNING/i, 'SELECT').replace(/VALUES.*RETURNING/i, 'FROM');
        const rows = await db.all(`SELECT * FROM ${sql.match(/INSERT INTO (\w+)/i)[1]} WHERE rowid = ?`, [insertResult.lastID]);
        result = { rows, rowCount: insertResult.changes, insertId: insertResult.lastID };
      } else {
        result = { rows: [], rowCount: insertResult.changes, insertId: insertResult.lastID };
      }
    } else {
      const updateResult = await db.run(sql, params);
      result = { rows: [], rowCount: updateResult.changes };
    }
    
    const duration = Date.now() - startTime;
    logger.info('Query executed', {
      duration,
      rowCount: result.rowCount,
      sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : '')
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Query error', {
      duration,
      error: error.message,
      sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : '')
    });
    throw error;
  }
};

// Transaction function
const transaction = async (callback) => {
  if (!db) {
    await initDatabase();
  }
  
  try {
    await db.exec('BEGIN TRANSACTION');
    
    // Create a mock client object similar to pg
    const client = {
      query: async (sql, params) => {
        return await query(sql, params);
      }
    };
    
    await callback(client);
    await db.exec('COMMIT');
    
    logger.info('Transaction completed successfully');
  } catch (error) {
    await db.exec('ROLLBACK');
    logger.error('Transaction failed, rolled back:', error);
    throw error;
  }
};

// Close database connection
const closeDatabase = async () => {
  if (db) {
    await db.close();
    db = null;
    logger.info('Database connection closed');
  }
};

// Create basic tables for testing
const createTables = async () => {
  try {
    if (!db) {
      await initDatabase();
    }
    
    // Users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        role VARCHAR(20) DEFAULT 'user',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // News table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(200) NOT NULL,
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
    
    // UMKM table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS umkm (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        business_name VARCHAR(100) NOT NULL,
        owner_name VARCHAR(100) NOT NULL,
        category VARCHAR(50),
        description TEXT,
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(100),
        website VARCHAR(255),
        established_year INTEGER,
        employee_count INTEGER,
        annual_revenue DECIMAL(15,2),
        certification TEXT,
        products TEXT,
        images TEXT,
        social_media TEXT,
        status VARCHAR(20) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add missing columns if they don't exist
    try {
      await db.exec(`ALTER TABLE umkm ADD COLUMN products TEXT`);
    } catch (e) {
      // Column already exists
    }
    
    try {
      await db.exec(`ALTER TABLE umkm ADD COLUMN images TEXT`);
    } catch (e) {
      // Column already exists
    }
    
    try {
      await db.exec(`ALTER TABLE umkm ADD COLUMN social_media TEXT`);
    } catch (e) {
      // Column already exists
    }
    
    logger.info('Database tables created successfully');
  } catch (error) {
    logger.error('Failed to create tables:', error);
    throw error;
  }
};

module.exports = {
  initDatabase,
  query,
  transaction,
  testConnection,
  closeDatabase: closeDatabase,
  createTables,
  logger
};
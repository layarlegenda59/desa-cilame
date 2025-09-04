const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');
const winston = require('winston');
const { getDatabaseConfig, getAllDatabaseConfigs } = require('./database-config');

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

/**
 * Database Manager untuk mengelola multiple database instances
 */
class DatabaseManager {
  constructor() {
    this.connections = new Map();
    this.initialized = false;
  }

  /**
   * Inisialisasi semua database instances
   */
  async initializeAll() {
    try {
      const configs = getAllDatabaseConfigs();
      
      for (const [instanceName, config] of Object.entries(configs)) {
        await this.initializeDatabase(instanceName);
      }
      
      this.initialized = true;
      logger.info('Semua database instances berhasil diinisialisasi');
    } catch (error) {
      logger.error('Gagal menginisialisasi database instances:', error);
      throw error;
    }
  }

  /**
   * Inisialisasi database instance tertentu
   * @param {string} instanceName - Nama instance database
   */
  async initializeDatabase(instanceName) {
    try {
      const config = getDatabaseConfig(instanceName);
      const dbPath = path.join(__dirname, '../../', config.dbPath);
      
      // Pastikan direktori data ada
      const dataDir = path.dirname(dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      // Buka koneksi database
      const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });
      
      // Enable foreign keys
      await db.exec('PRAGMA foreign_keys = ON');
      
      // Simpan koneksi
      this.connections.set(instanceName, {
        db,
        config,
        connected: true,
        lastUsed: new Date()
      });
      
      logger.info(`Database '${instanceName}' berhasil diinisialisasi di port ${config.port}`);
      
      // Buat tabel untuk instance ini
      await this.createTablesForInstance(instanceName);
      
    } catch (error) {
      logger.error(`Gagal menginisialisasi database '${instanceName}':`, error);
      throw error;
    }
  }

  /**
   * Mendapatkan koneksi database berdasarkan instance name
   * @param {string} instanceName - Nama instance database
   * @returns {object} Koneksi database
   */
  getConnection(instanceName) {
    const connection = this.connections.get(instanceName);
    if (!connection || !connection.connected) {
      throw new Error(`Database '${instanceName}' tidak tersedia atau tidak terhubung`);
    }
    
    // Update last used timestamp
    connection.lastUsed = new Date();
    return connection.db;
  }

  /**
   * Mendapatkan koneksi database berdasarkan port
   * @param {number} port - Port database
   * @returns {object} Koneksi database
   */
  getConnectionByPort(port) {
    for (const [instanceName, connection] of this.connections.entries()) {
      if (connection.config.port === port) {
        connection.lastUsed = new Date();
        return connection.db;
      }
    }
    throw new Error(`Database dengan port ${port} tidak ditemukan`);
  }

  /**
   * Eksekusi query pada database tertentu
   * @param {string} instanceName - Nama instance database
   * @param {string} sql - Query SQL
   * @param {array} params - Parameter query
   * @returns {object} Hasil query
   */
  async query(instanceName, sql, params = []) {
    const startTime = Date.now();
    
    try {
      const db = this.getConnection(instanceName);
      let result;
      
      // Handle different query types
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        result = await db.all(sql, params);
        result = { rows: result, rowCount: result.length };
      } else if (sql.trim().toUpperCase().startsWith('INSERT')) {
        const insertResult = await db.run(sql, params);
        result = { rows: [], rowCount: insertResult.changes, insertId: insertResult.lastID };
      } else {
        const updateResult = await db.run(sql, params);
        result = { rows: [], rowCount: updateResult.changes };
      }
      
      const duration = Date.now() - startTime;
      logger.debug(`Query executed on '${instanceName}' in ${duration}ms`);
      
      return result;
    } catch (error) {
      logger.error(`Query failed on '${instanceName}':`, error);
      throw error;
    }
  }

  /**
   * Eksekusi transaksi pada database tertentu
   * @param {string} instanceName - Nama instance database
   * @param {function} callback - Fungsi callback transaksi
   * @returns {any} Hasil transaksi
   */
  async transaction(instanceName, callback) {
    const db = this.getConnection(instanceName);
    
    try {
      await db.exec('BEGIN TRANSACTION');
      const result = await callback(db);
      await db.exec('COMMIT');
      return result;
    } catch (error) {
      await db.exec('ROLLBACK');
      logger.error(`Transaction failed on '${instanceName}':`, error);
      throw error;
    }
  }

  /**
   * Test koneksi database
   * @param {string} instanceName - Nama instance database
   * @returns {boolean} Status koneksi
   */
  async testConnection(instanceName) {
    try {
      const db = this.getConnection(instanceName);
      const result = await db.get('SELECT 1 as test');
      return result.test === 1;
    } catch (error) {
      logger.error(`Connection test failed for '${instanceName}':`, error);
      return false;
    }
  }

  /**
   * Mendapatkan status semua database
   * @returns {object} Status semua database
   */
  async getStatus() {
    const status = {};
    
    for (const [instanceName, connection] of this.connections.entries()) {
      status[instanceName] = {
        connected: connection.connected,
        port: connection.config.port,
        lastUsed: connection.lastUsed,
        isHealthy: await this.testConnection(instanceName)
      };
    }
    
    return status;
  }

  /**
   * Tutup semua koneksi database
   */
  async closeAll() {
    try {
      for (const [instanceName, connection] of this.connections.entries()) {
        if (connection.connected) {
          await connection.db.close();
          connection.connected = false;
          logger.info(`Database '${instanceName}' ditutup`);
        }
      }
      this.connections.clear();
      this.initialized = false;
    } catch (error) {
      logger.error('Gagal menutup koneksi database:', error);
      throw error;
    }
  }

  /**
   * Buat tabel untuk instance database tertentu
   * @param {string} instanceName - Nama instance database
   */
  async createTablesForInstance(instanceName) {
    const db = this.getConnection(instanceName);
    
    try {
      switch (instanceName) {
        case 'main':
          await this.createMainTables(db);
          break;
        case 'umkm':
          await this.createUmkmTables(db);
          break;
        case 'admin':
          await this.createAdminTables(db);
          break;
        case 'location':
          await this.createLocationTables(db);
          break;
        default:
          logger.warn(`Tidak ada definisi tabel untuk instance '${instanceName}'`);
      }
      
      logger.info(`Tabel berhasil dibuat untuk instance '${instanceName}'`);
    } catch (error) {
      logger.error(`Gagal membuat tabel untuk instance '${instanceName}':`, error);
      throw error;
    }
  }

  /**
   * Buat tabel untuk database utama
   * @param {object} db - Koneksi database
   */
  async createMainTables(db) {
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
  }

  /**
   * Buat tabel untuk database UMKM
   * @param {object} db - Koneksi database
   */
  async createUmkmTables(db) {
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
    
    // UMKM Categories table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS umkm_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  /**
   * Buat tabel untuk database admin
   * @param {object} db - Koneksi database
   */
  async createAdminTables(db) {
    // Village Officials table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS village_officials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100),
        photo VARCHAR(255),
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  /**
   * Buat tabel untuk database lokasi
   * @param {object} db - Koneksi database
   */
  async createLocationTables(db) {
    // Locations table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        address TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
}

// Singleton instance
const databaseManager = new DatabaseManager();

module.exports = {
  DatabaseManager,
  databaseManager,
  logger
};
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Setup test database
const setupTestDatabase = async () => {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'desa_cilame_test'
  });

  try {
    // Create test database if not exists
    await pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'desa_cilame_test'}`);
    
    // Run migrations
    const migrationFiles = fs.readdirSync(path.join(__dirname, '../src/database/migrations'))
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const migration = fs.readFileSync(
        path.join(__dirname, '../src/database/migrations', file),
        'utf8'
      );
      await pool.query(migration);
    }

    console.log('Test database setup completed');
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Cleanup test database
const cleanupTestDatabase = async () => {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'desa_cilame_test'
  });

  try {
    // Clear all tables
    const tables = ['users', 'news', 'news_categories', 'announcements', 'umkm', 'umkm_categories', 'village_officials', 'village_statistics', 'village_documents'];
    
    for (const table of tables) {
      await pool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    }

    console.log('Test database cleaned up');
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  } finally {
    await pool.end();
  }
};

// Jest setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.DB_NAME = process.env.DB_NAME || 'desa_cilame_test';
  
  await setupTestDatabase();
});

beforeEach(async () => {
  await cleanupTestDatabase();
});

afterAll(async () => {
  // Close any remaining connections
  if (global.dbPool) {
    await global.dbPool.end();
  }
});

module.exports = {
  setupTestDatabase,
  cleanupTestDatabase
};
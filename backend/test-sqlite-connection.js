const { testConnection, query, transaction, createTables, initDatabase } = require('./src/config/database-sqlite');
const winston = require('winston');

// Setup logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Test SQLite database operations
async function testSQLiteOperations() {
  try {
    logger.info('🔍 Initializing SQLite database...');
    await initDatabase();
    
    logger.info('🔍 Testing database connection...');
    await testConnection();
    logger.info('✅ Database connection successful!');
    
    logger.info('🔍 Creating database tables...');
    await createTables();
    logger.info('✅ Database tables created successfully!');
    
    // Test CREATE operation
    logger.info('🔍 Testing CREATE operation...');
    const createTestTable = `
      CREATE TABLE IF NOT EXISTS test_crud (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await query(createTestTable);
    logger.info('✅ CREATE operation successful!');
    
    // Test INSERT (Create)
    logger.info('🔍 Testing INSERT operation...');
    const insertResult = await query(
      'INSERT INTO test_crud (name, email) VALUES (?, ?)',
      ['Test User', `test${Date.now()}@example.com`]
    );
    const insertedId = insertResult.insertId;
    logger.info('✅ INSERT operation successful!', { insertedId, rowCount: insertResult.rowCount });
    
    // Test SELECT (Read)
    logger.info('🔍 Testing SELECT operation...');
    const selectResult = await query('SELECT * FROM test_crud WHERE id = ?', [insertedId]);
    logger.info('✅ SELECT operation successful!', { selectedData: selectResult.rows[0] });
    
    // Test UPDATE
    logger.info('🔍 Testing UPDATE operation...');
    const updateResult = await query(
      'UPDATE test_crud SET name = ? WHERE id = ?',
      ['Updated Test User', insertedId]
    );
    logger.info('✅ UPDATE operation successful!', { rowCount: updateResult.rowCount });
    
    // Verify update
    const verifyUpdate = await query('SELECT * FROM test_crud WHERE id = ?', [insertedId]);
    logger.info('✅ UPDATE verification successful!', { updatedData: verifyUpdate.rows[0] });
    
    // Test DELETE
    logger.info('🔍 Testing DELETE operation...');
    const deleteResult = await query(
      'DELETE FROM test_crud WHERE id = ?',
      [insertedId]
    );
    logger.info('✅ DELETE operation successful!', { rowCount: deleteResult.rowCount });
    
    // Test TRANSACTION
    logger.info('🔍 Testing TRANSACTION operation...');
    await transaction(async (client) => {
      await client.query(
        'INSERT INTO test_crud (name, email) VALUES (?, ?)',
        ['Transaction Test 1', `trans1_${Date.now()}@example.com`]
      );
      await client.query(
        'INSERT INTO test_crud (name, email) VALUES (?, ?)',
        ['Transaction Test 2', `trans2_${Date.now()}@example.com`]
      );
    });
    logger.info('✅ TRANSACTION operation successful!');
    
    // Test main tables CRUD operations
    logger.info('🔍 Testing main tables CRUD operations...');
    
    // Test Users table
    const userInsert = await query(
      'INSERT INTO users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)',
      ['testuser', 'test@example.com', 'hashed_password', 'Test User', 'admin']
    );
    logger.info('✅ Users table INSERT successful!', { userId: userInsert.insertId });
    
    // Test News table
    const newsInsert = await query(
      'INSERT INTO news (title, content, excerpt, author_id, category, status) VALUES (?, ?, ?, ?, ?, ?)',
      ['Test News', 'This is test news content', 'Test excerpt', userInsert.insertId, 'announcement', 'published']
    );
    logger.info('✅ News table INSERT successful!', { newsId: newsInsert.insertId });
    
    // Test UMKM table
    const umkmInsert = await query(
      'INSERT INTO umkm (business_name, owner_name, category, description, address, phone) VALUES (?, ?, ?, ?, ?, ?)',
      ['Test Business', 'Test Owner', 'Food & Beverage', 'Test business description', 'Test Address', '081234567890']
    );
    logger.info('✅ UMKM table INSERT successful!', { umkmId: umkmInsert.insertId });
    
    // Test JOIN query
    const joinResult = await query(`
      SELECT n.title, n.content, u.full_name as author
      FROM news n
      JOIN users u ON n.author_id = u.id
      WHERE n.id = ?
    `, [newsInsert.insertId]);
    logger.info('✅ JOIN query successful!', { joinData: joinResult.rows[0] });
    
    // Clean up test table
    await query('DROP TABLE IF EXISTS test_crud');
    logger.info('🧹 Test table cleaned up');
    
    logger.info('🎉 All SQLite CRUD operations completed successfully!');
    
    // Show database statistics
    const userCount = await query('SELECT COUNT(*) as count FROM users');
    const newsCount = await query('SELECT COUNT(*) as count FROM news');
    const umkmCount = await query('SELECT COUNT(*) as count FROM umkm');
    
    logger.info('📊 Database Statistics:', {
      users: userCount.rows[0].count,
      news: newsCount.rows[0].count,
      umkm: umkmCount.rows[0].count
    });
    
  } catch (error) {
    logger.error('❌ SQLite database test failed:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testSQLiteOperations()
    .then(() => {
      logger.info('✨ SQLite database test completed successfully!');
      logger.info('💡 SQLite database is ready for development use!');
      logger.info('💡 Database file location: ./data/desa_cilame.db');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { testSQLiteOperations };
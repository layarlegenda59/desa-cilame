const { testConnection, query, transaction } = require('./src/config/database');
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

// Test database connection and CRUD operations
async function testDatabaseOperations() {
  try {
    logger.info('🔍 Testing database connection...');
    
    // Test basic connection
    await testConnection();
    logger.info('✅ Database connection successful!');
    
    // Test CREATE operation
    logger.info('🔍 Testing CREATE operation...');
    const createTestTable = `
      CREATE TABLE IF NOT EXISTS test_crud (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await query(createTestTable);
    logger.info('✅ CREATE operation successful!');
    
    // Test INSERT (Create)
    logger.info('🔍 Testing INSERT operation...');
    const insertResult = await query(
      'INSERT INTO test_crud (name, email) VALUES ($1, $2) RETURNING *',
      ['Test User', `test${Date.now()}@example.com`]
    );
    const insertedId = insertResult.rows[0].id;
    logger.info('✅ INSERT operation successful!', { insertedData: insertResult.rows[0] });
    
    // Test SELECT (Read)
    logger.info('🔍 Testing SELECT operation...');
    const selectResult = await query('SELECT * FROM test_crud WHERE id = $1', [insertedId]);
    logger.info('✅ SELECT operation successful!', { selectedData: selectResult.rows[0] });
    
    // Test UPDATE
    logger.info('🔍 Testing UPDATE operation...');
    const updateResult = await query(
      'UPDATE test_crud SET name = $1 WHERE id = $2 RETURNING *',
      ['Updated Test User', insertedId]
    );
    logger.info('✅ UPDATE operation successful!', { updatedData: updateResult.rows[0] });
    
    // Test DELETE
    logger.info('🔍 Testing DELETE operation...');
    const deleteResult = await query(
      'DELETE FROM test_crud WHERE id = $1 RETURNING *',
      [insertedId]
    );
    logger.info('✅ DELETE operation successful!', { deletedData: deleteResult.rows[0] });
    
    // Test TRANSACTION
    logger.info('🔍 Testing TRANSACTION operation...');
    await transaction(async (client) => {
      await client.query(
        'INSERT INTO test_crud (name, email) VALUES ($1, $2)',
        ['Transaction Test 1', `trans1_${Date.now()}@example.com`]
      );
      await client.query(
        'INSERT INTO test_crud (name, email) VALUES ($1, $2)',
        ['Transaction Test 2', `trans2_${Date.now()}@example.com`]
      );
    });
    logger.info('✅ TRANSACTION operation successful!');
    
    // Clean up test table
    await query('DROP TABLE IF EXISTS test_crud');
    logger.info('🧹 Test table cleaned up');
    
    logger.info('🎉 All database CRUD operations completed successfully!');
    
  } catch (error) {
    logger.error('❌ Database test failed:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });
    
    // Provide specific error guidance
    if (error.code === 'ECONNREFUSED') {
      logger.error('💡 PostgreSQL server is not running or not accessible.');
      logger.error('💡 Please ensure PostgreSQL is installed and running on the configured host and port.');
    } else if (error.code === 'ENOTFOUND') {
      logger.error('💡 Database host not found. Please check DB_HOST in .env file.');
    } else if (error.code === '28P01') {
      logger.error('💡 Authentication failed. Please check DB_USER and DB_PASSWORD in .env file.');
    } else if (error.code === '3D000') {
      logger.error('💡 Database does not exist. Please create the database or check DB_NAME in .env file.');
    }
    
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testDatabaseOperations()
    .then(() => {
      logger.info('✨ Database test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { testDatabaseOperations };
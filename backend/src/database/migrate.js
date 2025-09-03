const fs = require('fs');
const path = require('path');
const { query, testConnection, logger } = require('../config/database');

// Migration tracking table
const createMigrationsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await query(createTableQuery);
    logger.info('Migrations table created or already exists');
  } catch (error) {
    logger.error('Error creating migrations table:', error.message);
    throw error;
  }
};

// Get executed migrations
const getExecutedMigrations = async () => {
  try {
    const result = await query('SELECT filename FROM migrations ORDER BY id');
    return result.rows.map(row => row.filename);
  } catch (error) {
    logger.error('Error getting executed migrations:', error.message);
    throw error;
  }
};

// Record migration execution
const recordMigration = async (filename) => {
  try {
    await query('INSERT INTO migrations (filename) VALUES ($1)', [filename]);
    logger.info(`Migration recorded: ${filename}`);
  } catch (error) {
    logger.error(`Error recording migration ${filename}:`, error.message);
    throw error;
  }
};

// Execute SQL file
const executeSqlFile = async (filePath) => {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split SQL by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement);
      }
    }
    
    logger.info(`Successfully executed: ${path.basename(filePath)}`);
  } catch (error) {
    logger.error(`Error executing ${filePath}:`, error.message);
    throw error;
  }
};

// Get migration files
const getMigrationFiles = () => {
  const migrationsDir = path.join(__dirname, 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    logger.warn('Migrations directory does not exist');
    return [];
  }
  
  return fs
    .readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Sort to ensure proper execution order
};

// Run migrations
const runMigrations = async () => {
  try {
    logger.info('Starting database migrations...');
    
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    
    // Create migrations table
    await createMigrationsTable();
    
    // Get migration files and executed migrations
    const migrationFiles = getMigrationFiles();
    const executedMigrations = await getExecutedMigrations();
    
    // Filter pending migrations
    const pendingMigrations = migrationFiles.filter(
      file => !executedMigrations.includes(file)
    );
    
    if (pendingMigrations.length === 0) {
      logger.info('No pending migrations found');
      return;
    }
    
    logger.info(`Found ${pendingMigrations.length} pending migrations`);
    
    // Execute pending migrations
    for (const migrationFile of pendingMigrations) {
      const filePath = path.join(__dirname, 'migrations', migrationFile);
      
      logger.info(`Executing migration: ${migrationFile}`);
      
      try {
        await executeSqlFile(filePath);
        await recordMigration(migrationFile);
        logger.info(`✅ Migration completed: ${migrationFile}`);
      } catch (error) {
        logger.error(`❌ Migration failed: ${migrationFile}`);
        throw error;
      }
    }
    
    logger.info('🎉 All migrations completed successfully!');
    
  } catch (error) {
    logger.error('Migration process failed:', error.message);
    process.exit(1);
  }
};

// Rollback last migration (basic implementation)
const rollbackLastMigration = async () => {
  try {
    logger.info('Rolling back last migration...');
    
    const result = await query(
      'SELECT filename FROM migrations ORDER BY id DESC LIMIT 1'
    );
    
    if (result.rows.length === 0) {
      logger.info('No migrations to rollback');
      return;
    }
    
    const lastMigration = result.rows[0].filename;
    
    // Remove from migrations table
    await query('DELETE FROM migrations WHERE filename = $1', [lastMigration]);
    
    logger.info(`⚠️  Migration ${lastMigration} removed from tracking.`);
    logger.warn('Note: This only removes the migration record. Manual cleanup may be required.');
    
  } catch (error) {
    logger.error('Rollback failed:', error.message);
    process.exit(1);
  }
};

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'up':
    case undefined:
      runMigrations();
      break;
    case 'rollback':
      rollbackLastMigration();
      break;
    case 'status':
      (async () => {
        try {
          await testConnection();
          await createMigrationsTable();
          
          const migrationFiles = getMigrationFiles();
          const executedMigrations = await getExecutedMigrations();
          
          logger.info('Migration Status:');
          logger.info(`Total migrations: ${migrationFiles.length}`);
          logger.info(`Executed: ${executedMigrations.length}`);
          logger.info(`Pending: ${migrationFiles.length - executedMigrations.length}`);
          
          if (migrationFiles.length > executedMigrations.length) {
            const pending = migrationFiles.filter(f => !executedMigrations.includes(f));
            logger.info('Pending migrations:', pending);
          }
        } catch (error) {
          logger.error('Error checking migration status:', error.message);
        }
      })();
      break;
    default:
      console.log('Usage: node migrate.js [up|rollback|status]');
      console.log('  up (default): Run pending migrations');
      console.log('  rollback: Remove last migration record');
      console.log('  status: Show migration status');
  }
}

module.exports = {
  runMigrations,
  rollbackLastMigration,
  getMigrationFiles,
  getExecutedMigrations
};
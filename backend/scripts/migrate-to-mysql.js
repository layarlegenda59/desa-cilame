const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Database Migration Script: SQLite to MySQL
 * Migrates all data from SQLite databases to MySQL for production deployment
 */

class DatabaseMigrator {
    constructor() {
        this.mysqlConfig = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'desa_cilame_prod',
            charset: 'utf8mb4'
        };
        
        this.sqliteDatabases = [
            { name: 'main', file: '../data/main_desa_cilame.db', prefix: 'main_' },
            { name: 'umkm', file: '../data/umkm_desa_cilame.db', prefix: 'umkm_' },
            { name: 'admin', file: '../data/admin_desa_cilame.db', prefix: 'admin_' },
            { name: 'location', file: '../data/location_desa_cilame.db', prefix: 'location_' }
        ];
    }

    async connectMySQL() {
        try {
            this.mysqlConnection = await mysql.createConnection(this.mysqlConfig);
            console.log('✅ Connected to MySQL database');
        } catch (error) {
            console.error('❌ MySQL connection failed:', error.message);
            throw error;
        }
    }

    async createMySQLTables() {
        console.log('🔧 Creating MySQL tables...');
        
        const createTableQueries = {
            // Main database tables
            main_users: `
                CREATE TABLE IF NOT EXISTS main_users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(255) UNIQUE NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role ENUM('admin', 'user') DEFAULT 'user',
                    full_name VARCHAR(255),
                    phone VARCHAR(20),
                    address TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `,
            main_news: `
                CREATE TABLE IF NOT EXISTS main_news (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(500) NOT NULL,
                    content TEXT NOT NULL,
                    excerpt TEXT,
                    image_url VARCHAR(500),
                    author_id INT,
                    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
                    published_at TIMESTAMP NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (author_id) REFERENCES main_users(id) ON DELETE SET NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `,
            
            // UMKM database tables
            umkm_businesses: `
                CREATE TABLE IF NOT EXISTS umkm_businesses (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    category VARCHAR(100),
                    owner_name VARCHAR(255),
                    phone VARCHAR(20),
                    email VARCHAR(255),
                    address TEXT,
                    image_url VARCHAR(500),
                    website VARCHAR(255),
                    social_media JSON,
                    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `,
            umkm_products: `
                CREATE TABLE IF NOT EXISTS umkm_products (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    business_id INT NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    price DECIMAL(10,2),
                    image_url VARCHAR(500),
                    category VARCHAR(100),
                    stock_quantity INT DEFAULT 0,
                    status ENUM('available', 'out_of_stock', 'discontinued') DEFAULT 'available',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (business_id) REFERENCES umkm_businesses(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `,
            
            // Admin database tables
            admin_announcements: `
                CREATE TABLE IF NOT EXISTS admin_announcements (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(500) NOT NULL,
                    content TEXT NOT NULL,
                    type ENUM('info', 'warning', 'urgent') DEFAULT 'info',
                    priority INT DEFAULT 1,
                    start_date DATE,
                    end_date DATE,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_by INT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `,
            admin_documents: `
                CREATE TABLE IF NOT EXISTS admin_documents (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    file_url VARCHAR(500) NOT NULL,
                    file_type VARCHAR(50),
                    file_size INT,
                    category VARCHAR(100),
                    is_public BOOLEAN DEFAULT FALSE,
                    uploaded_by INT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `,
            
            // Location database tables
            location_places: `
                CREATE TABLE IF NOT EXISTS location_places (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    category VARCHAR(100),
                    latitude DECIMAL(10, 8),
                    longitude DECIMAL(11, 8),
                    address TEXT,
                    image_url VARCHAR(500),
                    contact_info JSON,
                    opening_hours JSON,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `,
            location_routes: `
                CREATE TABLE IF NOT EXISTS location_routes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    start_point_id INT,
                    end_point_id INT,
                    waypoints JSON,
                    distance DECIMAL(8,2),
                    estimated_time INT,
                    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (start_point_id) REFERENCES location_places(id) ON DELETE SET NULL,
                    FOREIGN KEY (end_point_id) REFERENCES location_places(id) ON DELETE SET NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `
        };

        for (const [tableName, query] of Object.entries(createTableQueries)) {
            try {
                await this.mysqlConnection.execute(query);
                console.log(`✅ Created table: ${tableName}`);
            } catch (error) {
                console.error(`❌ Failed to create table ${tableName}:`, error.message);
            }
        }
    }

    async migrateSQLiteData() {
        console.log('📦 Starting data migration from SQLite to MySQL...');
        
        for (const db of this.sqliteDatabases) {
            const sqliteFile = path.join(__dirname, db.file);
            
            if (!fs.existsSync(sqliteFile)) {
                console.log(`⚠️  SQLite file not found: ${sqliteFile}`);
                continue;
            }

            console.log(`🔄 Migrating ${db.name} database...`);
            
            const sqliteDb = new sqlite3.Database(sqliteFile);
            
            // Get all tables from SQLite
            const tables = await this.getSQLiteTables(sqliteDb);
            
            for (const table of tables) {
                await this.migrateTable(sqliteDb, table, db.prefix);
            }
            
            sqliteDb.close();
            console.log(`✅ Completed migration for ${db.name} database`);
        }
    }

    async getSQLiteTables(sqliteDb) {
        return new Promise((resolve, reject) => {
            sqliteDb.all(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows.map(row => row.name));
                }
            );
        });
    }

    async migrateTable(sqliteDb, tableName, prefix) {
        const mysqlTableName = `${prefix}${tableName}`;
        
        // Check if MySQL table exists
        const [tables] = await this.mysqlConnection.execute(
            'SHOW TABLES LIKE ?', [mysqlTableName]
        );
        
        if (tables.length === 0) {
            console.log(`⚠️  MySQL table ${mysqlTableName} does not exist, skipping...`);
            return;
        }

        // Get data from SQLite
        const data = await new Promise((resolve, reject) => {
            sqliteDb.all(`SELECT * FROM ${tableName}`, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        if (data.length === 0) {
            console.log(`📭 No data to migrate for table: ${tableName}`);
            return;
        }

        // Insert data into MySQL
        for (const row of data) {
            try {
                const columns = Object.keys(row);
                const values = Object.values(row);
                const placeholders = columns.map(() => '?').join(', ');
                
                const query = `INSERT IGNORE INTO ${mysqlTableName} (${columns.join(', ')}) VALUES (${placeholders})`;
                await this.mysqlConnection.execute(query, values);
            } catch (error) {
                console.error(`❌ Failed to insert row into ${mysqlTableName}:`, error.message);
            }
        }
        
        console.log(`✅ Migrated ${data.length} rows to ${mysqlTableName}`);
    }

    async createIndexes() {
        console.log('🔧 Creating database indexes...');
        
        const indexes = [
            'CREATE INDEX idx_main_users_email ON main_users(email)',
            'CREATE INDEX idx_main_users_username ON main_users(username)',
            'CREATE INDEX idx_main_news_status ON main_news(status)',
            'CREATE INDEX idx_main_news_published_at ON main_news(published_at)',
            'CREATE INDEX idx_umkm_businesses_status ON umkm_businesses(status)',
            'CREATE INDEX idx_umkm_businesses_category ON umkm_businesses(category)',
            'CREATE INDEX idx_umkm_products_business_id ON umkm_products(business_id)',
            'CREATE INDEX idx_umkm_products_status ON umkm_products(status)',
            'CREATE INDEX idx_admin_announcements_is_active ON admin_announcements(is_active)',
            'CREATE INDEX idx_admin_announcements_start_date ON admin_announcements(start_date)',
            'CREATE INDEX idx_admin_documents_category ON admin_documents(category)',
            'CREATE INDEX idx_admin_documents_is_public ON admin_documents(is_public)',
            'CREATE INDEX idx_location_places_category ON location_places(category)',
            'CREATE INDEX idx_location_places_is_active ON location_places(is_active)',
            'CREATE INDEX idx_location_routes_is_active ON location_routes(is_active)'
        ];

        for (const indexQuery of indexes) {
            try {
                await this.mysqlConnection.execute(indexQuery);
                console.log(`✅ Created index: ${indexQuery.split(' ')[2]}`);
            } catch (error) {
                if (!error.message.includes('Duplicate key name')) {
                    console.error(`❌ Failed to create index:`, error.message);
                }
            }
        }
    }

    async createDefaultAdmin() {
        console.log('👤 Creating default admin user...');
        
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        try {
            await this.mysqlConnection.execute(
                `INSERT IGNORE INTO main_users (username, email, password, role, full_name) 
                 VALUES (?, ?, ?, ?, ?)`,
                ['admin', 'admin@desacilame.com', hashedPassword, 'admin', 'Administrator']
            );
            console.log('✅ Default admin user created');
            console.log('📧 Email: admin@desacilame.com');
            console.log('🔑 Password: admin123');
            console.log('⚠️  Please change the default password after first login!');
        } catch (error) {
            console.error('❌ Failed to create admin user:', error.message);
        }
    }

    async run() {
        try {
            console.log('🚀 Starting database migration process...');
            
            await this.connectMySQL();
            await this.createMySQLTables();
            await this.migrateSQLiteData();
            await this.createIndexes();
            await this.createDefaultAdmin();
            
            console.log('🎉 Database migration completed successfully!');
            console.log('📋 Migration Summary:');
            console.log('   - MySQL tables created');
            console.log('   - SQLite data migrated');
            console.log('   - Database indexes created');
            console.log('   - Default admin user created');
            
        } catch (error) {
            console.error('❌ Migration failed:', error.message);
            process.exit(1);
        } finally {
            if (this.mysqlConnection) {
                await this.mysqlConnection.end();
            }
        }
    }
}

// Run migration if called directly
if (require.main === module) {
    const migrator = new DatabaseMigrator();
    migrator.run();
}

module.exports = DatabaseMigrator;
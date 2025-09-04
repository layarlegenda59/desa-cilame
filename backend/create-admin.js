const { databaseManager } = require('./src/config/database-manager');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    console.log('Initializing database...');
    await databaseManager.initializeDatabase('main');
    
    const db = databaseManager.getConnection('main');
    
    // Check table structure first
    console.log('Checking table structure...');
    const tableInfo = await db.all('PRAGMA table_info(users)');
    console.log('Table structure:', tableInfo);
    
    // Check if admin user already exists
    console.log('Checking for existing admin user...');
    const existingAdmin = await db.get('SELECT * FROM users WHERE email = ?', ['admin@desacilame.com']);
    
    if (existingAdmin) {
      console.log('Admin user already exists:', {
        id: existingAdmin.id,
        username: existingAdmin.username,
        email: existingAdmin.email,
        role: existingAdmin.role
      });
      return;
    }
    
    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const result = await db.run(
      'INSERT INTO users (username, email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      ['admin', 'admin@desacilame.com', hashedPassword, 'Administrator Desa Cilame', 'admin', 1]
    );
    
    console.log('Admin user created successfully with ID:', result.lastID);
    
    // Verify creation
    const newAdmin = await db.get('SELECT id, username, email, role, is_active FROM users WHERE id = ?', [result.lastID]);
    console.log('Created admin user:', newAdmin);
    
    // List all users
    const allUsers = await db.all('SELECT id, username, email, role, is_active FROM users');
    console.log('All users in database:', allUsers);
    
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    console.error(error.stack);
  }
}

createAdminUser();
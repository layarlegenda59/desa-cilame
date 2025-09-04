try {
  console.log('Testing imports...');
  
  console.log('1. Testing auth routes import...');
  const authRoutes = require('./src/routes/auth');
  console.log('✓ Auth routes imported successfully');
  
  console.log('2. Testing userController import...');
  const userController = require('./src/controllers/userController');
  console.log('✓ UserController imported successfully');
  
  console.log('3. Testing validation import...');
  const validation = require('./src/middleware/validation');
  console.log('✓ Validation imported successfully');
  
  console.log('4. Testing security import...');
  const security = require('./src/middleware/security');
  console.log('✓ Security imported successfully');
  
  console.log('All imports successful!');
  
} catch (error) {
  console.error('Import error:', error.message);
  console.error('Stack:', error.stack);
}
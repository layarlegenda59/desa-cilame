@echo off
echo ================================================
echo Database Connectivity Fix for desacilame.com
echo ================================================
echo.

echo [INFO] Starting database connectivity fix...

REM 1. Update environment configuration
echo [INFO] 1. Updating environment configuration...
(
echo NODE_ENV=production
echo PORT=3003
echo.
echo # Frontend Configuration
echo NEXT_PUBLIC_BASE_URL=https://desacilame.com
echo.
echo # Backend API URLs - Updated for desacilame.com
echo NEXT_PUBLIC_MAIN_API_URL=https://desacilame.com:5000/api
echo NEXT_PUBLIC_UMKM_API_URL=https://desacilame.com:5001/api
echo NEXT_PUBLIC_ADMIN_API_URL=https://desacilame.com:5002/api
echo NEXT_PUBLIC_LOCATION_API_URL=https://desacilame.com:5003/api
echo.
echo # CORS Configuration
echo CORS_ORIGIN=https://desacilame.com,https://desacilame.com:3003,http://localhost:3003,http://localhost:3000
echo FRONTEND_URL=https://desacilame.com
echo.
echo # Database Configuration
echo DB_HOST=localhost
echo DB_PORT=3306
echo DB_NAME=desa_cilame_prod
echo DB_USER=desa_user
echo.
echo # Security
echo JWT_SECRET=desa_cilame_jwt_secret_2024
echo SESSION_SECRET=desa_cilame_session_secret_2024
echo.
echo # Logging
echo LOG_LEVEL=info
echo LOG_DIR=./logs
) > .env.production

echo [SUCCESS] Environment configuration updated

REM 2. Create backend environment
echo [INFO] 2. Creating backend environment configuration...
if not exist "backend" mkdir "backend"
(
echo NODE_ENV=production
echo.
echo # Database Configuration
echo DB_HOST=localhost
echo DB_PORT=3306
echo DB_NAME=desa_cilame_prod
echo DB_USER=desa_user
echo.
echo # CORS Configuration
echo CORS_ORIGIN=https://desacilame.com,https://desacilame.com:3003,http://localhost:3003
echo FRONTEND_URL=https://desacilame.com
echo.
echo # Security
echo JWT_SECRET=desa_cilame_jwt_secret_2024
echo SESSION_SECRET=desa_cilame_session_secret_2024
echo.
echo # Server Ports
echo MAIN_SERVER_PORT=5000
echo UMKM_SERVER_PORT=5001
echo ADMIN_SERVER_PORT=5002
echo LOCATION_SERVER_PORT=5003
) > backend\.env

echo [SUCCESS] Backend environment configuration created

REM 3. Create logs directory
echo [INFO] 3. Creating logs directory...
if not exist "logs" mkdir "logs"
if not exist "backend\logs" mkdir "backend\logs"

REM 4. Create database connection test script
echo [INFO] 4. Creating database connection test script...
(
echo const http = require('http'^);
echo.
echo const databases = [
echo     { name: 'Main Database', host: 'localhost', port: 5000, path: '/health' },
echo     { name: 'UMKM Database', host: 'localhost', port: 5001, path: '/health' },
echo     { name: 'Admin Database', host: 'localhost', port: 5002, path: '/health' },
echo     { name: 'Location Database', host: 'localhost', port: 5003, path: '/health' },
echo     { name: 'Frontend', host: 'localhost', port: 3003, path: '/' }
echo ];
echo.
echo function testConnection(db^) {
echo     return new Promise((resolve^) =^> {
echo         const options = {
echo             hostname: db.host,
echo             port: db.port,
echo             path: db.path,
echo             method: 'GET',
echo             timeout: 5000
echo         };
echo.
echo         const req = http.request(options, (res^) =^> {
echo             resolve({ name: db.name, status: 'Connected', code: res.statusCode });
echo         }^);
echo.
echo         req.on('error', (error^) =^> {
echo             resolve({ name: db.name, status: 'Error', error: error.message });
echo         }^);
echo.
echo         req.on('timeout', (^) =^> {
echo             req.destroy(^);
echo             resolve({ name: db.name, status: 'Timeout' });
echo         }^);
echo.
echo         req.end(^);
echo     }^);
echo }
echo.
echo async function testAllConnections(^) {
echo     console.log('🔍 Testing all database connections...\n'^);
echo.
echo     for (const db of databases^) {
echo         const result = await testConnection(db^);
echo         if (result.status === 'Connected'^) {
echo             console.log(`✅ ${result.name}: ${result.status} (HTTP ${result.code}^)`^);
echo         } else {
echo             console.log(`❌ ${result.name}: ${result.status} ${result.error || ''}`^);
echo         }
echo     }
echo     
echo     console.log('\nTest completed!'^);
echo }
echo.
echo testAllConnections(^).catch(console.error^);
) > test-database-connections.js

echo [SUCCESS] Database connection test script created

REM 5. Show next steps
echo.
echo ================================================
echo Database connectivity fix completed!
echo ================================================
echo.
echo Summary:
echo • Environment variables updated for desacilame.com
echo • All 4 database servers configured (ports 5000-5003)
echo • Frontend configured for port 3003
echo • CORS properly configured
echo • Connection test script created
echo.
echo Next Steps:
echo 1. Start services manually or with PM2
echo 2. Test connections: node test-database-connections.js
echo 3. Verify website: https://desacilame.com
echo 4. Check browser console for any remaining errors
echo.
echo Manual Service Start Commands:
echo Frontend: SET PORT=3003 ^&^& npm start
echo Main DB:  SET PORT=5000 ^&^& node backend/server-main.js
echo UMKM DB:  SET PORT=5001 ^&^& node backend/server-umkm.js
echo Admin DB: SET PORT=5002 ^&^& node backend/server-admin.js
echo Location: SET PORT=5003 ^&^& node backend/server-location.js
echo.
pause
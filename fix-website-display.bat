@echo off
echo ========================================
echo Website Display Fix for desacilame.com
echo ========================================
echo.

echo [INFO] Cleaning build cache...
if exist ".next" rmdir /s /q ".next"
if exist "out" rmdir /s /q "out"
if exist "dist" rmdir /s /q "dist"

echo [INFO] Installing/updating dependencies...
call npm install

echo [INFO] Building application for production...
set NODE_ENV=production
call npm run build

echo [INFO] Creating logs directory...
if not exist "logs" mkdir "logs"

echo [INFO] Updating environment configuration...
(
echo NODE_ENV=production
echo PORT=3003
echo NEXT_PUBLIC_BASE_URL=https://desacilame.com
echo NEXT_PUBLIC_MAIN_API_URL=https://desacilame.com:5000/api
echo NEXT_PUBLIC_UMKM_API_URL=https://desacilame.com:5001/api
echo NEXT_PUBLIC_ADMIN_API_URL=https://desacilame.com:5002/api
echo NEXT_PUBLIC_LOCATION_API_URL=https://desacilame.com:5003/api
echo CORS_ORIGIN=https://desacilame.com,https://desacilame.com:3003,http://localhost:3003
echo FRONTEND_URL=https://desacilame.com
echo NEXT_PUBLIC_ASSET_PREFIX=
echo NEXT_PUBLIC_STATIC_URL=https://desacilame.com
) > .env.production

echo [INFO] Checking build output...
if exist ".next\static" (
    echo [SUCCESS] Static assets directory exists
    dir ".next\static" /b | findstr /n "^" | head -5
) else (
    echo [ERROR] Static assets directory missing
)

echo.
echo ========================================
echo Fix preparation completed!
echo ========================================
echo.
echo Next steps:
echo 1. Start the application with: npm start
echo 2. Test locally: http://localhost:3003
echo 3. Check your website: https://desacilame.com
echo.
echo If website still looks messy:
echo - Check browser console for errors (F12)
echo - Verify web server configuration
echo - Check if all services are running
echo.
pause
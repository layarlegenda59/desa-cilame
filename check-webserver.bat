@echo off
REM Web Server Configuration Check for Desa Cilame
REM This script helps diagnose the API routing issues

echo ===============================================
echo    Web Server Configuration Check
echo ===============================================
echo.

echo Checking local backend services...
echo.

REM Check if services are running on local ports
for %%p in (3003 5000 5001 5002 5003) do (
    echo Checking port %%p...
    netstat -an | findstr ":%%p " >nul
    if errorlevel 1 (
        echo   [WARNING] Port %%p is not listening
    ) else (
        echo   [OK] Port %%p is listening
    )
)

echo.
echo Testing local health endpoints...
echo.

REM Test local health endpoints
for %%p in (5000 5001 5002 5003) do (
    echo Testing http://localhost:%%p/health...
    powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:%%p/health' -TimeoutSec 5; Write-Host '  [OK] Port %%p health check passed (' $response.StatusCode ')' } catch { Write-Host '  [ERROR] Port %%p health check failed:' $_.Exception.Message }"
)

echo.
echo Testing production API endpoints...
echo.

REM Test production endpoints
for %%e in (main umkm admin location) do (
    echo Testing https://desacilame.com/api/%%e/...
    powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://desacilame.com/api/%%e/' -TimeoutSec 10; Write-Host '  [OK] API %%e is accessible (' $response.StatusCode ')' } catch { Write-Host '  [ERROR] API %%e failed:' $_.Exception.Message }"
)

echo.
echo ===============================================
echo Configuration Summary:
echo ===============================================
echo.
echo The 404 error for https://desacilame.com/api/umkm/ indicates that
echo the web server (Nginx/Apache) is not properly configured to proxy
echo API requests to the backend services.
echo.
echo To fix this issue:
echo 1. Upload the nginx-site.conf file to your server
echo 2. Run the configure-webserver.sh script on your server as root
echo 3. Ensure all backend services are running (ports 5000-5003)
echo.
echo Files created:
echo   - nginx-site.conf (Nginx configuration)
echo   - configure-webserver.sh (Server setup script)
echo.
pause
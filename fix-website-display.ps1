# Website Display Fix Script for CloudPanel Deployment (Windows PowerShell)
# This script fixes common issues that cause websites to appear "acak-acak2an" (messy)

Write-Host "🔧 Website Display Fix for desacilame.com" -ForegroundColor Blue
Write-Host "===========================================" -ForegroundColor Blue
Write-Host ""

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor Green
}

function Write-Error-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] ERROR: $Message" -ForegroundColor Red
}

function Write-Warning-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] WARNING: $Message" -ForegroundColor Yellow
}

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Error-Log "package.json not found. Please run this script from the project root directory."
    exit 1
}

Write-Log "Starting website display fix..."

# 1. Clean build cache
Write-Log "1. Cleaning build cache..."
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }

# 2. Install dependencies
Write-Log "2. Installing/updating dependencies..."
npm install

# 3. Build the application
Write-Log "3. Building application for production..."
$env:NODE_ENV = "production"
npm run build

# 4. Create logs directory
Write-Log "4. Creating logs directory..."
if (-not (Test-Path "logs")) { New-Item -ItemType Directory -Name "logs" }

# 5. Update environment configuration
Write-Log "5. Updating environment configuration..."
$envContent = @"
NODE_ENV=production
PORT=3003
NEXT_PUBLIC_BASE_URL=https://desacilame.com
NEXT_PUBLIC_MAIN_API_URL=https://desacilame.com:5000/api
NEXT_PUBLIC_UMKM_API_URL=https://desacilame.com:5001/api
NEXT_PUBLIC_ADMIN_API_URL=https://desacilame.com:5002/api
NEXT_PUBLIC_LOCATION_API_URL=https://desacilame.com:5003/api
CORS_ORIGIN=https://desacilame.com,https://desacilame.com:3003,http://localhost:3003
FRONTEND_URL=https://desacilame.com
NEXT_PUBLIC_ASSET_PREFIX=
NEXT_PUBLIC_STATIC_URL=https://desacilame.com
"@

$envContent | Out-File -FilePath ".env.production" -Encoding UTF8

# 6. Check if Node.js processes are running on required ports
Write-Log "6. Checking for existing Node.js processes..."
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Warning-Log "Found existing Node.js processes. You may need to stop them manually."
    $nodeProcesses | ForEach-Object { Write-Host "  PID: $($_.Id) - $($_.ProcessName)" }
}

# 7. Start the application
Write-Log "7. Starting the application..."
Write-Host "You need to start the services manually with one of these commands:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1 - Using npm directly:" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "Option 2 - Using PM2 (if available on Windows):" -ForegroundColor Cyan
Write-Host "  pm2 start ecosystem.simple.config.js" -ForegroundColor White
Write-Host ""
Write-Host "Option 3 - Start individual services:" -ForegroundColor Cyan
Write-Host "  # In separate terminal windows:" -ForegroundColor Gray
Write-Host "  # Terminal 1: " -ForegroundColor Gray
Write-Host "  SET PORT=3003 && npm start" -ForegroundColor White
Write-Host "  # Terminal 2: " -ForegroundColor Gray
Write-Host "  SET PORT=5000 && node backend/server-main.js" -ForegroundColor White
Write-Host "  # Terminal 3: " -ForegroundColor Gray  
Write-Host "  SET PORT=5001 && node backend/server-umkm.js" -ForegroundColor White
Write-Host "  # Terminal 4: " -ForegroundColor Gray
Write-Host "  SET PORT=5002 && node backend/server-admin.js" -ForegroundColor White
Write-Host "  # Terminal 5: " -ForegroundColor Gray
Write-Host "  SET PORT=5003 && node backend/server-location.js" -ForegroundColor White

# 8. Verify build output
Write-Log "8. Verifying build output..."
if (Test-Path ".next/static") {
    Write-Log "✅ Static assets directory exists"
    Get-ChildItem ".next/static" | Select-Object -First 5 | ForEach-Object { Write-Host "  $($_.Name)" }
} else {
    Write-Error-Log "❌ Static assets directory missing"
}

Write-Host ""
Write-Host "🎉 Website display fix preparation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Blue
Write-Host "1. Start the application using one of the methods above"
Write-Host "2. Test locally: http://localhost:3003"
Write-Host "3. Check if website loads properly at: https://desacilame.com"
Write-Host "4. If still messy, check browser console for errors (F12)"
Write-Host ""
Write-Host "Common Issues & Solutions:" -ForegroundColor Yellow
Write-Host "• If CSS/JS not loading: Check web server static file configuration"
Write-Host "• If images broken: Verify image paths and static file serving"
Write-Host "• If API errors: Check backend services are running"
Write-Host "• If CORS errors: Verify CORS_ORIGIN includes your domain"
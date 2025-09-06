#!/bin/bash

# Website Display Fix Script for CloudPanel Deployment
# This script fixes common issues that cause websites to appear "acak-acak2an" (messy)

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Website Display Fix for desacilame.com${NC}"
echo -e "${BLUE}===========================================${NC}\n"

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    log_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

log "Starting website display fix..."

# 1. Stop all existing PM2 processes
log "1. Stopping existing services..."
pm2 delete all || echo "No existing processes to stop"

# 2. Clean build cache
log "2. Cleaning build cache..."
rm -rf .next
rm -rf out
rm -rf dist

# 3. Install dependencies (in case something is missing)
log "3. Installing/updating dependencies..."
npm install

# 4. Build the application with production configuration
log "4. Building application for production..."
NODE_ENV=production npm run build

# 5. Create logs directory
log "5. Creating logs directory..."
mkdir -p logs

# 6. Update environment configuration
log "6. Updating environment configuration..."
cat > .env.production << EOF
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
EOF

# 7. Start services with environment variables
log "7. Starting services with corrected configuration..."
pm2 start ecosystem.simple.config.js --env production
pm2 save

# 8. Wait for services to initialize
log "8. Waiting for services to initialize..."
sleep 15

# 9. Check service status
log "9. Checking service status..."
pm2 status

# 10. Test local connectivity
log "10. Testing local connectivity..."
if command -v curl >/dev/null 2>&1; then
    echo "Testing frontend (port 3003):"
    curl -I http://localhost:3003 || echo "Frontend test failed"
    
    echo "Testing main backend (port 5000):"
    curl -I http://localhost:5000/health || echo "Main backend test failed"
else
    log_warning "curl not available, skipping connectivity tests"
fi

# 11. Verify static assets
log "11. Verifying static assets..."
if [ -d ".next/static" ]; then
    log "✅ Static assets directory exists"
    ls -la .next/static/ | head -5
else
    log_error "❌ Static assets directory missing"
fi

echo -e "\n${GREEN}🎉 Website display fix completed!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Check if website loads properly at: https://desacilame.com"
echo -e "2. If still messy, check browser console for errors (F12)"
echo -e "3. Verify your web server (Nginx/Apache) configuration"
echo -e "4. Check PM2 logs: pm2 logs"

echo -e "\n${YELLOW}Common Issues & Solutions:${NC}"
echo -e "• If CSS/JS not loading: Check web server static file configuration"
echo -e "• If images broken: Verify image paths and static file serving"
echo -e "• If API errors: Check backend services with: curl http://localhost:5000/health"
echo -e "• If CORS errors: Verify CORS_ORIGIN includes your domain"

echo -e "\n${BLUE}Web Server Configuration Needed:${NC}"
echo -e "Make sure your web server (Nginx/Apache) proxies to port 3003 and serves static files correctly."
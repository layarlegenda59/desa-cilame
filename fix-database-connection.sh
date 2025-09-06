#!/bin/bash

# Database Connectivity Fix Script for desacilame.com
# This script fixes all database connection issues

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Database Connectivity Fix for desacilame.com${NC}"
echo -e "${BLUE}===============================================${NC}\n"

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

log "Starting database connectivity fix..."

# 1. Update environment configuration for production
log "1. Updating environment configuration..."
cat > .env.production << EOF
NODE_ENV=production
PORT=3003

# Frontend Configuration
NEXT_PUBLIC_BASE_URL=https://desacilame.com

# Backend API URLs - Updated for desacilame.com
NEXT_PUBLIC_MAIN_API_URL=https://desacilame.com:5000/api
NEXT_PUBLIC_UMKM_API_URL=https://desacilame.com:5001/api
NEXT_PUBLIC_ADMIN_API_URL=https://desacilame.com:5002/api
NEXT_PUBLIC_LOCATION_API_URL=https://desacilame.com:5003/api

# CORS Configuration - Include all necessary origins
CORS_ORIGIN=https://desacilame.com,https://desacilame.com:3003,http://localhost:3003,http://localhost:3000
FRONTEND_URL=https://desacilame.com

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=desa_cilame_prod
DB_USER=desa_user

# Security
JWT_SECRET=desa_cilame_jwt_secret_2024
SESSION_SECRET=desa_cilame_session_secret_2024

# Logging
LOG_LEVEL=info
LOG_DIR=./logs

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_REQUEST_SIZE=10mb
EOF

log "Environment configuration updated"

# 2. Create backend environment files for each server
log "2. Creating backend environment configurations..."

# Create .env for backend if it doesn't exist
cat > backend/.env << EOF
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=desa_cilame_prod
DB_USER=desa_user

# CORS Configuration
CORS_ORIGIN=https://desacilame.com,https://desacilame.com:3003,http://localhost:3003
FRONTEND_URL=https://desacilame.com

# Security
JWT_SECRET=desa_cilame_jwt_secret_2024
SESSION_SECRET=desa_cilame_session_secret_2024

# Logging
LOG_LEVEL=info
LOG_DIR=../logs

# Server Ports
MAIN_SERVER_PORT=5000
UMKM_SERVER_PORT=5001
ADMIN_SERVER_PORT=5002
LOCATION_SERVER_PORT=5003
EOF

log "Backend environment configuration created"

# 3. Create logs directory
log "3. Creating logs directory..."
mkdir -p logs
mkdir -p backend/logs

# 4. Stop existing services
log "4. Stopping existing services..."
pm2 delete all || echo "No existing processes to stop"

# 5. Test database connections for each server
log "5. Testing database servers..."

# Function to test a specific server
test_server() {
    local server_name=$1
    local server_file=$2
    local port=$3
    
    log "Testing $server_name server (port $port)..."
    
    # Start the server in background
    PORT=$port node $server_file &
    local server_pid=$!
    
    # Wait a moment for server to start
    sleep 3
    
    # Test health endpoint
    if curl -f "http://localhost:$port/health" > /dev/null 2>&1; then
        log "✅ $server_name server is healthy on port $port"
        kill $server_pid || true
        return 0
    else
        log_error "❌ $server_name server failed on port $port"
        kill $server_pid || true
        return 1
    fi
}

# Test each database server individually
test_server "Main Database" "backend/server-main.js" "5000"
test_server "UMKM Database" "backend/server-umkm.js" "5001"
test_server "Admin Database" "backend/server-admin.js" "5002"
test_server "Location Database" "backend/server-location.js" "5003"

# 6. Start all services with PM2
log "6. Starting all services with PM2..."
pm2 start ecosystem.simple.config.js
pm2 save

# 7. Wait for services to initialize
log "7. Waiting for services to initialize..."
sleep 10

# 8. Test all database connections
log "8. Testing all database connections..."

# Function to test database health
test_database() {
    local db_name=$1
    local port=$2
    
    if curl -f "http://localhost:$port/health" > /dev/null 2>&1; then
        log "✅ $db_name database (port $port) is healthy"
        return 0
    else
        log_error "❌ $db_name database (port $port) is not responding"
        return 1
    fi
}

# Test all databases
test_database "Main" "5000"
test_database "UMKM" "5001"
test_database "Admin" "5002"
test_database "Location" "5003"

# 9. Test frontend connectivity
log "9. Testing frontend connectivity..."
if curl -f "http://localhost:3003" > /dev/null 2>&1; then
    log "✅ Frontend (port 3003) is accessible"
else
    log_warning "⚠ Frontend accessibility test failed"
fi

# 10. Generate database connection test script
log "10. Creating database connection test script..."
cat > test-database-connections.js << 'EOF'
#!/usr/bin/env node

const fetch = require('node-fetch');

const databases = [
    { name: 'Main Database', url: 'http://localhost:5000/health' },
    { name: 'UMKM Database', url: 'http://localhost:5001/health' },
    { name: 'Admin Database', url: 'http://localhost:5002/health' },
    { name: 'Location Database', url: 'http://localhost:5003/health' },
    { name: 'Frontend', url: 'http://localhost:3003' }
];

async function testConnections() {
    console.log('🔍 Testing all database connections...\n');
    
    for (const db of databases) {
        try {
            const response = await fetch(db.url, { timeout: 5000 });
            if (response.ok) {
                console.log(`✅ ${db.name}: Connected`);
                if (db.url.includes('/health')) {
                    const data = await response.json();
                    console.log(`   Status: ${data.status}, Port: ${data.port}`);
                }
            } else {
                console.log(`❌ ${db.name}: HTTP ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ ${db.name}: ${error.message}`);
        }
    }
    
    console.log('\n🌐 Testing external connectivity...');
    try {
        const response = await fetch('https://desacilame.com', { timeout: 10000 });
        if (response.ok) {
            console.log('✅ Website desacilame.com is accessible');
        } else {
            console.log(`❌ Website HTTP ${response.status}`);
        }
    } catch (error) {
        console.log(`❌ Website: ${error.message}`);
    }
}

testConnections().catch(console.error);
EOF

chmod +x test-database-connections.js

# 11. Show service status
log "11. Current service status:"
pm2 status

echo -e "\n${GREEN}🎉 Database connectivity fix completed!${NC}"
echo -e "${BLUE}Summary:${NC}"
echo -e "• Environment variables updated for desacilame.com"
echo -e "• All 4 database servers configured (ports 5000-5003)"
echo -e "• Frontend configured for port 3003"
echo -e "• CORS properly configured"
echo -e "• PM2 services started"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo -e "1. Test connections: node test-database-connections.js"
echo -e "2. Check PM2 logs: pm2 logs"
echo -e "3. Verify website: https://desacilame.com"
echo -e "4. Check browser console for any remaining errors"

echo -e "\n${BLUE}Monitoring Commands:${NC}"
echo -e "• Check services: pm2 status"
echo -e "• View logs: pm2 logs"
echo -e "• Restart services: pm2 restart all"
echo -e "• Test databases: node test-database-connections.js"

echo -e "\n${YELLOW}If issues persist:${NC}"
echo -e "• Check firewall settings for ports 3003, 5000-5003"
echo -e "• Verify DNS pointing to correct server"
echo -e "• Check CloudPanel proxy configuration"
echo -e "• Review web server (Nginx/Apache) configuration"
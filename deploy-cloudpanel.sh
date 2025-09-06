#!/bin/bash

# CloudPanel Deployment Helper Script for Desa Cilame
# This script helps deploy the application with port 3003 configuration

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN=${1:-"your-domain.com"}  # First argument or default
APP_DIR=$(pwd)
LOG_FILE="deployment.log"

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

# Main deployment steps
main() {
    log "Starting CloudPanel deployment for Desa Cilame..."
    log "Domain: $DOMAIN"
    log "App Directory: $APP_DIR"
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Please run this script from the project root directory."
        exit 1
    fi
    
    # Install dependencies
    log "Installing dependencies..."
    npm ci --only=production
    
    # Install backend dependencies
    if [ -d "backend" ]; then
        log "Installing backend dependencies..."
        cd backend
        npm ci --only=production
        cd ..
    fi
    
    # Build the application
    log "Building Next.js application..."
    npm run build
    
    # Create environment file
    log "Creating production environment file..."
    cat > .env.production << EOF
NODE_ENV=production
PORT=3003
NEXT_PUBLIC_BASE_URL=https://$DOMAIN
NEXT_PUBLIC_MAIN_API_URL=https://$DOMAIN:5000/api
NEXT_PUBLIC_UMKM_API_URL=https://$DOMAIN:5001/api
NEXT_PUBLIC_ADMIN_API_URL=https://$DOMAIN:5002/api
NEXT_PUBLIC_LOCATION_API_URL=https://$DOMAIN:5003/api
CORS_ORIGIN=https://$DOMAIN:3003,https://$DOMAIN,http://localhost:3003
FRONTEND_URL=https://$DOMAIN:3003
EOF
    
    log "Environment file created"
    
    # Start/restart PM2 services
    log "Starting PM2 services..."
    
    # Stop existing services if running
    pm2 stop all || true
    pm2 delete all || true
    
    # Start with CloudPanel configuration
    pm2 start ecosystem.cloudpanel.config.js --env production
    
    # Save PM2 configuration
    pm2 save
    
    log "PM2 services started"
    
    # Wait for services to start
    sleep 5
    
    # Health checks
    log "Running health checks..."
    
    # Check frontend
    if curl -f "http://localhost:3003" > /dev/null 2>&1; then
        log "✓ Frontend is healthy (port 3003)"
    else
        log_warning "⚠ Frontend health check failed - this is normal during initial startup"
    fi
    
    # Check backend services
    for port in 5000 5001 5002 5003; do
        if curl -f "http://localhost:$port/health" > /dev/null 2>&1; then
            log "✓ Backend service on port $port is healthy"
        else
            log_warning "⚠ Backend service on port $port health check failed - this is normal during initial startup"
        fi
    done
    
    log "Deployment completed!"
    log "Frontend URL: http://localhost:3003"
    log "Website URL: https://$DOMAIN"
    
    echo -e "\n${GREEN}🎉 CloudPanel deployment completed!${NC}"
    echo -e "${BLUE}Frontend Port:${NC} 3003"
    echo -e "${BLUE}Backend Ports:${NC} 5000-5003"
    echo -e "${BLUE}Website URL:${NC} https://$DOMAIN"
    echo -e "${YELLOW}Monitor services with:${NC} pm2 status"
    echo -e "${YELLOW}View logs with:${NC} pm2 logs"
    echo -e "${YELLOW}Restart services with:${NC} pm2 restart all"
    
    echo -e "\n${YELLOW}Next Steps:${NC}"
    echo -e "1. Configure your web server (Nginx/Apache) to proxy to port 3003"
    echo -e "2. Update your domain DNS to point to this server"
    echo -e "3. Configure SSL certificate for HTTPS"
    echo -e "4. Test the application at https://$DOMAIN"
}

# Run main function
main "$@"
#!/bin/bash

# Desa Cilame Deployment Script
# Author: DevOps Engineer
# Description: Automated deployment script for production server

set -e  # Exit on any error

# Configuration
APP_NAME="desa-cilame"
APP_DIR="/var/www/$APP_NAME"
BACKUP_DIR="/var/backups/$APP_NAME"
GIT_REPO="https://github.com/layarlegenda59/desa-cilame.git"  # Update with your repo
BRANCH="main"
NODE_ENV="production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root for security reasons"
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
    fi
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        error "PM2 is not installed"
    fi
    
    # Check if Nginx is installed
    if ! command -v nginx &> /dev/null; then
        error "Nginx is not installed"
    fi
    
    success "All prerequisites are met"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    if [ -d "$APP_DIR" ]; then
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        sudo mkdir -p "$BACKUP_DIR"
        sudo tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" -C "$APP_DIR" .
        success "Backup created: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
        
        # Keep only last 5 backups
        sudo find "$BACKUP_DIR" -name "backup_*.tar.gz" | sort -r | tail -n +6 | sudo xargs rm -f
    else
        warning "Application directory not found, skipping backup"
    fi
}

# Clone or update repository
setup_repository() {
    log "Setting up repository..."
    
    if [ ! -d "$APP_DIR" ]; then
        log "Cloning repository..."
        sudo git clone "$GIT_REPO" "$APP_DIR"
        sudo chown -R $USER:$USER "$APP_DIR"
    else
        log "Updating repository..."
        cd "$APP_DIR"
        git fetch origin
        git reset --hard origin/$BRANCH
        git clean -fd
    fi
    
    success "Repository setup completed"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    cd "$APP_DIR"
    
    # Install frontend dependencies
    log "Installing frontend dependencies..."
    npm ci --production=false
    
    # Install backend dependencies
    log "Installing backend dependencies..."
    cd backend
    npm ci --production=false
    cd ..
    
    success "Dependencies installed"
}

# Build application
build_application() {
    log "Building application..."
    
    cd "$APP_DIR"
    
    # Build frontend
    log "Building frontend..."
    npm run build
    
    success "Application built successfully"
}

# Setup environment
setup_environment() {
    log "Setting up environment..."
    
    cd "$APP_DIR"
    
    # Copy production environment file if it doesn't exist
    if [ ! -f ".env.production" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.production
            warning "Created .env.production from .env.example. Please update it with production values."
        else
            error ".env.example not found. Cannot create production environment file."
        fi
    fi
    
    # Set correct permissions
    chmod 600 .env.production
    
    success "Environment setup completed"
}

# Setup PM2 ecosystem
setup_pm2() {
    log "Setting up PM2 ecosystem..."
    
    cd "$APP_DIR"
    
    # Create ecosystem file if it doesn't exist
    if [ ! -f "ecosystem.config.js" ]; then
        cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'desa-cilame-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/desa-cilame',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/frontend-error.log',
      out_file: '/var/log/pm2/frontend-out.log',
      log_file: '/var/log/pm2/frontend.log'
    },
    {
      name: 'desa-cilame-main-api',
      script: 'npm',
      args: 'run start:main',
      cwd: '/var/www/desa-cilame/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: '/var/log/pm2/main-api-error.log',
      out_file: '/var/log/pm2/main-api-out.log',
      log_file: '/var/log/pm2/main-api.log'
    },
    {
      name: 'desa-cilame-umkm-api',
      script: 'npm',
      args: 'run start:umkm',
      cwd: '/var/www/desa-cilame/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: '/var/log/pm2/umkm-api-error.log',
      out_file: '/var/log/pm2/umkm-api-out.log',
      log_file: '/var/log/pm2/umkm-api.log'
    },
    {
      name: 'desa-cilame-admin-api',
      script: 'npm',
      args: 'run start:admin',
      cwd: '/var/www/desa-cilame/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5002
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: '/var/log/pm2/admin-api-error.log',
      out_file: '/var/log/pm2/admin-api-out.log',
      log_file: '/var/log/pm2/admin-api.log'
    },
    {
      name: 'desa-cilame-location-api',
      script: 'npm',
      args: 'run start:location',
      cwd: '/var/www/desa-cilame/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5003
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: '/var/log/pm2/location-api-error.log',
      out_file: '/var/log/pm2/location-api-out.log',
      log_file: '/var/log/pm2/location-api.log'
    }
  ]
};
EOF
    fi
    
    # Create log directory
    sudo mkdir -p /var/log/pm2
    sudo chown -R $USER:$USER /var/log/pm2
    
    success "PM2 ecosystem setup completed"
}

# Deploy application
deploy_application() {
    log "Deploying application..."
    
    cd "$APP_DIR"
    
    # Stop existing processes
    pm2 delete all 2>/dev/null || true
    
    # Start applications
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    pm2 save
    
    success "Application deployed successfully"
}

# Setup Nginx
setup_nginx() {
    log "Setting up Nginx..."
    
    cd "$APP_DIR"
    
    if [ -f "nginx/nginx.conf" ]; then
        # Copy Nginx configuration
        sudo cp nginx/nginx.conf /etc/nginx/sites-available/desacilame.com
        
        # Enable site
        sudo ln -sf /etc/nginx/sites-available/desacilame.com /etc/nginx/sites-enabled/
        
        # Remove default site
        sudo rm -f /etc/nginx/sites-enabled/default
        
        # Test Nginx configuration
        if sudo nginx -t; then
            sudo systemctl reload nginx
            success "Nginx configuration updated"
        else
            error "Nginx configuration test failed"
        fi
    else
        warning "Nginx configuration file not found"
    fi
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Wait for services to start
    sleep 10
    
    # Check PM2 processes
    if pm2 list | grep -q "online"; then
        success "PM2 processes are running"
    else
        error "Some PM2 processes are not running"
    fi
    
    # Check if ports are listening
    for port in 3000 5000 5001 5002 5003; do
        if netstat -tlnp | grep -q ":$port "; then
            success "Port $port is listening"
        else
            warning "Port $port is not listening"
        fi
    done
    
    # Check Nginx status
    if sudo systemctl is-active --quiet nginx; then
        success "Nginx is running"
    else
        error "Nginx is not running"
    fi
}

# Rollback function
rollback() {
    log "Rolling back to previous version..."
    
    LATEST_BACKUP=$(sudo find "$BACKUP_DIR" -name "backup_*.tar.gz" | sort -r | head -n 1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        log "Restoring from backup: $LATEST_BACKUP"
        
        # Stop current processes
        pm2 delete all 2>/dev/null || true
        
        # Restore backup
        sudo rm -rf "$APP_DIR"
        sudo mkdir -p "$APP_DIR"
        sudo tar -xzf "$LATEST_BACKUP" -C "$APP_DIR"
        sudo chown -R $USER:$USER "$APP_DIR"
        
        # Restart services
        cd "$APP_DIR"
        pm2 start ecosystem.config.js
        pm2 save
        
        success "Rollback completed"
    else
        error "No backup found for rollback"
    fi
}

# Main deployment function
main() {
    log "Starting deployment of $APP_NAME..."
    
    check_root
    check_prerequisites
    create_backup
    setup_repository
    install_dependencies
    build_application
    setup_environment
    setup_pm2
    deploy_application
    setup_nginx
    health_check
    
    success "Deployment completed successfully!"
    log "Application is now running at https://desacilame.com"
    log "Admin panel: https://desacilame.com/admin"
    log "To monitor: pm2 monit"
    log "To view logs: pm2 logs"
}

# Handle script arguments
case "${1:-}" in
    "rollback")
        rollback
        ;;
    "health")
        health_check
        ;;
    "")
        main
        ;;
    *)
        echo "Usage: $0 [rollback|health]"
        echo "  rollback - Rollback to previous version"
        echo "  health   - Perform health check only"
        echo "  (no args) - Full deployment"
        exit 1
        ;;
esac
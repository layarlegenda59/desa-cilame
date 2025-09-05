#!/bin/bash

# Hostinger Cloud Panel Deployment Script for Desa Cilame Website
# Author: Deployment Engineer
# Version: 1.0
# Description: Automated deployment script for Hostinger VPS with Cloud Panel

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration variables
APP_NAME="desa-cilame"
APP_DIR="/home/desa-cilame/htdocs"
BACKUP_DIR="/home/desa-cilame/backups"
LOG_FILE="/home/desa-cilame/logs/deployment.log"
DOMAIN="your-domain.com"  # Replace with your actual domain
DB_NAME="desa_cilame_prod"
DB_USER="desa_user"
DB_PASSWORD="$(openssl rand -base64 32)"  # Generate random password
NODE_VERSION="18"

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to create backup
create_backup() {
    log "Creating backup..."
    if [ -d "$APP_DIR" ]; then
        BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$(dirname $APP_DIR)" "$(basename $APP_DIR)"
        log "Backup created: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
    fi
}

# Function to install Node.js via NodeSource
install_nodejs() {
    log "Installing Node.js $NODE_VERSION..."
    
    # Remove existing Node.js
    sudo apt-get remove -y nodejs npm || true
    
    # Install NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    
    # Install Node.js
    sudo apt-get install -y nodejs
    
    # Verify installation
    node_version=$(node --version)
    npm_version=$(npm --version)
    log "Node.js installed: $node_version"
    log "npm installed: $npm_version"
}

# Function to install PM2
install_pm2() {
    log "Installing PM2..."
    sudo npm install -g pm2
    
    # Setup PM2 startup
    sudo pm2 startup systemd -u desa-cilame --hp /home/desa-cilame
    log "PM2 installed and configured"
}

# Function to setup MySQL database
setup_database() {
    log "Setting up MySQL database..."
    
    # Create database and user
    mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF
    
    log "Database $DB_NAME created with user $DB_USER"
    echo "Database password: $DB_PASSWORD" >> "$LOG_FILE"
}

# Function to setup application directory
setup_app_directory() {
    log "Setting up application directory..."
    
    # Create necessary directories
    sudo mkdir -p "$APP_DIR"
    sudo mkdir -p "$BACKUP_DIR"
    sudo mkdir -p "/home/desa-cilame/logs"
    sudo mkdir -p "/home/desa-cilame/uploads"
    sudo mkdir -p "/home/desa-cilame/ssl"
    
    # Set ownership
    sudo chown -R desa-cilame:desa-cilame "/home/desa-cilame"
    
    log "Application directories created"
}

# Function to deploy application
deploy_application() {
    log "Deploying application..."
    
    cd "$APP_DIR"
    
    # Copy application files (assuming they're already uploaded)
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Please upload your application files first."
        exit 1
    fi
    
    # Install dependencies
    log "Installing dependencies..."
    npm ci --only=production
    
    # Install backend dependencies
    if [ -d "backend" ]; then
        cd backend
        npm ci --only=production
        cd ..
    fi
    
    # Build Next.js application
    log "Building Next.js application..."
    npm run build
    
    # Run database migration
    if [ -f "backend/scripts/migrate-to-mysql.js" ]; then
        log "Running database migration..."
        node backend/scripts/migrate-to-mysql.js
    fi
    
    log "Application deployed successfully"
}

# Function to setup environment variables
setup_environment() {
    log "Setting up environment variables..."
    
    cat > "$APP_DIR/.env.production" << EOF
# Production Environment Configuration
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# Server Configuration
PORT=3000
MAIN_SERVER_PORT=5000
UMKM_SERVER_PORT=5001
ADMIN_SERVER_PORT=5002
LOCATION_SERVER_PORT=5003

# API URLs
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
NEXT_PUBLIC_MAIN_API_URL=https://$DOMAIN/api/main
NEXT_PUBLIC_UMKM_API_URL=https://$DOMAIN/api/umkm
NEXT_PUBLIC_ADMIN_API_URL=https://$DOMAIN/api/admin
NEXT_PUBLIC_LOCATION_API_URL=https://$DOMAIN/api/location

# Security
JWT_SECRET=$(openssl rand -base64 64)
SESSION_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)

# CORS
CORS_ORIGIN=https://$DOMAIN

# File Upload
UPLOAD_DIR=/home/desa-cilame/uploads
MAX_FILE_SIZE=50MB

# SSL
SSL_CERT_PATH=/home/desa-cilame/ssl/fullchain.pem
SSL_KEY_PATH=/home/desa-cilame/ssl/privkey.pem

# Logging
LOG_LEVEL=info
LOG_DIR=/home/desa-cilame/logs

# Cache
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600

# Email (configure with your SMTP settings)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring
MONITORING_ENABLED=true
HEALTH_CHECK_INTERVAL=30000
EOF
    
    log "Environment variables configured"
}

# Function to setup PM2 ecosystem
setup_pm2_ecosystem() {
    log "Setting up PM2 ecosystem..."
    
    cat > "$APP_DIR/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [
    {
      name: 'desa-cilame-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/desa-cilame/htdocs',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/home/desa-cilame/logs/frontend-error.log',
      out_file: '/home/desa-cilame/logs/frontend-out.log',
      log_file: '/home/desa-cilame/logs/frontend.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    },
    {
      name: 'desa-cilame-main-db',
      script: 'backend/server-main.js',
      cwd: '/home/desa-cilame/htdocs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/home/desa-cilame/logs/main-db-error.log',
      out_file: '/home/desa-cilame/logs/main-db-out.log',
      log_file: '/home/desa-cilame/logs/main-db.log',
      time: true,
      max_memory_restart: '512M'
    },
    {
      name: 'desa-cilame-umkm-db',
      script: 'backend/server-umkm.js',
      cwd: '/home/desa-cilame/htdocs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      error_file: '/home/desa-cilame/logs/umkm-db-error.log',
      out_file: '/home/desa-cilame/logs/umkm-db-out.log',
      log_file: '/home/desa-cilame/logs/umkm-db.log',
      time: true,
      max_memory_restart: '512M'
    },
    {
      name: 'desa-cilame-admin-db',
      script: 'backend/server-admin.js',
      cwd: '/home/desa-cilame/htdocs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5002
      },
      error_file: '/home/desa-cilame/logs/admin-db-error.log',
      out_file: '/home/desa-cilame/logs/admin-db-out.log',
      log_file: '/home/desa-cilame/logs/admin-db.log',
      time: true,
      max_memory_restart: '512M'
    },
    {
      name: 'desa-cilame-location-db',
      script: 'backend/server-location.js',
      cwd: '/home/desa-cilame/htdocs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5003
      },
      error_file: '/home/desa-cilame/logs/location-db-error.log',
      out_file: '/home/desa-cilame/logs/location-db-out.log',
      log_file: '/home/desa-cilame/logs/location-db.log',
      time: true,
      max_memory_restart: '512M'
    }
  ]
};
EOF
    
    log "PM2 ecosystem configured"
}

# Function to setup Nginx configuration
setup_nginx() {
    log "Setting up Nginx configuration..."
    
    # Create Nginx site configuration
    sudo tee "/etc/nginx/sites-available/$APP_NAME" > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL Configuration
    ssl_certificate /home/desa-cilame/ssl/fullchain.pem;
    ssl_certificate_key /home/desa-cilame/ssl/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozTLS:10m;
    ssl_session_tickets off;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Client max body size
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Static files
    location /uploads/ {
        alias /home/desa-cilame/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # API routes
    location /api/main/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api/umkm/ {
        proxy_pass http://localhost:5001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api/admin/ {
        proxy_pass http://localhost:5002/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api/location/ {
        proxy_pass http://localhost:5003/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Frontend application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
}
EOF
    
    # Enable the site
    sudo ln -sf "/etc/nginx/sites-available/$APP_NAME" "/etc/nginx/sites-enabled/"
    
    # Test Nginx configuration
    sudo nginx -t
    
    log "Nginx configuration completed"
}

# Function to setup SSL with Let's Encrypt
setup_ssl() {
    log "Setting up SSL certificate..."
    
    # Install Certbot if not already installed
    if ! command_exists certbot; then
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
    fi
    
    # Obtain SSL certificate
    sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN"
    
    # Setup auto-renewal
    sudo systemctl enable certbot.timer
    sudo systemctl start certbot.timer
    
    log "SSL certificate configured"
}

# Function to setup firewall
setup_firewall() {
    log "Configuring firewall..."
    
    # Enable UFW if not already enabled
    sudo ufw --force enable
    
    # Allow SSH
    sudo ufw allow ssh
    
    # Allow HTTP and HTTPS
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    
    # Allow application ports (only from localhost)
    sudo ufw allow from 127.0.0.1 to any port 3000
    sudo ufw allow from 127.0.0.1 to any port 5000
    sudo ufw allow from 127.0.0.1 to any port 5001
    sudo ufw allow from 127.0.0.1 to any port 5002
    sudo ufw allow from 127.0.0.1 to any port 5003
    
    # Allow MySQL (only from localhost)
    sudo ufw allow from 127.0.0.1 to any port 3306
    
    log "Firewall configured"
}

# Function to start services
start_services() {
    log "Starting services..."
    
    cd "$APP_DIR"
    
    # Start PM2 applications
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    pm2 save
    
    # Reload Nginx
    sudo systemctl reload nginx
    
    log "Services started"
}

# Function to run health checks
run_health_checks() {
    log "Running health checks..."
    
    # Wait for services to start
    sleep 10
    
    # Check frontend
    if curl -f "http://localhost:3000" > /dev/null 2>&1; then
        log "✓ Frontend is healthy"
    else
        log_error "✗ Frontend health check failed"
    fi
    
    # Check backend services
    for port in 5000 5001 5002 5003; do
        if curl -f "http://localhost:$port/health" > /dev/null 2>&1; then
            log "✓ Backend service on port $port is healthy"
        else
            log_error "✗ Backend service on port $port health check failed"
        fi
    done
    
    # Check website
    if curl -f "https://$DOMAIN" > /dev/null 2>&1; then
        log "✓ Website is accessible"
    else
        log_warning "⚠ Website accessibility check failed (might be normal if DNS is not propagated yet)"
    fi
    
    log "Health checks completed"
}

# Function to setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Create monitoring script
    cat > "/home/desa-cilame/monitor.sh" << 'EOF'
#!/bin/bash

# Simple monitoring script for Desa Cilame
LOG_FILE="/home/desa-cilame/logs/monitor.log"
DATE=$(date +'%Y-%m-%d %H:%M:%S')

# Function to check service
check_service() {
    local service_name=$1
    local url=$2
    
    if curl -f "$url" > /dev/null 2>&1; then
        echo "[$DATE] ✓ $service_name is healthy" >> "$LOG_FILE"
        return 0
    else
        echo "[$DATE] ✗ $service_name is down" >> "$LOG_FILE"
        # Restart the service
        pm2 restart "$service_name" >> "$LOG_FILE" 2>&1
        return 1
    fi
}

# Check all services
check_service "desa-cilame-frontend" "http://localhost:3000"
check_service "desa-cilame-main-db" "http://localhost:5000/health"
check_service "desa-cilame-umkm-db" "http://localhost:5001/health"
check_service "desa-cilame-admin-db" "http://localhost:5002/health"
check_service "desa-cilame-location-db" "http://localhost:5003/health"

# Check disk space
DISK_USAGE=$(df /home/desa-cilame | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    echo "[$DATE] ⚠ Disk usage is high: ${DISK_USAGE}%" >> "$LOG_FILE"
fi

# Check memory usage
MEM_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ "$MEM_USAGE" -gt 80 ]; then
    echo "[$DATE] ⚠ Memory usage is high: ${MEM_USAGE}%" >> "$LOG_FILE"
fi
EOF
    
    chmod +x "/home/desa-cilame/monitor.sh"
    
    # Add to crontab
    (crontab -l 2>/dev/null; echo "*/5 * * * * /home/desa-cilame/monitor.sh") | crontab -
    
    log "Monitoring configured"
}

# Main deployment function
main() {
    log "Starting Hostinger deployment for Desa Cilame website..."
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        log_error "Please do not run this script as root. Run as the desa-cilame user."
        exit 1
    fi
    
    # Update system packages
    log "Updating system packages..."
    sudo apt-get update && sudo apt-get upgrade -y
    
    # Install required packages
    log "Installing required packages..."
    sudo apt-get install -y curl wget git unzip nginx mysql-server redis-server ufw fail2ban
    
    # Create backup
    create_backup
    
    # Setup application directory
    setup_app_directory
    
    # Install Node.js
    if ! command_exists node; then
        install_nodejs
    else
        log "Node.js already installed: $(node --version)"
    fi
    
    # Install PM2
    if ! command_exists pm2; then
        install_pm2
    else
        log "PM2 already installed"
    fi
    
    # Setup database
    setup_database
    
    # Setup environment
    setup_environment
    
    # Deploy application
    deploy_application
    
    # Setup PM2 ecosystem
    setup_pm2_ecosystem
    
    # Setup Nginx
    setup_nginx
    
    # Setup SSL
    setup_ssl
    
    # Setup firewall
    setup_firewall
    
    # Start services
    start_services
    
    # Setup monitoring
    setup_monitoring
    
    # Run health checks
    run_health_checks
    
    log "Deployment completed successfully!"
    log "Website URL: https://$DOMAIN"
    log "Admin Panel: https://$DOMAIN/admin"
    log "Database password saved in: $LOG_FILE"
    
    echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${BLUE}Website URL:${NC} https://$DOMAIN"
    echo -e "${BLUE}Admin Panel:${NC} https://$DOMAIN/admin"
    echo -e "${YELLOW}Please check the logs at:${NC} $LOG_FILE"
    echo -e "${YELLOW}Monitor services with:${NC} pm2 status"
    echo -e "${YELLOW}View logs with:${NC} pm2 logs"
}

# Run main function
main "$@"
#!/bin/bash

# Hostinger Cloud Panel Deployment Script
# Website Desa Cilame Deployment Automation

set -e

echo "🚀 Starting Hostinger Cloud Panel Deployment..."

# Configuration
APP_NAME="desa-cilame"
DOMAIN="your-domain.com"
DB_NAME="desa_cilame_prod"
NODE_VERSION="18"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Environment Setup
print_status "Setting up environment..."
cp .env.production .env
print_success "Environment configuration copied"

# Step 2: Install Dependencies
print_status "Installing dependencies..."
npm ci --production
print_success "Dependencies installed"

# Step 3: Build Application
print_status "Building Next.js application..."
npm run build
print_success "Application built successfully"

# Step 4: Database Setup
print_status "Setting up production database..."
if [ "$DB_TYPE" = "mysql" ]; then
    print_status "Configuring MySQL database..."
    # Create database if not exists
    mysql -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
    
    # Run database migrations
    node backend/scripts/migrate-to-mysql.js
    print_success "MySQL database configured"
else
    print_warning "Using SQLite for production (not recommended)"
fi

# Step 5: Backend Services Setup
print_status "Setting up backend services..."

# Create systemd service files for each backend service
cat > /etc/systemd/system/desa-cilame-main.service << EOF
[Unit]
Description=Desa Cilame Main Database Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/html/$APP_NAME/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server-main.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/desa-cilame-umkm.service << EOF
[Unit]
Description=Desa Cilame UMKM Database Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/html/$APP_NAME/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server-umkm.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/desa-cilame-admin.service << EOF
[Unit]
Description=Desa Cilame Admin Database Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/html/$APP_NAME/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server-admin.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/desa-cilame-location.service << EOF
[Unit]
Description=Desa Cilame Location Database Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/html/$APP_NAME/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server-location.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start services
systemctl daemon-reload
systemctl enable desa-cilame-main
systemctl enable desa-cilame-umkm
systemctl enable desa-cilame-admin
systemctl enable desa-cilame-location

systemctl start desa-cilame-main
systemctl start desa-cilame-umkm
systemctl start desa-cilame-admin
systemctl start desa-cilame-location

print_success "Backend services configured and started"

# Step 6: Nginx Configuration
print_status "Configuring Nginx..."
cat > /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/ssl/certs/$DOMAIN.crt;
    ssl_certificate_key /etc/ssl/private/$DOMAIN.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    root /var/www/html/$APP_NAME;
    index index.html index.htm;

    # Frontend (Next.js)
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

    # Backend API Routes
    location /api/main {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/umkm {
        proxy_pass http://localhost:5001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/admin {
        proxy_pass http://localhost:5002;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/location {
        proxy_pass http://localhost:5003;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static files
    location /uploads {
        alias /var/www/html/$APP_NAME/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

print_success "Nginx configured successfully"

# Step 7: PM2 Setup for Frontend
print_status "Setting up PM2 for frontend..."
npm install -g pm2

cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/html/$APP_NAME',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/pm2/$APP_NAME-error.log',
    out_file: '/var/log/pm2/$APP_NAME-out.log',
    log_file: '/var/log/pm2/$APP_NAME-combined.log',
    time: true
  }]
};
EOF

pm2 start ecosystem.config.js
pm2 save
pm2 startup

print_success "PM2 configured for frontend"

# Step 8: SSL Certificate Setup
print_status "Setting up SSL certificate..."
if command -v certbot &> /dev/null; then
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    print_success "SSL certificate installed via Let's Encrypt"
else
    print_warning "Certbot not found. Please install SSL certificate manually"
fi

# Step 9: Firewall Configuration
print_status "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 5000:5003/tcp
ufw --force enable

print_success "Firewall configured"

# Step 10: Health Check
print_status "Running health checks..."
sleep 10

# Check services
for service in desa-cilame-main desa-cilame-umkm desa-cilame-admin desa-cilame-location; do
    if systemctl is-active --quiet $service; then
        print_success "$service is running"
    else
        print_error "$service is not running"
    fi
done

# Check frontend
if pm2 list | grep -q "$APP_NAME-frontend.*online"; then
    print_success "Frontend is running"
else
    print_error "Frontend is not running"
fi

# Check website accessibility
if curl -f -s https://$DOMAIN > /dev/null; then
    print_success "Website is accessible at https://$DOMAIN"
else
    print_warning "Website may not be accessible yet. Please check DNS and SSL configuration."
fi

print_success "🎉 Deployment completed successfully!"
print_status "Website URL: https://$DOMAIN"
print_status "Admin Panel: https://$DOMAIN/admin"
print_status "API Health Checks:"
print_status "  - Main API: https://$DOMAIN/api/main/health"
print_status "  - UMKM API: https://$DOMAIN/api/umkm/health"
print_status "  - Admin API: https://$DOMAIN/api/admin/health"
print_status "  - Location API: https://$DOMAIN/api/location/health"

echo ""
print_status "📋 Post-deployment checklist:"
echo "1. Update DNS records to point to your server IP"
echo "2. Configure database credentials in .env.production"
echo "3. Upload SSL certificates if not using Let's Encrypt"
echo "4. Test all functionality"
echo "5. Set up monitoring and backups"
echo ""
print_success "Deployment script completed!"
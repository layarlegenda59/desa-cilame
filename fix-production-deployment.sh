#!/bin/bash

# Script untuk memperbaiki deployment production dan masalah UMKM API
# Mengatasi error 500 pada https://desacilame.com/api/umkm

set -e  # Exit on any error

echo "🚀 Memperbaiki deployment production untuk UMKM API..."
echo "=" | tr -d '\n' | head -c 60 && echo

# Fungsi untuk log dengan timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Fungsi untuk check service status
check_service() {
    local service_name=$1
    local port=$2
    
    log "Checking $service_name on port $port..."
    
    if curl -f -s "http://localhost:$port/health" > /dev/null 2>&1; then
        log "✅ $service_name is running on port $port"
        return 0
    else
        log "❌ $service_name is not responding on port $port"
        return 1
    fi
}

# 1. Backup current configuration
log "📦 Creating backup of current configuration..."
BACKUP_DIR="/tmp/desa-cilame-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup important files
if [ -f "/etc/nginx/sites-available/desacilame.com" ]; then
    cp "/etc/nginx/sites-available/desacilame.com" "$BACKUP_DIR/"
fi

if [ -f "/var/www/desa-cilame/ecosystem.config.js" ]; then
    cp "/var/www/desa-cilame/ecosystem.config.js" "$BACKUP_DIR/"
fi

log "✅ Backup created at $BACKUP_DIR"

# 2. Update Nginx configuration for production
log "🌐 Updating Nginx configuration..."

# Create optimized Nginx config for production
cat > "/etc/nginx/sites-available/desacilame.com" << 'EOF'
server {
    listen 80;
    listen 443 ssl http2;
    server_name desacilame.com www.desacilame.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/desacilame.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/desacilame.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Client max body size
    client_max_body_size 50M;

    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # API Routes - Reverse proxy to backend services
    location /api/umkm {
        proxy_pass http://127.0.0.1:5001/api/umkm;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        
        # Error handling
        proxy_intercept_errors on;
        error_page 502 503 504 = @backend_error;
    }

    location /api/main {
        proxy_pass http://127.0.0.1:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
    }

    location /api/admin {
        proxy_pass http://127.0.0.1:5002/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
    }

    location /api/location {
        proxy_pass http://127.0.0.1:5003/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
    }

    # Fallback API route
    location /api {
        proxy_pass http://127.0.0.1:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
    }

    # Frontend application
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
    }

    # Error page for backend errors
    location @backend_error {
        return 502 '{"error":"Backend service temporarily unavailable","timestamp":"'$(date -Iseconds)'"}';
        add_header Content-Type application/json;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://127.0.0.1:3000;
    }

    # Security: Block access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

log "✅ Nginx configuration updated"

# 3. Test Nginx configuration
log "🧪 Testing Nginx configuration..."
if nginx -t; then
    log "✅ Nginx configuration is valid"
else
    log "❌ Nginx configuration has errors"
    exit 1
fi

# 4. Update ecosystem.config.js for production
log "⚙️ Updating PM2 ecosystem configuration..."

cat > "/var/www/desa-cilame/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [
    {
      name: 'desa-cilame-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/desa-cilame',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/desa-cilame/frontend-error.log',
      out_file: '/var/log/desa-cilame/frontend-out.log',
      log_file: '/var/log/desa-cilame/frontend.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    },
    {
      name: 'desa-cilame-backend-main',
      script: 'server-main.js',
      cwd: '/var/www/desa-cilame/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/var/log/desa-cilame/backend-main-error.log',
      out_file: '/var/log/desa-cilame/backend-main-out.log',
      log_file: '/var/log/desa-cilame/backend-main.log',
      time: true,
      max_memory_restart: '512M'
    },
    {
      name: 'desa-cilame-backend-umkm',
      script: 'server-umkm.js',
      cwd: '/var/www/desa-cilame/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      error_file: '/var/log/desa-cilame/backend-umkm-error.log',
      out_file: '/var/log/desa-cilame/backend-umkm-out.log',
      log_file: '/var/log/desa-cilame/backend-umkm.log',
      time: true,
      max_memory_restart: '512M'
    },
    {
      name: 'desa-cilame-backend-admin',
      script: 'server-admin.js',
      cwd: '/var/www/desa-cilame/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5002
      },
      error_file: '/var/log/desa-cilame/backend-admin-error.log',
      out_file: '/var/log/desa-cilame/backend-admin-out.log',
      log_file: '/var/log/desa-cilame/backend-admin.log',
      time: true,
      max_memory_restart: '512M'
    },
    {
      name: 'desa-cilame-backend-location',
      script: 'server-location.js',
      cwd: '/var/www/desa-cilame/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5003
      },
      error_file: '/var/log/desa-cilame/backend-location-error.log',
      out_file: '/var/log/desa-cilame/backend-location-out.log',
      log_file: '/var/log/desa-cilame/backend-location.log',
      time: true,
      max_memory_restart: '512M'
    }
  ]
};
EOF

log "✅ PM2 ecosystem configuration updated"

# 5. Create log directory
log "📁 Creating log directory..."
mkdir -p /var/log/desa-cilame
chown -R www-data:www-data /var/log/desa-cilame

# 6. Restart services
log "🔄 Restarting services..."

# Stop all PM2 processes
pm2 stop all || true
pm2 delete all || true

# Start services with new configuration
cd /var/www/desa-cilame
pm2 start ecosystem.config.js

# Wait for services to start
sleep 10

# 7. Check service status
log "🔍 Checking service status..."
check_service "Main Backend" 5000
check_service "UMKM Backend" 5001
check_service "Admin Backend" 5002
check_service "Location Backend" 5003
check_service "Frontend" 3000

# 8. Reload Nginx
log "🌐 Reloading Nginx..."
systemctl reload nginx

# 9. Test endpoints
log "🧪 Testing production endpoints..."

sleep 5  # Wait for services to be fully ready

# Test UMKM API specifically
log "Testing UMKM API..."
if curl -f -s "https://desacilame.com/api/umkm" > /dev/null; then
    log "✅ UMKM API is working"
else
    log "❌ UMKM API still not working"
    log "Checking direct backend connection..."
    if curl -f -s "http://localhost:5001/api/umkm" > /dev/null; then
        log "✅ Direct backend connection works - issue is with Nginx proxy"
    else
        log "❌ Direct backend connection also fails"
    fi
fi

# 10. Show status
log "📊 Final status check..."
pm2 status

log "✅ Production deployment fix completed!"
log "📋 Next steps:"
log "   1. Monitor logs: pm2 logs"
log "   2. Check Nginx logs: tail -f /var/log/nginx/error.log"
log "   3. Test UMKM API: curl https://desacilame.com/api/umkm"
log "   4. Monitor application: pm2 monit"

log "💾 Backup location: $BACKUP_DIR"
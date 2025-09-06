#!/bin/bash

# Web Server Configuration Script for Desa Cilame
# This script configures Nginx to properly proxy API requests

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DOMAIN="desacilame.com"
SITE_NAME="desacilame"
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"
NGINX_CONF_FILE="$NGINX_AVAILABLE/$SITE_NAME"

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "This script must be run as root (use sudo)"
    exit 1
fi

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
    log "Installing Nginx..."
    apt-get update
    apt-get install -y nginx
else
    log "Nginx is already installed"
fi

# Backup existing configuration
if [ -f "$NGINX_CONF_FILE" ]; then
    log "Backing up existing configuration..."
    cp "$NGINX_CONF_FILE" "$NGINX_CONF_FILE.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Copy our configuration
log "Installing Nginx configuration..."
cp nginx-site.conf "$NGINX_CONF_FILE"

# Enable the site
log "Enabling site..."
ln -sf "$NGINX_CONF_FILE" "$NGINX_ENABLED/$SITE_NAME"

# Remove default site if it exists
if [ -f "$NGINX_ENABLED/default" ]; then
    log "Removing default site..."
    rm -f "$NGINX_ENABLED/default"
fi

# Test configuration
log "Testing Nginx configuration..."
if nginx -t; then
    log "✓ Nginx configuration is valid"
else
    log_error "✗ Nginx configuration test failed"
    exit 1
fi

# Check if services are running
log "Checking backend services..."
for port in 3003 5000 5001 5002 5003; do
    if netstat -tulpn | grep -q ":$port "; then
        log "✓ Service on port $port is running"
    else
        log_warning "⚠ Service on port $port is not running"
    fi
done

# Reload Nginx
log "Reloading Nginx..."
systemctl reload nginx

# Check Nginx status
if systemctl is-active --quiet nginx; then
    log "✓ Nginx is running"
else
    log_error "✗ Nginx is not running"
    systemctl status nginx
    exit 1
fi

log "✅ Web server configuration completed successfully!"
log ""
log "API endpoints should now be accessible:"
log "  - https://$DOMAIN/api/main/"
log "  - https://$DOMAIN/api/umkm/"
log "  - https://$DOMAIN/api/admin/"
log "  - https://$DOMAIN/api/location/"
log ""
log "Health checks:"
log "  - https://$DOMAIN/health/main"
log "  - https://$DOMAIN/health/umkm"
log "  - https://$DOMAIN/health/admin"
log "  - https://$DOMAIN/health/location"
log ""
log "Frontend: https://$DOMAIN/"

# Test the configuration
log "Testing API endpoints..."
sleep 2

for endpoint in "main" "umkm" "admin" "location"; do
    if curl -f -s "https://$DOMAIN/health/$endpoint" > /dev/null; then
        log "✓ API $endpoint is accessible"
    else
        log_warning "⚠ API $endpoint test failed (backend might not be running)"
    fi
done

log ""
log "🎉 Configuration completed! Please check your website: https://$DOMAIN"
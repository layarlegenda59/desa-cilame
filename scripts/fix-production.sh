#!/bin/bash

# Script untuk memperbaiki masalah UMKM API di production

echo "🔧 Memperbaiki masalah UMKM API di production..."

# 1. Restart backend services
echo "📡 Restarting backend services..."
pm2 restart ecosystem.config.js

# 2. Check if services are running
echo "🔍 Checking service status..."
pm2 status

# 3. Test API endpoints
echo "🧪 Testing API endpoints..."

# Test main API
echo "Testing main API (port 5000)..."
curl -f http://localhost:5000/health || echo "❌ Main API not responding"

# Test UMKM API
echo "Testing UMKM API (port 5001)..."
curl -f http://localhost:5001/health || echo "❌ UMKM API not responding"

# Test admin API
echo "Testing admin API (port 5002)..."
curl -f http://localhost:5002/health || echo "❌ Admin API not responding"

# Test location API
echo "Testing location API (port 5003)..."
curl -f http://localhost:5003/health || echo "❌ Location API not responding"

# 4. Test UMKM endpoint specifically
echo "🎯 Testing UMKM endpoint..."
curl -f http://localhost:5001/api/umkm || echo "❌ UMKM endpoint not responding"

# 5. Check Nginx configuration
echo "🌐 Testing Nginx configuration..."
nginx -t && echo "✅ Nginx config is valid" || echo "❌ Nginx config has errors"

# 6. Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

# 7. Test external access
echo "🌍 Testing external access..."
curl -f https://desacilame.com/api/umkm || echo "❌ External UMKM API not accessible"

echo "✅ Production fix script completed!"
echo "📊 Check PM2 logs for more details: pm2 logs"

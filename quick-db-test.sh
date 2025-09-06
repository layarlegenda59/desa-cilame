#!/bin/bash

# Quick Database Connection Test Script
# This script tests all database connections without requiring node-fetch

echo "🔍 Quick Database Connection Test for desacilame.com"
echo "=================================================="
echo ""

# Test local database connections
echo "Testing Local Database Connections:"
echo "-----------------------------------"

# Function to test a port
test_port() {
    local service_name=$1
    local port=$2
    local path=${3:-"/health"}
    
    if curl -s --max-time 3 "http://localhost:$port$path" > /dev/null 2>&1; then
        echo "✅ $service_name (Port $port): Connected"
        # Try to get health info
        response=$(curl -s --max-time 3 "http://localhost:$port$path" 2>/dev/null || echo "{}")
        if echo "$response" | grep -q "status"; then
            echo "   $(echo "$response" | head -c 100)"
        fi
    else
        echo "❌ $service_name (Port $port): Not responding"
    fi
}

# Test each database service
test_port "Main Database" 5000
test_port "UMKM Database" 5001  
test_port "Admin Database" 5002
test_port "Location Database" 5003
test_port "Frontend Application" 3003 "/"

echo ""
echo "Testing External Connectivity:"
echo "------------------------------"

# Test external website
if curl -s --max-time 10 "https://desacilame.com" > /dev/null 2>&1; then
    echo "✅ Website (desacilame.com): Accessible"
else
    echo "❌ Website (desacilame.com): Not accessible"
fi

# Test external API endpoints
if curl -s --max-time 5 "https://desacilame.com:5000/health" > /dev/null 2>&1; then
    echo "✅ Main API (External): Accessible"
else
    echo "❌ Main API (External): Not accessible"
fi

echo ""
echo "System Information:"
echo "------------------"
echo "Node.js Version: $(node --version 2>/dev/null || echo 'Not found')"
echo "Current Directory: $(pwd)"
echo "User: $(whoami)"
echo "Date: $(date)"

echo ""
echo "Process Status:"
echo "--------------"
if command -v pm2 >/dev/null 2>&1; then
    echo "PM2 Status:"
    pm2 status 2>/dev/null || echo "PM2 not running"
else
    echo "PM2 not installed, checking running processes:"
    ps aux | grep -E "(node|npm)" | grep -v grep | head -5
fi

echo ""
echo "Port Status:"
echo "-----------"
for port in 3003 5000 5001 5002 5003; do
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo "✅ Port $port: In use"
    else
        echo "❌ Port $port: Not in use"
    fi
done

echo ""
echo "🔧 Quick Troubleshooting Commands:"
echo "  • Check PM2 status: pm2 status"
echo "  • View logs: pm2 logs"  
echo "  • Restart all services: pm2 restart all"
echo "  • Start services: pm2 start ecosystem.simple.config.js"
echo "  • Manual test: curl http://localhost:5000/health"
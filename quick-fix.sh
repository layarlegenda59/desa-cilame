#!/bin/bash

# Quick Fix for CloudPanel Deployment Issues
# This script fixes common deployment problems

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 CloudPanel Deployment Quick Fix${NC}"
echo -e "${BLUE}===================================${NC}\n"

# Check if we're in the right directory
echo -e "${YELLOW}1. Checking project structure...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Please run this script from the project root directory.${NC}"
    exit 1
fi

if [ ! -d "backend" ] || [ ! -f "backend/server-main.js" ]; then
    echo -e "${RED}❌ Backend directory or server files not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project structure looks good${NC}"

# Create logs directory
echo -e "\n${YELLOW}2. Creating logs directory...${NC}"
mkdir -p logs
echo -e "${GREEN}✅ Logs directory created${NC}"

# Stop all existing PM2 processes
echo -e "\n${YELLOW}3. Stopping existing PM2 processes...${NC}"
pm2 delete all || echo "No existing processes to stop"
echo -e "${GREEN}✅ Existing processes stopped${NC}"

# Start services with simple configuration
echo -e "\n${YELLOW}4. Starting services with simple configuration...${NC}"
if [ ! -f "ecosystem.simple.config.js" ]; then
    echo -e "${RED}❌ ecosystem.simple.config.js not found${NC}"
    exit 1
fi

pm2 start ecosystem.simple.config.js
pm2 save
echo -e "${GREEN}✅ Services started${NC}"

# Wait for services to initialize
echo -e "\n${YELLOW}5. Waiting for services to initialize...${NC}"
sleep 10

# Check service status
echo -e "\n${YELLOW}6. Checking service status...${NC}"
pm2 status

# Test port connectivity
echo -e "\n${YELLOW}7. Testing port connectivity...${NC}"
if [ -f "test-ports.js" ]; then
    node test-ports.js
else
    echo -e "${BLUE}💡 Run 'node test-ports.js' manually to test connectivity${NC}"
fi

echo -e "\n${GREEN}🎉 Quick fix completed!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Check PM2 status: pm2 status"
echo -e "2. View logs: pm2 logs"
echo -e "3. Test connectivity: node test-ports.js"
echo -e "4. Access frontend: http://localhost:3003"
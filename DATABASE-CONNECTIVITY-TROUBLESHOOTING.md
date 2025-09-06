# Database Connectivity Troubleshooting Guide

## Problem: desacilame.com deployed but not connecting to all databases

Your website uses a **multi-database architecture** with 4 separate database servers:
- **Port 5000**: Main Database (users, news, authentication)
- **Port 5001**: UMKM Database (local business directory) 
- **Port 5002**: Admin Database (village officials, services)
- **Port 5003**: Location Database (villages, tourism, geography)

## Quick Fix

### Step 1: Run the Database Connection Fix

**Windows:**
```cmd
fix-database-connection.bat
```

**Linux/Server:**
```bash
chmod +x fix-database-connection.sh
./fix-database-connection.sh
```

### Step 2: Test Database Connections

```bash
node test-database-connections.js
```

### Step 3: Check Service Status

```bash
pm2 status
pm2 logs
```

## Manual Diagnosis Steps

### 1. Check if Services are Running

```bash
# Check which ports are in use
netstat -tulpn | grep :5000
netstat -tulpn | grep :5001  
netstat -tulpn | grep :5002
netstat -tulpn | grep :5003
netstat -tulpn | grep :3003

# Check PM2 status
pm2 status
```

### 2. Test Individual Database Servers

```bash
# Test each database health endpoint
curl http://localhost:5000/health
curl http://localhost:5001/health
curl http://localhost:5002/health
curl http://localhost:5003/health

# Test frontend
curl http://localhost:3003
```

### 3. Check Environment Configuration

Verify `.env.production` contains:
```env
NEXT_PUBLIC_MAIN_API_URL=https://desacilame.com:5000/api
NEXT_PUBLIC_UMKM_API_URL=https://desacilame.com:5001/api
NEXT_PUBLIC_ADMIN_API_URL=https://desacilame.com:5002/api
NEXT_PUBLIC_LOCATION_API_URL=https://desacilame.com:5003/api
CORS_ORIGIN=https://desacilame.com,https://desacilame.com:3003,http://localhost:3003
```

## Common Issues & Solutions

### Issue 1: Services Not Starting

**Symptoms:** PM2 shows services as "stopped" or "errored"

**Solutions:**
1. Check logs: `pm2 logs`
2. Restart services: `pm2 restart all`
3. Delete and restart: `pm2 delete all && pm2 start ecosystem.simple.config.js`

### Issue 2: CORS Errors in Browser

**Symptoms:** Browser console shows CORS errors when accessing APIs

**Solutions:**
1. Verify CORS_ORIGIN includes your domain
2. Restart backend services after changing CORS settings
3. Check if all backend servers have correct CORS configuration

### Issue 3: Port Access Issues

**Symptoms:** "Connection refused" or "Cannot connect to port"

**Solutions:**
1. Check firewall settings:
   ```bash
   # Allow ports through firewall
   sudo ufw allow 3003
   sudo ufw allow 5000:5003/tcp
   ```

2. Verify ports are not already in use:
   ```bash
   sudo lsof -i :5000
   sudo lsof -i :5001
   sudo lsof -i :5002
   sudo lsof -i :5003
   ```

### Issue 4: Database Files Missing

**Symptoms:** SQLite database file errors in logs

**Solutions:**
1. Create database directories:
   ```bash
   mkdir -p backend/data
   chmod 755 backend/data
   ```

2. Initialize databases:
   ```bash
   cd backend
   node scripts/init-databases.js
   ```

### Issue 5: Environment Variables Not Loading

**Symptoms:** Services starting with default/wrong configuration

**Solutions:**
1. Verify `.env.production` exists and has correct values
2. Restart PM2 with environment: `pm2 restart all --update-env`
3. Check PM2 environment: `pm2 show desa-cilame-main-db`

## Health Monitoring

### Access Database Health Dashboard

Visit: `https://desacilame.com/health`

This page shows:
- Status of all 4 database servers
- Connection response times
- Error details for failed connections
- Real-time monitoring with auto-refresh

### Manual Health Check Commands

```bash
# Test all connections
node test-database-connections.js

# Check specific database
curl -v http://localhost:5000/health
```

## Web Server Configuration

### Nginx Configuration

Your web server needs to proxy backend API calls:

```nginx
# Frontend
location / {
    proxy_pass http://localhost:3003;
}

# Backend APIs
location /api/main/ {
    proxy_pass http://localhost:5000/api/;
}

location /api/umkm/ {
    proxy_pass http://localhost:5001/api/;
}

location /api/admin/ {
    proxy_pass http://localhost:5002/api/;
}

location /api/location/ {
    proxy_pass http://localhost:5003/api/;
}
```

### Alternative: Direct Port Access

If backend APIs should be accessed directly via ports:
```
https://desacilame.com:5000/api  # Main Database
https://desacilame.com:5001/api  # UMKM Database  
https://desacilame.com:5002/api  # Admin Database
https://desacilame.com:5003/api  # Location Database
```

Ensure these ports are open in your firewall and CloudPanel configuration.

## Recovery Steps

### Complete System Restart

```bash
# Stop all services
pm2 delete all

# Clean restart
rm -rf logs/*
mkdir -p logs

# Restart with fresh configuration
pm2 start ecosystem.simple.config.js
pm2 save
```

### Database Reset (if needed)

```bash
# Backup existing data
cp -r backend/data backend/data.backup

# Reset databases
rm -rf backend/data/*.db
node backend/scripts/init-databases.js
```

## Monitoring Commands

```bash
# Real-time service monitoring
pm2 monit

# Check logs continuously  
pm2 logs --lines 100

# Service resource usage
pm2 list
```

## Files Created by Fix Script

- `.env.production` - Updated environment configuration
- `backend/.env` - Backend environment variables
- `test-database-connections.js` - Connection testing script
- `logs/` - Log directory for all services

## Support

If issues persist after following this guide:

1. **Check PM2 logs**: `pm2 logs --lines 50`
2. **Test health endpoint**: Visit `https://desacilame.com/health`
3. **Verify browser console**: Check for JavaScript errors (F12)
4. **Check web server logs**: Review Nginx/Apache error logs
5. **Test from different networks**: Verify it's not a local connectivity issue

## Next Steps After Fix

1. ✅ Run database connection fix script
2. ✅ Test all database connections
3. ✅ Verify PM2 services are running
4. ✅ Access health dashboard at `/health`
5. ✅ Test website functionality at desacilame.com
6. ✅ Check browser console for any remaining errors
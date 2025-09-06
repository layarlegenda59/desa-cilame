# Fix API 404 Error - Web Server Configuration

## Problem Analysis

The error `https://www.desacilame.com/api/umkm/?t=1757181636708 404 (Not Found)` indicates that the web server (Nginx/Apache) is not properly configured to proxy API requests to the backend services running on ports 5000-5003.

## Root Cause

- Frontend is running on port 3003 ✅
- Backend services are running on ports 5000-5003 ✅
- Web server proxy configuration is missing ❌

The web server needs to be configured to route API requests:
- `/api/main/` → `http://localhost:5000/api/`
- `/api/umkm/` → `http://localhost:5001/api/`
- `/api/admin/` → `http://localhost:5002/api/`
- `/api/location/` → `http://localhost:5003/api/`

## Solution Files Created

### 1. `nginx-site.conf`
Complete Nginx configuration file that properly routes API requests to backend services.

### 2. `configure-webserver.sh`
Automated script to install and configure Nginx on the server.

### 3. `check-webserver.bat`
Local diagnostic script to check service status and test endpoints.

## Deployment Steps

### Step 1: Upload Configuration Files
Upload these files to your server:
- `nginx-site.conf`
- `configure-webserver.sh`

### Step 2: Run Configuration Script
On your server, run as root:
```bash
sudo chmod +x configure-webserver.sh
sudo ./configure-webserver.sh
```

### Step 3: Verify Services
Ensure all backend services are running:
```bash
pm2 status
```

If services are not running:
```bash
pm2 start ecosystem.simple.config.js
pm2 save
```

### Step 4: Test API Endpoints
After configuration, test these URLs:
- https://desacilame.com/api/main/
- https://desacilame.com/api/umkm/
- https://desacilame.com/api/admin/
- https://desacilame.com/api/location/

### Step 5: Check Health Endpoints
- https://desacilame.com/health/main
- https://desacilame.com/health/umkm
- https://desacilame.com/health/admin
- https://desacilame.com/health/location

## Local Testing

Run `check-webserver.bat` on your local machine to:
- Check if local services are running
- Test local health endpoints
- Attempt to connect to production APIs
- Get diagnostic information

## Key Configuration Points

### Nginx Configuration Features:
1. **SSL/HTTPS Support** - Redirects HTTP to HTTPS
2. **API Proxy Routing** - Routes `/api/*` to appropriate backend services
3. **Security Headers** - Adds security headers for production
4. **Gzip Compression** - Improves performance
5. **Static Asset Handling** - Optimizes static file serving
6. **Health Check Endpoints** - Monitors service status

### Important Notes:
- API route configurations must come BEFORE the main location block in Nginx
- Backend services must be running on localhost ports 5000-5003
- Frontend must be running on localhost port 3003
- SSL certificates need to be properly configured

## Troubleshooting

### If APIs still return 404:
1. Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
2. Verify backend services: `pm2 logs`
3. Test Nginx configuration: `sudo nginx -t`
4. Check service ports: `netstat -tulpn | grep -E ":(3003|5000|5001|5002|5003)"`

### If services are not running:
```bash
cd /path/to/your/app
pm2 restart all
pm2 logs
```

### If SSL issues:
- Verify SSL certificate paths in `nginx-site.conf`
- Update certificate paths according to your SSL setup
- Consider using Let's Encrypt for free SSL certificates

## Expected Results

After proper configuration:
- ✅ `https://desacilame.com/` - Frontend loads correctly
- ✅ `https://desacilame.com/api/umkm/` - Returns backend data or proper API response
- ✅ `https://desacilame.com/api/main/` - Returns backend data or proper API response
- ✅ All UMKM data displays correctly on the website
- ✅ No more 404 errors in browser console

## Security Considerations

The configuration includes:
- Firewall rules limiting direct access to backend ports
- Security headers (HSTS, XSS protection, etc.)
- Proper SSL/TLS configuration
- Rate limiting and timeout settings

This ensures that backend services are only accessible through the web server proxy, maintaining security while enabling proper functionality.
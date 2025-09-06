# Website Display Issues Troubleshooting Guide

## Problem: Website appears "acak-acak2an" (messy/broken) at desacilame.com

This issue typically occurs when:
1. Static assets (CSS, JS, images) are not loading properly
2. Web server configuration is incorrect
3. Asset paths are misconfigured
4. CORS issues prevent API calls

## Quick Fix Steps

### Step 1: Run the Fix Script
```bash
# On Windows Command Prompt:
fix-website-display.bat

# Or Windows PowerShell:
powershell -ExecutionPolicy Bypass -File fix-website-display.ps1

# On Linux/Server:
chmod +x fix-website-display.sh
./fix-website-display.sh
```

### Step 2: Manual Verification

1. **Check if services are running locally:**
   ```bash
   # Test frontend
   curl http://localhost:3003
   
   # Test backend services
   curl http://localhost:5000/health
   curl http://localhost:5001/health
   curl http://localhost:5002/health
   curl http://localhost:5003/health
   ```

2. **Check browser console for errors:**
   - Open https://desacilame.com
   - Press F12 to open developer tools
   - Check Console tab for errors
   - Check Network tab for failed requests

### Step 3: Web Server Configuration

Your web server (Nginx/Apache) needs proper configuration:

#### Nginx Configuration Example:
```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name desacilame.com www.desacilame.com;
    
    # Frontend application
    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static assets
    location /_next/static/ {
        proxy_pass http://localhost:3003;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Backend API routes
    location /api/main/ {
        proxy_pass http://localhost:5000/;
    }
    
    location /api/umkm/ {
        proxy_pass http://localhost:5001/;
    }
    
    location /api/admin/ {
        proxy_pass http://localhost:5002/;
    }
    
    location /api/location/ {
        proxy_pass http://localhost:5003/;
    }
}
```

## Common Issues & Solutions

### Issue 1: CSS/JavaScript Not Loading
**Symptoms:** Website looks unstyled, functionality broken
**Solution:**
1. Check if `.next/static` directory exists after build
2. Verify web server serves static files from correct path
3. Check browser network tab for 404 errors on static assets

### Issue 2: Images Not Loading
**Symptoms:** Broken image icons, missing pictures
**Solution:**
1. Verify image paths in code use relative URLs
2. Check if images exist in `public/` directory
3. Ensure web server serves files from `public/` directory

### Issue 3: API Calls Failing
**Symptoms:** Dynamic content not loading, CORS errors
**Solution:**
1. Verify backend services are running (ports 5000-5003)
2. Check CORS configuration includes your domain
3. Test API endpoints directly with curl

### Issue 4: Environment Variables
**Symptoms:** Wrong URLs, configuration errors
**Solution:**
1. Verify `.env.production` has correct domain
2. Restart application after changing environment variables
3. Check `NEXT_PUBLIC_*` variables are accessible in browser

## Diagnostic Commands

### Check Service Status:
```bash
# Check if ports are in use
netstat -an | grep :3003
netstat -an | grep :5000
netstat -an | grep :5001
netstat -an | grep :5002
netstat -an | grep :5003

# Check PM2 status (if using PM2)
pm2 status
pm2 logs
```

### Check Build Output:
```bash
# Verify build completed successfully
ls -la .next/
ls -la .next/static/

# Check for build errors
npm run build
```

### Test Connectivity:
```bash
# Test frontend
curl -I http://localhost:3003

# Test if static assets are accessible
curl -I http://localhost:3003/_next/static/

# Test backend health
curl http://localhost:5000/health
```

## CloudPanel Specific Issues

### Issue: Port 3003 Not Accessible
**Solution:**
1. Check CloudPanel firewall settings
2. Verify port 3003 is open
3. Check if CloudPanel proxy configuration is correct

### Issue: SSL Certificate Problems
**Solution:**
1. Verify SSL certificate is installed for desacilame.com
2. Check if HTTPS redirects are working
3. Ensure mixed content warnings are resolved

## Recovery Steps

If website is still broken after fixes:

1. **Complete rebuild:**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Reset PM2:**
   ```bash
   pm2 delete all
   pm2 start ecosystem.simple.config.js
   ```

3. **Check web server logs:**
   ```bash
   # Nginx
   tail -f /var/log/nginx/error.log
   
   # Apache
   tail -f /var/log/apache2/error.log
   ```

4. **Restart web server:**
   ```bash
   # Nginx
   sudo systemctl restart nginx
   
   # Apache
   sudo systemctl restart apache2
   ```

## Contact Support

If issues persist:
1. Check PM2 logs: `pm2 logs`
2. Check browser console errors (F12)
3. Check web server error logs
4. Verify DNS is pointing to correct server
5. Test from different networks/devices

## Files to Check

- `.env.production` - Environment configuration
- `next.config.js` - Next.js configuration
- Web server config (nginx.conf or apache.conf)
- PM2 ecosystem files
- Build output in `.next/` directory
# CloudPanel Deployment Guide for Desa Cilame

This guide helps you deploy the Desa Cilame website on CloudPanel VPS with port 3003 configuration.

## Quick Deployment

### 1. Run the CloudPanel Deployment Script

```bash
chmod +x deploy-cloudpanel.sh
./deploy-cloudpanel.sh your-domain.com
```

Replace `your-domain.com` with your actual domain name.

### 2. Manual Steps (if needed)

1. **Install Dependencies**
   ```bash
   npm ci --only=production
   cd backend && npm ci --only=production && cd ..
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```

3. **Start Services with PM2**
   ```bash
   pm2 start ecosystem.cloudpanel.config.js --env production
   pm2 save
   ```

## Port Configuration

- **Frontend**: Port 3003
- **Main Database Server**: Port 5000
- **UMKM Database Server**: Port 5001
- **Admin Database Server**: Port 5002
- **Location Database Server**: Port 5003

## Environment Configuration

Update the `.env.production` file with your actual domain:

```env
NODE_ENV=production
PORT=3003
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_MAIN_API_URL=https://your-domain.com:5000/api
NEXT_PUBLIC_UMKM_API_URL=https://your-domain.com:5001/api
NEXT_PUBLIC_ADMIN_API_URL=https://your-domain.com:5002/api
NEXT_PUBLIC_LOCATION_API_URL=https://your-domain.com:5003/api
CORS_ORIGIN=https://your-domain.com:3003,https://your-domain.com,http://localhost:3003
FRONTEND_URL=https://your-domain.com:3003
```

## Web Server Configuration

### Nginx Configuration

Your web server should proxy requests to port 3003:

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name your-domain.com;
    
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
}
```

## Monitoring

### Check Service Status
```bash
pm2 status
```

### View Logs
```bash
pm2 logs
pm2 logs desa-cilame-frontend
```

### Restart Services
```bash
pm2 restart all
pm2 restart desa-cilame-frontend
```

## Health Check

Run the health check script:
```bash
node scripts/health-check.js
```

## Troubleshooting

### Frontend Can't Connect to Backend

1. **Check if all services are running**:
   ```bash
   pm2 status
   ```

2. **Check service health**:
   ```bash
   curl http://localhost:3003
   curl http://localhost:5000/health
   curl http://localhost:5001/health
   curl http://localhost:5002/health
   curl http://localhost:5003/health
   ```

3. **Check CORS configuration**: Ensure `CORS_ORIGIN` includes your domain with port 3003

4. **Check environment variables**: Verify `.env.production` has correct URLs

### Services Won't Start

1. **Check logs**:
   ```bash
   pm2 logs --lines 50
   ```

2. **Check port conflicts**:
   ```bash
   netstat -tlnp | grep :3003
   netstat -tlnp | grep :5000
   ```

3. **Restart services**:
   ```bash
   pm2 restart all
   ```

## Files Modified for CloudPanel

- `next.config.js` - Added CloudPanel support and CORS headers
- `package.json` - Updated start script for port 3003
- `.env.production` - Production environment configuration
- `ecosystem.cloudpanel.config.js` - PM2 configuration for CloudPanel
- `deploy-cloudpanel.sh` - Automated deployment script
- `hostinger-deploy.sh` - Updated for port 3003

## Support

If you encounter issues:

1. Check the logs: `pm2 logs`
2. Verify environment variables in `.env.production`
3. Ensure your domain DNS points to the server
4. Check firewall settings allow port 3003
5. Verify SSL certificate is properly configured
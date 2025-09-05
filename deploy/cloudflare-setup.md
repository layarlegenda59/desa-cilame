# Panduan Setup Cloudflare untuk Desa Cilame

## 1. Konfigurasi DNS Cloudflare

### A. Setting DNS Records
Masuk ke Cloudflare Dashboard dan tambahkan DNS records berikut:

```
Type: A
Name: @
IPv4 address: [IP_SERVER_VPS_ANDA]
Proxy status: Proxied (Orange Cloud)
TTL: Auto

Type: A
Name: www
IPv4 address: [IP_SERVER_VPS_ANDA]
Proxy status: Proxied (Orange Cloud)
TTL: Auto

Type: CNAME
Name: api
Target: desacilame.com
Proxy status: Proxied (Orange Cloud)
TTL: Auto
```

### B. SSL/TLS Configuration
1. Buka **SSL/TLS** > **Overview**
2. Set encryption mode ke **Full (strict)**
3. Aktifkan **Always Use HTTPS**
4. Aktifkan **HTTP Strict Transport Security (HSTS)**

### C. Page Rules (Opsional)
Tambahkan page rules untuk optimasi:

```
URL: desacilame.com/api/*
Settings:
- Cache Level: Bypass
- Security Level: Medium
- Browser Integrity Check: On

URL: desacilame.com/admin*
Settings:
- Cache Level: Bypass
- Security Level: High
- Browser Integrity Check: On
```

## 2. Konfigurasi Server VPS

### A. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install certbot untuk SSL
sudo apt install certbot python3-certbot-nginx -y
```

### B. Setup SSL Certificate
```bash
# Generate SSL certificate dengan Let's Encrypt
sudo certbot --nginx -d desacilame.com -d www.desacilame.com

# Auto-renewal
sudo crontab -e
# Tambahkan line berikut:
0 12 * * * /usr/bin/certbot renew --quiet
```

### C. Deploy Application
```bash
# Clone repository
git clone [REPOSITORY_URL] /var/www/desa-cilame
cd /var/www/desa-cilame

# Install dependencies
npm install

# Build frontend
npm run build

# Install backend dependencies
cd backend
npm install

# Setup environment variables
cp .env.example .env.production
# Edit .env.production dengan konfigurasi production
```

## 3. PM2 Configuration

### A. Create PM2 Ecosystem File
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'desa-cilame-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/desa-cilame',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'desa-cilame-main-api',
      script: 'npm',
      args: 'run start:main',
      cwd: '/var/www/desa-cilame/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M'
    },
    {
      name: 'desa-cilame-umkm-api',
      script: 'npm',
      args: 'run start:umkm',
      cwd: '/var/www/desa-cilame/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M'
    },
    {
      name: 'desa-cilame-admin-api',
      script: 'npm',
      args: 'run start:admin',
      cwd: '/var/www/desa-cilame/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5002
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M'
    },
    {
      name: 'desa-cilame-location-api',
      script: 'npm',
      args: 'run start:location',
      cwd: '/var/www/desa-cilame/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5003
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M'
    }
  ]
};
```

### B. Start Applications
```bash
# Start all applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

## 4. Nginx Configuration

Copy file `nginx/nginx.conf` ke `/etc/nginx/sites-available/desacilame.com`:

```bash
sudo cp nginx/nginx.conf /etc/nginx/sites-available/desacilame.com
sudo ln -s /etc/nginx/sites-available/desacilame.com /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 5. Firewall Configuration

```bash
# Setup UFW firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

## 6. Monitoring dan Troubleshooting

### A. Check Application Status
```bash
# PM2 status
pm2 status
pm2 logs

# Nginx status
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log

# Check ports
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :5000
```

### B. Common Issues

1. **502 Bad Gateway**
   - Check if backend services are running: `pm2 status`
   - Check Nginx configuration: `sudo nginx -t`
   - Check firewall: `sudo ufw status`

2. **SSL Certificate Issues**
   - Renew certificate: `sudo certbot renew`
   - Check certificate status: `sudo certbot certificates`

3. **API Connection Issues**
   - Verify environment variables in `.env.production`
   - Check CORS configuration
   - Verify Cloudflare proxy settings

## 7. Deployment Script

Buat script untuk automated deployment:

```bash
#!/bin/bash
# deploy.sh

echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build frontend
npm run build

# Install backend dependencies
cd backend
npm install
cd ..

# Restart applications
pm2 restart all

# Reload Nginx
sudo systemctl reload nginx

echo "Deployment completed!"
```

Make script executable:
```bash
chmod +x deploy.sh
```

## 8. Backup Strategy

```bash
# Create backup script
#!/bin/bash
# backup.sh

BACKUP_DIR="/var/backups/desa-cilame"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/desa-cilame

# Backup database (if using)
# mysqldump -u user -p database > $BACKUP_DIR/db_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Setup cron job untuk backup otomatis:
```bash
sudo crontab -e
# Tambahkan:
0 2 * * * /var/www/desa-cilame/backup.sh
```
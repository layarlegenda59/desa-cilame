# Panduan Deployment Website Desa Cilame ke Hostinger Cloud Panel

## 📋 Daftar Isi
1. [Persiapan](#persiapan)
2. [Konfigurasi Server](#konfigurasi-server)
3. [Deployment Manual](#deployment-manual)
4. [Deployment dengan Docker](#deployment-dengan-docker)
5. [Konfigurasi SSL dan Domain](#konfigurasi-ssl-dan-domain)
6. [Monitoring dan Maintenance](#monitoring-dan-maintenance)
7. [Troubleshooting](#troubleshooting)

## 🚀 Persiapan

### Persyaratan Sistem
- **VPS Hostinger** dengan minimal 2GB RAM, 2 CPU cores, 50GB storage
- **Ubuntu 20.04 LTS** atau lebih baru
- **Domain** yang sudah dikonfigurasi ke IP server
- **Akses SSH** ke server

### Software yang Dibutuhkan
- Node.js 18.x atau lebih baru
- MySQL 8.0
- Nginx
- PM2 (Process Manager)
- Certbot (untuk SSL)
- Docker & Docker Compose (opsional)

## 🔧 Konfigurasi Server

### 1. Koneksi ke Server
```bash
ssh root@your-server-ip
```

### 2. Update Sistem
```bash
apt update && apt upgrade -y
apt install -y curl wget git unzip nginx mysql-server ufw fail2ban
```

### 3. Buat User untuk Aplikasi
```bash
adduser desa-cilame
usermod -aG sudo desa-cilame
su - desa-cilame
```

### 4. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 5. Install PM2
```bash
sudo npm install -g pm2
pm2 startup
```

## 📦 Deployment Manual

### 1. Upload File Aplikasi
```bash
# Buat direktori aplikasi
mkdir -p /home/desa-cilame/htdocs
cd /home/desa-cilame/htdocs

# Upload file via SCP atau Git
git clone https://github.com/your-repo/desa-cilame.git .
# atau
scp -r ./desa-cilame/* desa-cilame@your-server-ip:/home/desa-cilame/htdocs/
```

### 2. Konfigurasi Database
```bash
# Login ke MySQL
sudo mysql -u root -p

# Buat database dan user
CREATE DATABASE desa_cilame_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'desa_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON desa_cilame_prod.* TO 'desa_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Konfigurasi Environment
```bash
# Copy dan edit file environment
cp .env.production .env
nano .env
```

Edit file `.env` dengan konfigurasi yang sesuai:
```env
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=desa_cilame_prod
DB_USER=desa_user
DB_PASSWORD=your_secure_password
DOMAIN=your-domain.com
```

### 4. Install Dependencies dan Build
```bash
# Install dependencies
npm ci --only=production
cd backend && npm ci --only=production && cd ..

# Build aplikasi
npm run build

# Migrasi database
node backend/scripts/migrate-to-mysql.js
```

### 5. Konfigurasi PM2
```bash
# Start aplikasi dengan PM2
pm2 start ecosystem.config.js

# Save konfigurasi PM2
pm2 save

# Setup auto-start
pm2 startup
```

### 6. Konfigurasi Nginx
```bash
# Copy konfigurasi Nginx
sudo cp nginx/nginx.conf /etc/nginx/sites-available/desa-cilame
sudo ln -s /etc/nginx/sites-available/desa-cilame /etc/nginx/sites-enabled/

# Edit konfigurasi sesuai domain
sudo nano /etc/nginx/sites-available/desa-cilame

# Test dan restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Setup SSL dengan Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Dapatkan sertifikat SSL
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Setup auto-renewal
sudo systemctl enable certbot.timer
```

### 8. Konfigurasi Firewall
```bash
# Enable UFW
sudo ufw enable

# Allow necessary ports
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

## 🐳 Deployment dengan Docker

### 1. Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker desa-cilame
```

### 2. Konfigurasi Environment untuk Docker
```bash
# Buat file .env untuk Docker
cat > .env << EOF
DOMAIN=your-domain.com
DB_ROOT_PASSWORD=root_secure_password
DB_NAME=desa_cilame_prod
DB_USER=desa_user
DB_PASSWORD=user_secure_password
GRAFANA_PASSWORD=grafana_password
EOF
```

### 3. Deploy dengan Docker Compose
```bash
# Build dan start semua services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Setup SSL untuk Docker
```bash
# Generate SSL certificate
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/
sudo chown desa-cilame:desa-cilame ./ssl/*

# Restart nginx container
docker-compose restart nginx
```

## 🔒 Konfigurasi SSL dan Domain

### 1. Konfigurasi DNS
Pastikan DNS record mengarah ke IP server:
```
A     @              your-server-ip
A     www            your-server-ip
CNAME api            your-domain.com
```

### 2. Verifikasi SSL
```bash
# Test SSL certificate
ssl-cert-check -c /etc/letsencrypt/live/your-domain.com/fullchain.pem

# Test website
curl -I https://your-domain.com
```

### 3. Setup Auto-renewal SSL
```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

## 📊 Monitoring dan Maintenance

### 1. Setup Health Check
```bash
# Install health check script
cp scripts/health-check.js /home/desa-cilame/
chmod +x /home/desa-cilame/health-check.js

# Add to crontab
echo "*/5 * * * * /usr/bin/node /home/desa-cilame/health-check.js" | crontab -
```

### 2. Setup Log Rotation
```bash
# Create logrotate config
sudo tee /etc/logrotate.d/desa-cilame << EOF
/home/desa-cilame/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 desa-cilame desa-cilame
    postrotate
        pm2 reload all
    endscript
}
EOF
```

### 3. Monitoring Commands
```bash
# Check PM2 status
pm2 status
pm2 logs
pm2 monit

# Check system resources
htop
df -h
free -h

# Check Nginx status
sudo systemctl status nginx
sudo nginx -t

# Check MySQL status
sudo systemctl status mysql
mysql -u desa_user -p -e "SHOW PROCESSLIST;"
```

### 4. Backup Script
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/home/desa-cilame/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u desa_user -p desa_cilame_prod > $BACKUP_DIR/db_backup_$DATE.sql

# Backup application files
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /home/desa-cilame/htdocs

# Backup uploads
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /home/desa-cilame/uploads

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "*backup*" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### 5. Update Script
```bash
#!/bin/bash
# update.sh

cd /home/desa-cilame/htdocs

# Backup current version
pm2 stop all
cp -r . ../backup_$(date +%Y%m%d_%H%M%S)

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --only=production
cd backend && npm ci --only=production && cd ..

# Build application
npm run build

# Restart services
pm2 restart all

echo "Update completed"
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :3000

# Kill process
sudo kill -9 PID
```

#### 2. Permission Issues
```bash
# Fix ownership
sudo chown -R desa-cilame:desa-cilame /home/desa-cilame/

# Fix permissions
chmod -R 755 /home/desa-cilame/htdocs
chmod -R 777 /home/desa-cilame/uploads
```

#### 3. Database Connection Issues
```bash
# Test database connection
mysql -u desa_user -p -h localhost desa_cilame_prod

# Check MySQL status
sudo systemctl status mysql
sudo journalctl -u mysql
```

#### 4. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL
openssl s_client -connect your-domain.com:443
```

#### 5. High Memory Usage
```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head

# Restart services
pm2 restart all
sudo systemctl restart nginx
```

### Log Locations
- **Application Logs**: `/home/desa-cilame/logs/`
- **PM2 Logs**: `~/.pm2/logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **MySQL Logs**: `/var/log/mysql/`
- **System Logs**: `/var/log/syslog`

### Performance Optimization

#### 1. Enable Gzip Compression
```nginx
# Add to nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

#### 2. Enable Caching
```nginx
# Add to nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

#### 3. Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_created_at ON posts(created_at);
CREATE INDEX idx_status ON posts(status);
CREATE INDEX idx_category ON posts(category_id);
```

## 📞 Support

Jika mengalami masalah selama deployment:

1. **Check logs** terlebih dahulu
2. **Restart services** jika diperlukan
3. **Verify configurations** sesuai panduan
4. **Contact support** jika masalah persisten

### Useful Commands
```bash
# Quick health check
curl -f http://localhost:3000/health
curl -f https://your-domain.com/health

# Service status
sudo systemctl status nginx mysql
pm2 status

# Resource monitoring
htop
iotop
netstat -tulpn
```

---

**🎉 Selamat! Website Desa Cilame berhasil di-deploy ke Hostinger Cloud Panel.**

Pastikan untuk melakukan monitoring rutin dan backup berkala untuk menjaga keamanan dan performa website.
# 🚀 DEPLOYMENT CHECKLIST - Fix API 404 Error

## ✅ Pre-Deployment Check
- [ ] All fix files are created locally
- [ ] Server access is available (SSH/FTP)
- [ ] Backend services are currently running on server
- [ ] Domain `desacilame.com` is pointing to the server

## 📂 Files to Upload to Server
- [ ] `nginx-site.conf` - Main Nginx configuration
- [ ] `configure-webserver.sh` - Automated setup script

## 🔧 Server Commands to Run

### 1. Make script executable
```bash
chmod +x configure-webserver.sh
```

### 2. Run configuration (as root)
```bash
sudo ./configure-webserver.sh
```

### 3. Check PM2 services
```bash
pm2 status
```

### 4. Start services if needed
```bash
pm2 start ecosystem.simple.config.js
pm2 save
```

## 🧪 Testing Commands

### Test API endpoints (should return 200 or valid response, not 404)
```bash
curl -I https://desacilame.com/api/umkm/
curl -I https://desacilame.com/api/main/
curl -I https://desacilame.com/api/admin/
curl -I https://desacilame.com/api/location/
```

### Test health endpoints
```bash
curl https://desacilame.com/health/umkm
curl https://desacilame.com/health/main
curl https://desacilame.com/health/admin
curl https://desacilame.com/health/location
```

## ✅ Success Verification

After deployment, verify these work:
- [ ] Website loads: `https://desacilame.com`
- [ ] No 404 errors in browser console
- [ ] UMKM data displays correctly on website
- [ ] All API endpoints return proper responses
- [ ] Health checks pass

## 🆘 If Issues Persist

### Check Nginx logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check PM2 logs
```bash
pm2 logs
```

### Verify port listening
```bash
netstat -tulpn | grep -E ":(3003|5000|5001|5002|5003)"
```

### Test Nginx configuration
```bash
sudo nginx -t
```

### Restart services if needed
```bash
sudo systemctl restart nginx
pm2 restart all
```

## 📞 Expected Results

✅ **BEFORE FIX:**
- ❌ `https://desacilame.com/api/umkm/` → 404 Not Found
- ❌ Browser console shows API connection errors
- ❌ UMKM data doesn't load on website

✅ **AFTER FIX:**
- ✅ `https://desacilame.com/api/umkm/` → Valid API response
- ✅ No 404 errors in browser console  
- ✅ UMKM data loads correctly on website
- ✅ All backend services accessible through web server

---

**🎯 GOAL:** Fix the 404 error for API endpoints by configuring proper web server proxy routing.

**⏱️ ESTIMATED TIME:** 5-10 minutes for experienced admin, 15-20 minutes for new admin.

**🔒 SAFETY:** Script backs up existing configuration automatically.
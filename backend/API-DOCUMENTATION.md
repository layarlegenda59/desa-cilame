# API Documentation - Multi-Database Backend

## Overview
Sistem backend ini menggunakan arsitektur multi-database dengan port yang berbeda untuk setiap instance database. Setiap database server menangani domain data yang spesifik.

## Database Servers

### 1. Main Database Server (Port 5000)
**Endpoint Base:** `http://localhost:5000`
**Database:** `main` - Menangani data utama sistem

#### Endpoints:
- `GET /health` - Health check
- `GET /api/database/status` - Status database
- `GET /api/users` - Daftar pengguna
- `POST /api/users` - Buat pengguna baru
- `GET /api/news` - Daftar berita
- `POST /api/news` - Buat berita baru
- `POST /api/auth/login` - Login pengguna

### 2. UMKM Database Server (Port 5001)
**Endpoint Base:** `http://localhost:5001`
**Database:** `umkm` - Menangani data UMKM dan kategori

#### Endpoints:
- `GET /health` - Health check
- `GET /api/database/status` - Status database
- `GET /api/umkm` - Daftar UMKM
- `POST /api/umkm` - Buat UMKM baru
- `GET /api/umkm/:id` - Detail UMKM
- `PUT /api/umkm/:id` - Update UMKM
- `DELETE /api/umkm/:id` - Hapus UMKM
- `GET /api/umkm/categories` - Daftar kategori UMKM
- `POST /api/umkm/categories` - Buat kategori baru

### 3. Admin Database Server (Port 5002)
**Endpoint Base:** `http://localhost:5002`
**Database:** `admin` - Menangani data administrasi desa

#### Endpoints:
- `GET /health` - Health check
- `GET /api/database/status` - Status database
- `GET /api/village-officials` - Daftar perangkat desa
- `POST /api/village-officials` - Buat perangkat desa baru
- `GET /api/village-officials/:id` - Detail perangkat desa
- `PUT /api/village-officials/:id` - Update perangkat desa
- `DELETE /api/village-officials/:id` - Hapus perangkat desa
- `GET /api/services` - Layanan desa (placeholder)
- `GET /api/regulations` - Peraturan desa (placeholder)
- `GET /api/reports` - Laporan desa (placeholder)

### 4. Location Database Server (Port 5003)
**Endpoint Base:** `http://localhost:5003`
**Database:** `location` - Menangani data geografis dan wisata

#### Endpoints:
- `GET /health` - Health check
- `GET /api/database/status` - Status database
- `GET /api/villages` - Daftar desa
- `POST /api/villages` - Buat desa baru
- `GET /api/villages/:id` - Detail desa
- `PUT /api/villages/:id` - Update desa
- `DELETE /api/villages/:id` - Hapus desa
- `GET /api/hamlets` - Daftar dusun
- `POST /api/hamlets` - Buat dusun baru
- `GET /api/tourism` - Daftar tempat wisata
- `POST /api/tourism` - Buat tempat wisata baru

## Database Schema

### Main Database Tables:
- `users` - Data pengguna sistem
- `news` - Data berita

### UMKM Database Tables:
- `umkm` - Data UMKM
- `umkm_categories` - Kategori UMKM

### Admin Database Tables:
- `village_officials` - Data perangkat desa
- `services` - Layanan desa (future)
- `regulations` - Peraturan desa (future)
- `reports` - Laporan desa (future)

### Location Database Tables:
- `villages` - Data desa
- `hamlets` - Data dusun
- `tourism_spots` - Data tempat wisata

## Running the Servers

### Install Dependencies
```bash
npm install
```

### Run Individual Servers
```bash
# Main database server (port 5000)
npm run start:main

# UMKM database server (port 5001)
npm run start:umkm

# Admin database server (port 5002)
npm run start:admin

# Location database server (port 5003)
npm run start:location
```

### Run All Servers Simultaneously
```bash
# Production mode
npm run start:all

# Development mode (with nodemon)
npm run dev:all
```

## Configuration

### Database Configuration
Konfigurasi database dapat ditemukan di:
- `src/config/database-config.js` - Konfigurasi port dan path database
- `src/config/database-manager.js` - Manager untuk mengelola koneksi database

### Environment Variables
Buat file `.env` dengan konfigurasi berikut:
```env
# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Request Size Limit
MAX_REQUEST_SIZE=10mb

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_here

# Upload Directory
UPLOAD_DIR=uploads
```

## Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request rate limiting
- **Input Validation** - Request validation
- **File Upload Security** - Secure file upload handling

## Error Handling

Semua server menggunakan error handling middleware yang konsisten:
- HTTP status codes yang sesuai
- JSON response format yang konsisten
- Logging error dengan Winston

## Health Monitoring

Setiap server menyediakan endpoint `/health` untuk monitoring:
```json
{
  "status": "healthy",
  "database": "main",
  "port": 5000,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Frontend Integration

Untuk mengintegrasikan dengan frontend, update konfigurasi API base URL:

```javascript
// Frontend API configuration
const API_ENDPOINTS = {
  main: 'http://localhost:5000/api',
  umkm: 'http://localhost:5001/api',
  admin: 'http://localhost:5002/api',
  location: 'http://localhost:5003/api'
};
```

## Development Notes

1. **Port Management**: Setiap database menggunakan port yang unik untuk menghindari konflik
2. **Database Isolation**: Data terisolasi berdasarkan domain untuk skalabilitas yang lebih baik
3. **Graceful Shutdown**: Semua server mendukung graceful shutdown dengan SIGTERM/SIGINT
4. **Logging**: Menggunakan Winston untuk logging yang konsisten
5. **Database Migration**: Setiap database akan otomatis membuat tabel yang diperlukan saat startup

## Troubleshooting

### Port Already in Use
Jika mendapat error "port already in use", pastikan tidak ada service lain yang menggunakan port 5000-5003.

### Database Connection Issues
Periksa log server untuk detail error koneksi database. Pastikan direktori `data/` dapat diakses untuk file SQLite.

### CORS Issues
Pastikan frontend URL sudah ditambahkan ke konfigurasi CORS di environment variables.
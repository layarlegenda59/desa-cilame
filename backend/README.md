# Desa Cilame Backend API

Backend API untuk website Desa Cilame yang dibangun dengan Node.js, Express.js, dan PostgreSQL.

## 🚀 Fitur Utama

- **Autentikasi & Otorisasi**: JWT-based authentication dengan role-based access control
- **Manajemen Berita**: CRUD operations untuk berita dengan kategori dan tags
- **Pengumuman**: Sistem pengumuman dengan prioritas dan tanggal kedaluwarsa
- **UMKM**: Manajemen data UMKM dengan lokasi geografis
- **Perangkat Desa**: Informasi struktur organisasi desa
- **Statistik Desa**: Data demografis dan statistik desa
- **Dokumen**: Manajemen dokumen publik dan privat
- **Keamanan**: Rate limiting, input sanitization, CORS protection
- **Logging**: Comprehensive logging untuk monitoring

## 📋 Prasyarat

- Node.js >= 16.0.0
- PostgreSQL >= 12.0
- npm atau yarn

## 🛠️ Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd desa-cilame/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit file `.env` sesuai dengan konfigurasi Anda.

4. **Setup database**
   ```bash
   # Buat database PostgreSQL
   createdb desa_cilame
   
   # Jalankan migrasi
   npm run migrate
   
   # Seed data (opsional)
   npm run seed
   ```

5. **Jalankan aplikasi**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api/v1
```

### Authentication

Semua endpoint yang memerlukan autentikasi harus menyertakan header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/v1/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "phone": "081234567890"
}
```

### Login
```http
POST /api/v1/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Profile
```http
GET /api/v1/auth/profile
```
*Requires authentication*

### Update Profile
```http
PUT /api/v1/auth/profile
```
*Requires authentication*

### Change Password
```http
PUT /api/v1/auth/change-password
```
*Requires authentication*

---

## 📰 News Endpoints

### Get Published News (Public)
```http
GET /api/v1/news/published?page=1&limit=10&category=1&search=keyword
```

### Get News by Slug (Public)
```http
GET /api/v1/news/slug/{slug}
```

### Get Featured News (Public)
```http
GET /api/v1/news/featured?limit=5
```

### Create News
```http
POST /api/v1/news
```
*Requires authentication (Editor/Admin)*

**Body:**
```json
{
  "title": "Judul Berita",
  "content": "Konten berita lengkap...",
  "excerpt": "Ringkasan berita",
  "category_id": 1,
  "tags": ["tag1", "tag2"],
  "status": "published",
  "featured": false,
  "meta_title": "SEO Title",
  "meta_description": "SEO Description"
}
```

### Update News
```http
PUT /api/v1/news/{id}
```
*Requires authentication (Owner/Editor/Admin)*

### Delete News
```http
DELETE /api/v1/news/{id}
```
*Requires authentication (Owner/Editor/Admin)*

---

## 📢 Announcements Endpoints

### Get Active Announcements (Public)
```http
GET /api/v1/announcements/active?page=1&limit=10&priority=high
```

### Get Urgent Announcements (Public)
```http
GET /api/v1/announcements/urgent?limit=5
```

### Get Announcement by Slug (Public)
```http
GET /api/v1/announcements/slug/{slug}
```

### Create Announcement
```http
POST /api/v1/announcements
```
*Requires authentication (Editor/Admin)*

**Body:**
```json
{
  "title": "Judul Pengumuman",
  "content": "Konten pengumuman...",
  "excerpt": "Ringkasan pengumuman",
  "priority": "high",
  "status": "published",
  "published_at": "2024-01-15T10:00:00Z",
  "expires_at": "2024-02-15T23:59:59Z"
}
```

---

## 🏪 UMKM Endpoints

### Get Active UMKM (Public)
```http
GET /api/v1/umkm/active?page=1&limit=10&category=1&search=keyword
```

### Get UMKM by Location (Public)
```http
GET /api/v1/umkm/nearby/{latitude}/{longitude}?radius=5&limit=10
```

### Get UMKM Categories (Public)
```http
GET /api/v1/umkm/categories
```

### Get UMKM by Slug (Public)
```http
GET /api/v1/umkm/slug/{slug}
```

### Create UMKM
```http
POST /api/v1/umkm
```
*Requires authentication*

**Body:**
```json
{
  "name": "Nama UMKM",
  "description": "Deskripsi UMKM...",
  "category_id": 1,
  "owner_name": "Nama Pemilik",
  "owner_phone": "081234567890",
  "owner_email": "owner@example.com",
  "address": "Alamat lengkap",
  "latitude": -6.2088,
  "longitude": 106.8456,
  "website": "https://umkm.com",
  "social_media": {
    "instagram": "@umkm_instagram",
    "facebook": "umkm_facebook"
  },
  "operating_hours": {
    "monday": "08:00-17:00",
    "tuesday": "08:00-17:00"
  },
  "products_services": ["Produk 1", "Layanan 1"]
}
```

---

## 🏛️ Village Endpoints

### Get Village Officials (Public)
```http
GET /api/v1/village/officials?page=1&limit=10&position=kepala
```

### Get Village Statistics (Public)
```http
GET /api/v1/village/statistics
```

### Get Village Documents (Public/Private)
```http
GET /api/v1/village/documents?page=1&limit=10&type=regulation
```

### Download Document
```http
GET /api/v1/village/documents/{id}/download
```

### Create Village Official
```http
POST /api/v1/village/officials
```
*Requires authentication (Admin)*

**Body:**
```json
{
  "name": "Nama Perangkat",
  "position": "Kepala Desa",
  "position_order": 1,
  "phone": "081234567890",
  "email": "kepala@desacilame.com",
  "photo_url": "https://example.com/photo.jpg",
  "bio": "Biografi singkat...",
  "start_date": "2020-01-01",
  "end_date": "2026-01-01"
}
```

---

## 👥 User Management Endpoints

### Get All Users
```http
GET /api/v1/users?page=1&limit=10&role=user&status=active
```
*Requires authentication (Admin)*

### Get User by ID
```http
GET /api/v1/users/{id}
```
*Requires authentication (Admin)*

### Update User
```http
PUT /api/v1/users/{id}
```
*Requires authentication (Admin)*

### Delete User
```http
DELETE /api/v1/users/{id}
```
*Requires authentication (Admin)*

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": {
    "current_page": 1,
    "total_pages": 10,
    "total_items": 100,
    "items_per_page": 10,
    "has_next": true,
    "has_prev": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

---

## 🔒 Security Features

- **Rate Limiting**: Membatasi jumlah request per IP
- **Input Sanitization**: Membersihkan input dari XSS dan injection
- **CORS Protection**: Konfigurasi CORS yang aman
- **Helmet**: Security headers untuk melindungi aplikasi
- **JWT Authentication**: Token-based authentication
- **Password Hashing**: Bcrypt untuk hashing password
- **Request Validation**: Joi schema validation

---

## 📝 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `username` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `phone` (VARCHAR)
- `role` (ENUM: user, editor, admin)
- `status` (ENUM: active, inactive, suspended)
- `avatar_url` (VARCHAR)
- `bio` (TEXT)
- `last_login` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `deleted_at` (TIMESTAMP)

### News Table
- `id` (UUID, Primary Key)
- `title` (VARCHAR)
- `slug` (VARCHAR, Unique)
- `content` (TEXT)
- `excerpt` (TEXT)
- `category_id` (UUID, Foreign Key)
- `author_id` (UUID, Foreign Key)
- `status` (ENUM: draft, published, archived)
- `featured` (BOOLEAN)
- `views` (INTEGER)
- `published_at` (TIMESTAMP)
- `meta_title` (VARCHAR)
- `meta_description` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Announcements Table
- `id` (UUID, Primary Key)
- `title` (VARCHAR)
- `slug` (VARCHAR, Unique)
- `content` (TEXT)
- `excerpt` (TEXT)
- `priority` (ENUM: low, medium, high, urgent)
- `status` (ENUM: draft, published, archived)
- `author_id` (UUID, Foreign Key)
- `views` (INTEGER)
- `published_at` (TIMESTAMP)
- `expires_at` (TIMESTAMP)
- `meta_title` (VARCHAR)
- `meta_description` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### UMKM Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `slug` (VARCHAR, Unique)
- `description` (TEXT)
- `category_id` (UUID, Foreign Key)
- `owner_name` (VARCHAR)
- `owner_phone` (VARCHAR)
- `owner_email` (VARCHAR)
- `address` (TEXT)
- `latitude` (DECIMAL)
- `longitude` (DECIMAL)
- `website` (VARCHAR)
- `social_media` (JSONB)
- `operating_hours` (JSONB)
- `products_services` (JSONB)
- `status` (ENUM: active, inactive, pending)
- `views` (INTEGER)
- `created_by` (UUID, Foreign Key)
- `meta_title` (VARCHAR)
- `meta_description` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

---

## 🧪 Testing

```bash
# Jalankan semua test
npm test

# Test dengan coverage
npm run test:coverage

# Test dalam mode watch
npm run test:watch
```

---

## 📦 Deployment

### Environment Variables untuk Production

```env
NODE_ENV=production
PORT=3001
DB_HOST=your_production_db_host
DB_NAME=your_production_db_name
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_super_secure_jwt_secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

---

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📄 License

Project ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

---

## 📞 Support

Jika Anda memiliki pertanyaan atau membutuhkan bantuan:

- Email: support@desacilame.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

---

## 🔄 Changelog

### v1.0.0 (2024-01-15)
- ✨ Initial release
- 🔐 Authentication & authorization system
- 📰 News management
- 📢 Announcements system
- 🏪 UMKM management
- 🏛️ Village information system
- 📊 Statistics and reporting
- 🔒 Security features
- 📚 API documentation
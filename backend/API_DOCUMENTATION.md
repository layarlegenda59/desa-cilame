# API Documentation - Desa Cilame Backend

## 🚀 Base Information

**Base URL:** `http://localhost:5000`  
**API Version:** v1  
**Content-Type:** `application/json`  
**Environment:** Development  

---

## 🔐 Authentication

*Note: Authentication akan diimplementasi di fase selanjutnya*

Saat ini semua endpoints dapat diakses tanpa authentication untuk development purposes.

---

## 📊 System Endpoints

### Health Check

**GET** `/health`

Memeriksa status server dan database.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-09-03T15:06:43.469Z",
  "database": "SQLite",
  "environment": "development"
}
```

**Status Codes:**
- `200` - Server healthy
- `500` - Server error

---

### Database Test

**GET** `/api/test`

Menguji koneksi database.

**Response:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "data": {
    "test": 1
  },
  "timestamp": "2025-09-03T15:06:52.439Z"
}
```

---

## 👥 Users API

### Get All Users

**GET** `/api/users`

Mengambil daftar semua pengguna.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Test User",
      "email": "testuser@example.com",
      "role": "admin",
      "phone": "+62812345678",
      "address": "Jl. Test No. 123",
      "created_at": "2025-09-03T15:05:00.000Z",
      "updated_at": "2025-09-03T15:05:00.000Z"
    }
  ],
  "count": 1
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Create User

**POST** `/api/users`

Membuat pengguna baru.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "user",
  "phone": "+62812345678",
  "address": "Jl. Contoh No. 456"
}
```

**Required Fields:**
- `name` (string, 2-100 chars)
- `email` (string, valid email, unique)
- `password` (string, min 6 chars)

**Optional Fields:**
- `role` (string, default: "user")
- `phone` (string)
- `address` (text)

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "+62812345678",
    "address": "Jl. Contoh No. 456",
    "created_at": "2025-09-03T15:10:00.000Z",
    "updated_at": "2025-09-03T15:10:00.000Z"
  }
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Validation error
- `409` - Email already exists
- `500` - Server error

**Error Response:**
```json
{
  "success": false,
  "error": "Email already exists",
  "details": "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email"
}
```

---

## 📰 News API

### Get All News

**GET** `/api/news`

Mengambil daftar semua berita dengan informasi author.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Berita Test",
      "content": "Ini adalah konten berita test untuk menguji API",
      "excerpt": "Excerpt berita test",
      "featured_image": null,
      "author_id": 1,
      "category": "announcement",
      "status": "published",
      "published_at": "2025-09-03T15:15:00.000Z",
      "created_at": "2025-09-03T15:15:00.000Z",
      "updated_at": "2025-09-03T15:15:00.000Z",
      "author_name": "Test User",
      "author_email": "testuser@example.com"
    }
  ],
  "count": 1
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Create News

**POST** `/api/news`

Membuat berita baru.

**Request Body:**
```json
{
  "title": "Judul Berita",
  "content": "Konten lengkap berita...",
  "excerpt": "Ringkasan berita",
  "author_id": 1,
  "category": "announcement",
  "status": "published",
  "featured_image": "https://example.com/image.jpg"
}
```

**Required Fields:**
- `title` (string, 5-200 chars)
- `content` (text, min 10 chars)
- `author_id` (integer, valid user ID)

**Optional Fields:**
- `excerpt` (string, max 500 chars)
- `category` (string, default: "general")
- `status` (string, default: "draft")
- `featured_image` (string, URL)

**Response:**
```json
{
  "success": true,
  "message": "News created successfully",
  "data": {
    "id": 2,
    "title": "Judul Berita",
    "content": "Konten lengkap berita...",
    "excerpt": "Ringkasan berita",
    "featured_image": "https://example.com/image.jpg",
    "author_id": 1,
    "category": "announcement",
    "status": "published",
    "published_at": "2025-09-03T15:20:00.000Z",
    "created_at": "2025-09-03T15:20:00.000Z",
    "updated_at": "2025-09-03T15:20:00.000Z"
  }
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Validation error
- `404` - Author not found
- `500` - Server error

---

## 🏪 UMKM API

### Get All UMKM

**GET** `/api/umkm`

Mengambil daftar semua UMKM.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Warung Makan Sederhana",
      "description": "Warung makan dengan menu tradisional",
      "category": "kuliner",
      "owner_name": "Ibu Sari",
      "phone": "+62812345678",
      "address": "Jl. Desa Cilame No. 123",
      "status": "active",
      "created_at": "2025-09-03T15:25:00.000Z",
      "updated_at": "2025-09-03T15:25:00.000Z"
    }
  ],
  "count": 1
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Create UMKM

**POST** `/api/umkm`

Mendaftarkan UMKM baru.

**Request Body:**
```json
{
  "name": "Toko Kelontong Berkah",
  "description": "Toko kelontong lengkap untuk kebutuhan sehari-hari",
  "category": "retail",
  "owner_name": "Pak Budi",
  "phone": "+62812345678",
  "address": "Jl. Desa Cilame No. 456",
  "status": "active"
}
```

**Required Fields:**
- `name` (string, 3-100 chars)
- `owner_name` (string, 2-100 chars)
- `category` (string)

**Optional Fields:**
- `description` (text)
- `phone` (string)
- `address` (text)
- `status` (string, default: "pending")

**Response:**
```json
{
  "success": true,
  "message": "UMKM created successfully",
  "data": {
    "id": 2,
    "name": "Toko Kelontong Berkah",
    "description": "Toko kelontong lengkap untuk kebutuhan sehari-hari",
    "category": "retail",
    "owner_name": "Pak Budi",
    "phone": "+62812345678",
    "address": "Jl. Desa Cilame No. 456",
    "status": "active",
    "created_at": "2025-09-03T15:30:00.000Z",
    "updated_at": "2025-09-03T15:30:00.000Z"
  }
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Validation error
- `500` - Server error

---

## 🔧 Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information",
  "timestamp": "2025-09-03T15:35:00.000Z"
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | OK - Request successful |
| `201` | Created - Resource created successfully |
| `400` | Bad Request - Invalid request data |
| `404` | Not Found - Resource not found |
| `409` | Conflict - Resource already exists |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error - Server error |

---

## 🛡️ Security Features

### Rate Limiting
- **Limit:** 100 requests per 15 minutes per IP
- **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`

### Security Headers
- Content Security Policy (CSP)
- Cross-Origin Resource Policy
- X-Frame-Options
- X-Content-Type-Options

### CORS Configuration
- **Allowed Origins:** Frontend development server
- **Allowed Methods:** GET, POST, PUT, DELETE
- **Allowed Headers:** Content-Type, Authorization

---

## 📝 Request/Response Examples

### cURL Examples

#### Get Health Status
```bash
curl -X GET http://localhost:5000/health
```

#### Create User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "user"
  }'
```

#### Get All News
```bash
curl -X GET http://localhost:5000/api/news
```

### JavaScript Fetch Examples

#### Get Users
```javascript
fetch('http://localhost:5000/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Create News
```javascript
fetch('http://localhost:5000/api/news', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Berita Baru',
    content: 'Konten berita...',
    author_id: 1,
    category: 'announcement',
    status: 'published'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## 🚀 Development Notes

### Database
- **Engine:** SQLite (Development)
- **File:** `./data/desa_cilame.db`
- **Migrations:** Auto-created on server start

### Environment Variables
```env
PORT=5000
NODE_ENV=development
DB_ENGINE=sqlite
DB_FILE=./data/desa_cilame.db
```

### Server Features
- **Compression:** Enabled
- **Logging:** Console output
- **Hot Reload:** Manual restart required
- **HTTPS:** Not configured (development)

---

## 📞 Support

### Development Server
- **URL:** http://localhost:5000
- **Health Check:** http://localhost:5000/health
- **API Test:** http://localhost:5000/api/test

### Files
- **Server:** `./backend/server-sqlite.js`
- **Database:** `./backend/data/desa_cilame.db`
- **Config:** `./backend/.env`
- **Documentation:** `./backend/API_DOCUMENTATION.md`

### Next Steps
1. Implement authentication & authorization
2. Add UPDATE and DELETE endpoints
3. Add pagination and filtering
4. Add file upload for images
5. Add search functionality
6. Add data validation middleware
7. Add API versioning
8. Add comprehensive error logging

---

*Last Updated: September 3, 2025*  
*API Version: 1.0.0*  
*Environment: Development*
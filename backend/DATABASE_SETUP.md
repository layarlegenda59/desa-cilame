# Database Setup Guide - Desa Cilame Backend

## Status Pemeriksaan Database

❌ **PostgreSQL tidak terdeteksi atau tidak berjalan**

Berdasarkan pemeriksaan yang dilakukan:
- PostgreSQL service tidak ditemukan di sistem
- Koneksi database gagal dengan error `ECONNREFUSED`
- Dependencies backend sudah terinstall dengan benar

## Opsi Setup Database

### Opsi 1: Install PostgreSQL (Recommended untuk Production)

#### Windows Installation

1. **Download PostgreSQL**
   ```
   https://www.postgresql.org/download/windows/
   ```

2. **Install PostgreSQL**
   - Jalankan installer
   - Set password untuk user `postgres`
   - Port default: 5432
   - Catat password yang Anda set

3. **Verifikasi Installation**
   ```powershell
   # Cek service PostgreSQL
   Get-Service -Name postgresql*
   
   # Test koneksi (setelah install)
   psql -U postgres -h localhost
   ```

4. **Create Database**
   ```sql
   CREATE DATABASE desa_cilame;
   CREATE USER desa_cilame_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE desa_cilame TO desa_cilame_user;
   ```

5. **Update .env file**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=desa_cilame
   DB_USER=desa_cilame_user
   DB_PASSWORD=your_secure_password
   ```

### Opsi 2: Docker PostgreSQL (Recommended untuk Development)

1. **Install Docker Desktop**
   ```
   https://www.docker.com/products/docker-desktop/
   ```

2. **Run PostgreSQL Container**
   ```powershell
   docker run --name postgres-desa-cilame `
     -e POSTGRES_DB=desa_cilame `
     -e POSTGRES_USER=postgres `
     -e POSTGRES_PASSWORD=your_password `
     -p 5432:5432 `
     -d postgres:15
   ```

3. **Verify Container**
   ```powershell
   docker ps
   docker logs postgres-desa-cilame
   ```

### Opsi 3: Cloud Database (Supabase/Railway/Neon)

#### Supabase (Free Tier)
1. Daftar di https://supabase.com
2. Create new project
3. Copy connection string
4. Update .env dengan connection details

#### Railway (Free Tier)
1. Daftar di https://railway.app
2. Deploy PostgreSQL service
3. Copy connection details

## Testing Database Connection

Setelah setup database, jalankan test koneksi:

```powershell
# Di folder backend
node test-db-connection.js
```

### Expected Output (Success)
```
info: 🔍 Testing database connection...
info: ✅ Database connection successful!
info: 🔍 Testing CREATE operation...
info: ✅ CREATE operation successful!
info: 🔍 Testing INSERT operation...
info: ✅ INSERT operation successful!
info: 🔍 Testing SELECT operation...
info: ✅ SELECT operation successful!
info: 🔍 Testing UPDATE operation...
info: ✅ UPDATE operation successful!
info: 🔍 Testing DELETE operation...
info: ✅ DELETE operation successful!
info: 🔍 Testing TRANSACTION operation...
info: ✅ TRANSACTION operation successful!
info: 🧹 Test table cleaned up
info: 🎉 All database CRUD operations completed successfully!
info: ✨ Database test completed successfully!
```

## Database Migration & Seeding

Setelah database setup berhasil:

```powershell
# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

## Troubleshooting

### Error: ECONNREFUSED
- PostgreSQL service tidak berjalan
- Check port 5432 tidak digunakan aplikasi lain
- Verifikasi DB_HOST dan DB_PORT di .env

### Error: Authentication failed (28P01)
- Password salah
- User tidak exist
- Check DB_USER dan DB_PASSWORD di .env

### Error: Database does not exist (3D000)
- Database belum dibuat
- Check DB_NAME di .env
- Create database manual

### Error: Connection timeout
- Firewall blocking connection
- Database server overloaded
- Check DB_CONNECTION_TIMEOUT di .env

## Environment Variables

Pastikan .env file memiliki konfigurasi yang benar:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=desa_cilame
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_SSL=false
DB_POOL_MIN=2
DB_POOL_MAX=10
```

## Next Steps

1. ✅ Install PostgreSQL (pilih salah satu opsi di atas)
2. ✅ Update .env file dengan credentials yang benar
3. ✅ Test koneksi dengan `node test-db-connection.js`
4. ✅ Run migrations: `npm run migrate`
5. ✅ Seed initial data: `npm run seed`
6. ✅ Start backend server: `npm run dev`

## Production Considerations

- Gunakan connection pooling (sudah dikonfigurasi)
- Set DB_SSL=true untuk production
- Gunakan strong password
- Backup database secara regular
- Monitor database performance
- Set proper DB_MAX_CONNECTIONS sesuai server capacity
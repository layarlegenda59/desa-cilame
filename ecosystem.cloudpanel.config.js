module.exports = {
  apps: [
    {
      name: 'desa-cilame-frontend',
      script: 'npm',
      args: 'run start:production',
      cwd: '/home/desa-cilame/htdocs',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3003,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com',
        CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://your-domain.com:3003,https://your-domain.com',
        FRONTEND_URL: process.env.FRONTEND_URL || 'https://your-domain.com:3003'
      },
      error_file: '/home/desa-cilame/logs/frontend-error.log',
      out_file: '/home/desa-cilame/logs/frontend-out.log',
      log_file: '/home/desa-cilame/logs/frontend.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '30s'
    },
    {
      name: 'desa-cilame-main-db',
      script: 'backend/server-main.js',
      cwd: '/home/desa-cilame/htdocs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://your-domain.com:3003,https://your-domain.com',
        FRONTEND_URL: process.env.FRONTEND_URL || 'https://your-domain.com:3003'
      },
      error_file: '/home/desa-cilame/logs/main-db-error.log',
      out_file: '/home/desa-cilame/logs/main-db-out.log',
      log_file: '/home/desa-cilame/logs/main-db.log',
      time: true,
      max_memory_restart: '512M',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '30s'
    },
    {
      name: 'desa-cilame-umkm-db',
      script: 'backend/server-umkm.js',
      cwd: '/home/desa-cilame/htdocs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001,
        CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://your-domain.com:3003,https://your-domain.com',
        FRONTEND_URL: process.env.FRONTEND_URL || 'https://your-domain.com:3003'
      },
      error_file: '/home/desa-cilame/logs/umkm-db-error.log',
      out_file: '/home/desa-cilame/logs/umkm-db-out.log',
      log_file: '/home/desa-cilame/logs/umkm-db.log',
      time: true,
      max_memory_restart: '512M',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '30s'
    },
    {
      name: 'desa-cilame-admin-db',
      script: 'backend/server-admin.js',
      cwd: '/home/desa-cilame/htdocs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5002
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5002,
        CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://your-domain.com:3003,https://your-domain.com',
        FRONTEND_URL: process.env.FRONTEND_URL || 'https://your-domain.com:3003'
      },
      error_file: '/home/desa-cilame/logs/admin-db-error.log',
      out_file: '/home/desa-cilame/logs/admin-db-out.log',
      log_file: '/home/desa-cilame/logs/admin-db.log',
      time: true,
      max_memory_restart: '512M',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '30s'
    },
    {
      name: 'desa-cilame-location-db',
      script: 'backend/server-location.js',
      cwd: '/home/desa-cilame/htdocs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5003
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5003,
        CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://your-domain.com:3003,https://your-domain.com',
        FRONTEND_URL: process.env.FRONTEND_URL || 'https://your-domain.com:3003'
      },
      error_file: '/home/desa-cilame/logs/location-db-error.log',
      out_file: '/home/desa-cilame/logs/location-db-out.log',
      log_file: '/home/desa-cilame/logs/location-db.log',
      time: true,
      max_memory_restart: '512M',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '30s'
    }
  ]
};
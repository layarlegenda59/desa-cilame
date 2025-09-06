module.exports = {
  apps: [
    {
      name: 'desa-cilame-frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      instances: 1,
      exec_mode: 'fork',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '30s'
    },
    {
      name: 'desa-cilame-main-db',
      script: './backend/server-main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      instances: 1,
      exec_mode: 'fork',
      error_file: './logs/main-db-error.log',
      out_file: './logs/main-db-out.log',
      log_file: './logs/main-db.log',
      time: true,
      max_memory_restart: '512M',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '30s'
    },
    {
      name: 'desa-cilame-umkm-db',
      script: './backend/server-umkm.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      instances: 1,
      exec_mode: 'fork',
      error_file: './logs/umkm-db-error.log',
      out_file: './logs/umkm-db-out.log',
      log_file: './logs/umkm-db.log',
      time: true,
      max_memory_restart: '512M',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '30s'
    },
    {
      name: 'desa-cilame-admin-db',
      script: './backend/server-admin.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5002
      },
      instances: 1,
      exec_mode: 'fork',
      error_file: './logs/admin-db-error.log',
      out_file: './logs/admin-db-out.log',
      log_file: './logs/admin-db.log',
      time: true,
      max_memory_restart: '512M',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '30s'
    },
    {
      name: 'desa-cilame-location-db',
      script: './backend/server-location.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5003
      },
      instances: 1,
      exec_mode: 'fork',
      error_file: './logs/location-db-error.log',
      out_file: './logs/location-db-out.log',
      log_file: './logs/location-db.log',
      time: true,
      max_memory_restart: '512M',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '30s'
    }
  ]
};
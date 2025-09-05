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
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/frontend-error.log',
      out_file: '/var/log/pm2/frontend-out.log',
      log_file: '/var/log/pm2/frontend.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
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
      max_memory_restart: '512M',
      error_file: '/var/log/pm2/main-api-error.log',
      out_file: '/var/log/pm2/main-api-out.log',
      log_file: '/var/log/pm2/main-api.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
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
      max_memory_restart: '512M',
      error_file: '/var/log/pm2/umkm-api-error.log',
      out_file: '/var/log/pm2/umkm-api-out.log',
      log_file: '/var/log/pm2/umkm-api.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
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
      max_memory_restart: '512M',
      error_file: '/var/log/pm2/admin-api-error.log',
      out_file: '/var/log/pm2/admin-api-out.log',
      log_file: '/var/log/pm2/admin-api.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
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
      max_memory_restart: '512M',
      error_file: '/var/log/pm2/location-api-error.log',
      out_file: '/var/log/pm2/location-api-out.log',
      log_file: '/var/log/pm2/location-api.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: ['desacilame.com'],
      ref: 'origin/main',
      repo: 'https://github.com/layarlegenda59/desa-cilame.git',
      path: '/var/www/desa-cilame',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && cd backend && npm install --production && pm2 reload ecosystem.config.js --env production && pm2 save',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    },
    staging: {
      user: 'deploy',
      host: ['staging.desacilame.com'],
      ref: 'origin/develop',
      repo: 'https://github.com/your-username/desa-cilame.git',
      path: '/var/www/desa-cilame-staging',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && cd backend && npm install --production && pm2 reload ecosystem.staging.config.js --env staging && pm2 save',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    }
  }
};
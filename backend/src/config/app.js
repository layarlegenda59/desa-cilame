require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT) || 5000,
    env: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1'
  },

  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'desa_cilame',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS) || 20,
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 2000
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [
      'http://localhost:3000', 
      'http://localhost:3001', 
      'http://localhost:3003',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    optionsSuccessStatus: 200
  },

  // File Upload Configuration
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 5242880, // 5MB
    allowedTypes: process.env.UPLOAD_ALLOWED_TYPES ? process.env.UPLOAD_ALLOWED_TYPES.split(',') : [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf'
    ],
    destination: 'uploads/'
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  },

  // Email Configuration
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    from: process.env.SMTP_FROM || 'noreply@desacilame.com'
  },

  // API Configuration
  api: {
    prefix: `/api/${process.env.API_VERSION || 'v1'}`,
    timeout: 30000,
    bodyLimit: '10mb'
  }
};

// Validation for required environment variables
const requiredEnvVars = [
  'DB_PASSWORD',
  'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0 && config.server.env === 'production') {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Development warnings
if (config.server.env === 'development') {
  if (config.security.jwtSecret === 'fallback-secret-key') {
    console.warn('⚠️  Warning: Using fallback JWT secret. Set JWT_SECRET in production!');
  }
  if (!process.env.DB_PASSWORD) {
    console.warn('⚠️  Warning: DB_PASSWORD not set. Database connection may fail.');
  }
}

module.exports = config;
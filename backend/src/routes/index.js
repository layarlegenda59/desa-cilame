const express = require('express');
const { AppError } = require('../middleware/errorHandler');

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const newsRoutes = require('./news');
const announcementRoutes = require('./announcements');
const umkmRoutes = require('./umkm');
const villageRoutes = require('./village');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0'
  });
});

// API Info endpoint
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Desa Cilame API',
      version: process.env.API_VERSION || '1.0.0',
      description: 'Backend API untuk website Desa Cilame',
      environment: process.env.NODE_ENV || 'development',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        news: '/api/news',
        announcements: '/api/announcements',
        umkm: '/api/umkm',
        village: '/api/village'
      },
      documentation: {
        swagger: '/api/docs',
        postman: '/api/postman'
      }
    }
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/news', newsRoutes);
router.use('/announcements', announcementRoutes);
router.use('/umkm', umkmRoutes);
router.use('/village', villageRoutes);

// Catch unhandled routes
router.all('*', (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  next(new AppError(message, 404));
});

module.exports = router;
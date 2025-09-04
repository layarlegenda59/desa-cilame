require('dotenv').config();

/**
 * Database Configuration untuk Multiple Instances
 * Setiap database instance memiliki port dan konfigurasi yang unik
 */

const DATABASE_CONFIGS = {
  // Database utama untuk data umum (users, news, dll)
  main: {
    port: 5000,
    name: 'main_database',
    dbPath: 'data/main_desa_cilame.db',
    description: 'Database utama untuk users, news, dan data umum',
    tables: ['users', 'news', 'announcements', 'documents']
  },
  
  // Database khusus untuk UMKM
  umkm: {
    port: 5001,
    name: 'umkm_database', 
    dbPath: 'data/umkm_desa_cilame.db',
    description: 'Database khusus untuk data UMKM',
    tables: ['umkm', 'umkm_categories', 'umkm_products']
  },
  
  // Database untuk layanan administrasi
  admin: {
    port: 5002,
    name: 'admin_database',
    dbPath: 'data/admin_desa_cilame.db', 
    description: 'Database untuk layanan administrasi desa',
    tables: ['village_officials', 'services', 'regulations', 'reports']
  },
  
  // Database untuk data geografis dan lokasi
  location: {
    port: 5003,
    name: 'location_database',
    dbPath: 'data/location_desa_cilame.db',
    description: 'Database untuk data geografis dan lokasi',
    tables: ['locations', 'maps', 'facilities', 'tourism_spots']
  }
};

/**
 * Mendapatkan konfigurasi database berdasarkan nama instance
 * @param {string} instanceName - Nama instance database
 * @returns {object} Konfigurasi database
 */
const getDatabaseConfig = (instanceName) => {
  const config = DATABASE_CONFIGS[instanceName];
  if (!config) {
    throw new Error(`Database instance '${instanceName}' tidak ditemukan`);
  }
  return config;
};

/**
 * Mendapatkan konfigurasi database berdasarkan port
 * @param {number} port - Port database
 * @returns {object} Konfigurasi database
 */
const getDatabaseConfigByPort = (port) => {
  const instance = Object.keys(DATABASE_CONFIGS).find(
    key => DATABASE_CONFIGS[key].port === port
  );
  
  if (!instance) {
    throw new Error(`Database dengan port ${port} tidak ditemukan`);
  }
  
  return {
    instance,
    ...DATABASE_CONFIGS[instance]
  };
};

/**
 * Mendapatkan semua konfigurasi database
 * @returns {object} Semua konfigurasi database
 */
const getAllDatabaseConfigs = () => {
  return DATABASE_CONFIGS;
};

/**
 * Validasi apakah port sudah digunakan
 * @param {number} port - Port yang akan dicek
 * @returns {boolean} True jika port sudah digunakan
 */
const isPortUsed = (port) => {
  return Object.values(DATABASE_CONFIGS).some(config => config.port === port);
};

/**
 * Mendapatkan port yang tersedia
 * @param {number} startPort - Port awal untuk pencarian
 * @returns {number} Port yang tersedia
 */
const getAvailablePort = (startPort = 5004) => {
  let port = startPort;
  while (isPortUsed(port)) {
    port++;
  }
  return port;
};

module.exports = {
  DATABASE_CONFIGS,
  getDatabaseConfig,
  getDatabaseConfigByPort,
  getAllDatabaseConfigs,
  isPortUsed,
  getAvailablePort
};
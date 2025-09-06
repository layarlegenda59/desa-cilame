const { query, testConnection, logger } = require('../config/database');
const bcrypt = require('bcryptjs');
const config = require('../config/app');

// Sample data for seeding
const seedData = {
  users: [
    {
      username: 'admin',
      email: 'admin@desacilame.com',
      password: 'admin123',
      full_name: 'Administrator Desa Cilame',
      role: 'admin'
    },
    {
      username: 'operator',
      email: 'operator@desacilame.com',
      password: 'operator123',
      full_name: 'Operator Desa Cilame',
      role: 'operator'
    }
  ],
  
  villageOfficials: [
    {
      name: 'H. Ahmad Suryadi',
      position: 'Kepala Desa',
      nip: '196501011990031001',
      phone: '081234567890',
      email: 'kades@desacilame.com',
      sort_order: 1
    },
    {
      name: 'Dra. Siti Nurhaliza',
      position: 'Sekretaris Desa',
      nip: '197203151995032001',
      phone: '081234567891',
      email: 'sekdes@desacilame.com',
      sort_order: 2
    },
    {
      name: 'Budi Santoso, S.E.',
      position: 'Kepala Urusan Keuangan',
      nip: '198005102005031002',
      phone: '081234567892',
      email: 'kaur.keuangan@desacilame.com',
      sort_order: 3
    },
    {
      name: 'Rina Handayani, S.Sos.',
      position: 'Kepala Urusan Umum',
      nip: '198507252010032001',
      phone: '081234567893',
      email: 'kaur.umum@desacilame.com',
      sort_order: 4
    }
  ],
  
  news: [
    {
      title: 'Pembangunan Jalan Desa Cilame Tahap II Dimulai',
      slug: 'pembangunan-jalan-desa-cilame-tahap-ii-dimulai',
      excerpt: 'Pemerintah Desa Cilame memulai pembangunan jalan tahap II untuk meningkatkan aksesibilitas warga.',
      content: 'Pembangunan jalan Desa Cilame tahap II resmi dimulai pada hari ini. Proyek ini merupakan kelanjutan dari pembangunan tahap I yang telah berhasil diselesaikan tahun lalu. Pembangunan ini diharapkan dapat meningkatkan aksesibilitas warga dan mendukung perekonomian desa.',
      status: 'published',
      is_featured: true
    },
    {
      title: 'Festival Budaya Desa Cilame 2024',
      slug: 'festival-budaya-desa-cilame-2024',
      excerpt: 'Desa Cilame akan menggelar Festival Budaya untuk melestarikan tradisi dan budaya lokal.',
      content: 'Festival Budaya Desa Cilame 2024 akan diselenggarakan pada bulan depan. Acara ini menampilkan berbagai pertunjukan seni tradisional, pameran kerajinan lokal, dan kuliner khas desa. Mari lestarikan budaya kita bersama-sama.',
      status: 'published',
      is_featured: false
    }
  ],
  
  announcements: [
    {
      title: 'Jadwal Pelayanan Administrasi Desa',
      content: 'Pelayanan administrasi desa buka setiap hari Senin-Jumat pukul 08.00-15.00 WIB. Untuk pelayanan khusus dapat menghubungi kantor desa.',
      type: 'info',
      priority: 2
    },
    {
      title: 'Gotong Royong Pembersihan Lingkungan',
      content: 'Mengundang seluruh warga untuk berpartisipasi dalam gotong royong pembersihan lingkungan setiap hari Minggu pagi.',
      type: 'event',
      priority: 3
    }
  ],
  
  umkmData: [
    {
      name: 'Warung Makan Bu Sari',
      slug: 'warung-makan-bu-sari',
      description: 'Warung makan yang menyajikan masakan tradisional Sunda dengan cita rasa autentik.',
      owner_name: 'Sari Wulandari',
      phone: '081234567894',
      address: 'Jl. Raya Cilame No. 15',
      products: ['Nasi Gudeg', 'Ayam Bakar', 'Sayur Asem', 'Es Teh Manis'],
      established_year: 2018,
      employee_count: 3,
      status: 'active',
      is_featured: true
    },
    {
      name: 'Kerajinan Bambu Pak Dedi',
      slug: 'kerajinan-bambu-pak-dedi',
      description: 'Usaha kerajinan bambu yang menghasilkan berbagai produk furniture dan dekorasi.',
      owner_name: 'Dedi Kurniawan',
      phone: '081234567895',
      address: 'Kampung Bambu RT 02/RW 01',
      products: ['Kursi Bambu', 'Meja Bambu', 'Lampu Hias', 'Keranjang'],
      established_year: 2015,
      employee_count: 5,
      status: 'active',
      is_featured: true
    }
  ],
  
  villageStatistics: [
    {
      metric_name: 'Jumlah Penduduk',
      metric_value: 34700,
      metric_unit: 'jiwa',
      category: 'demografi',
      year: 2024,
      source: 'Data Kependudukan Desa'
    },
    {
      metric_name: 'Jumlah KK',
      metric_value: 2156,
      metric_unit: 'KK',
      category: 'demografi',
      year: 2024,
      source: 'Data Kependudukan Desa'
    },
    {
      metric_name: 'Luas Wilayah',
      metric_value: 12.5,
      metric_unit: 'km²',
      category: 'geografis',
      year: 2024,
      source: 'BPS Kabupaten'
    },
    {
      metric_name: 'Jumlah UMKM',
      metric_value: 45,
      metric_unit: 'unit',
      category: 'ekonomi',
      year: 2024,
      source: 'Pendataan Desa'
    }
  ]
};

// Hash password function
const hashPassword = async (password) => {
  return await bcrypt.hash(password, config.security.bcryptRounds);
};

// Seed users
const seedUsers = async () => {
  logger.info('Seeding users...');
  
  for (const user of seedData.users) {
    try {
      const hashedPassword = await hashPassword(user.password);
      
      await query(`
        INSERT INTO users (username, email, password_hash, full_name, role, is_active, email_verified)
        VALUES ($1, $2, $3, $4, $5, true, true)
        ON CONFLICT (email) DO NOTHING
      `, [user.username, user.email, hashedPassword, user.full_name, user.role]);
      
      logger.info(`✅ User seeded: ${user.email}`);
    } catch (error) {
      logger.error(`❌ Error seeding user ${user.email}:`, error.message);
    }
  }
};

// Seed village officials
const seedVillageOfficials = async () => {
  logger.info('Seeding village officials...');
  
  for (const official of seedData.villageOfficials) {
    try {
      await query(`
        INSERT INTO village_officials (name, position, nip, phone, email, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, true)
        ON CONFLICT DO NOTHING
      `, [official.name, official.position, official.nip, official.phone, official.email, official.sort_order]);
      
      logger.info(`✅ Village official seeded: ${official.name}`);
    } catch (error) {
      logger.error(`❌ Error seeding village official ${official.name}:`, error.message);
    }
  }
};

// Seed news
const seedNews = async () => {
  logger.info('Seeding news...');
  
  // Get admin user ID
  const adminResult = await query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['admin']);
  const adminId = adminResult.rows[0]?.id;
  
  // Get default category
  const categoryResult = await query('SELECT id FROM categories WHERE slug = $1 LIMIT 1', ['berita-umum']);
  const categoryId = categoryResult.rows[0]?.id;
  
  for (const newsItem of seedData.news) {
    try {
      await query(`
        INSERT INTO news (title, slug, excerpt, content, status, is_featured, author_id, category_id, published_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
        ON CONFLICT (slug) DO NOTHING
      `, [newsItem.title, newsItem.slug, newsItem.excerpt, newsItem.content, newsItem.status, newsItem.is_featured, adminId, categoryId]);
      
      logger.info(`✅ News seeded: ${newsItem.title}`);
    } catch (error) {
      logger.error(`❌ Error seeding news ${newsItem.title}:`, error.message);
    }
  }
};

// Seed announcements
const seedAnnouncements = async () => {
  logger.info('Seeding announcements...');
  
  // Get admin user ID
  const adminResult = await query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['admin']);
  const adminId = adminResult.rows[0]?.id;
  
  for (const announcement of seedData.announcements) {
    try {
      await query(`
        INSERT INTO announcements (title, content, type, priority, is_active, author_id)
        VALUES ($1, $2, $3, $4, true, $5)
      `, [announcement.title, announcement.content, announcement.type, announcement.priority, adminId]);
      
      logger.info(`✅ Announcement seeded: ${announcement.title}`);
    } catch (error) {
      logger.error(`❌ Error seeding announcement ${announcement.title}:`, error.message);
    }
  }
};

// Seed UMKM
const seedUMKM = async () => {
  logger.info('Seeding UMKM...');
  
  // Get default category
  const categoryResult = await query('SELECT id FROM umkm_categories WHERE slug = $1 LIMIT 1', ['kuliner']);
  const kulinerId = categoryResult.rows[0]?.id;
  
  const kerajinanResult = await query('SELECT id FROM umkm_categories WHERE slug = $1 LIMIT 1', ['kerajinan']);
  const kerajinanId = kerajinanResult.rows[0]?.id;
  
  const categories = [kulinerId, kerajinanId];
  
  for (let i = 0; i < seedData.umkmData.length; i++) {
    const umkm = seedData.umkmData[i];
    try {
      await query(`
        INSERT INTO umkm (name, slug, description, owner_name, phone, address, category_id, products, established_year, employee_count, status, is_featured)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (slug) DO NOTHING
      `, [umkm.name, umkm.slug, umkm.description, umkm.owner_name, umkm.phone, umkm.address, categories[i], umkm.products, umkm.established_year, umkm.employee_count, umkm.status, umkm.is_featured]);
      
      logger.info(`✅ UMKM seeded: ${umkm.name}`);
    } catch (error) {
      logger.error(`❌ Error seeding UMKM ${umkm.name}:`, error.message);
    }
  }
};

// Seed village statistics
const seedVillageStatistics = async () => {
  logger.info('Seeding village statistics...');
  
  for (const stat of seedData.villageStatistics) {
    try {
      await query(`
        INSERT INTO village_statistics (metric_name, metric_value, metric_unit, category, year, source)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (metric_name, year, month) DO NOTHING
      `, [stat.metric_name, stat.metric_value, stat.metric_unit, stat.category, stat.year, stat.source]);
      
      logger.info(`✅ Village statistic seeded: ${stat.metric_name}`);
    } catch (error) {
      logger.error(`❌ Error seeding village statistic ${stat.metric_name}:`, error.message);
    }
  }
};

// Main seed function
const runSeeding = async () => {
  try {
    logger.info('🌱 Starting database seeding...');
    
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    
    // Run seeding in order
    await seedUsers();
    await seedVillageOfficials();
    await seedNews();
    await seedAnnouncements();
    await seedUMKM();
    await seedVillageStatistics();
    
    logger.info('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    logger.error('❌ Seeding process failed:', error.message);
    process.exit(1);
  }
};

// CLI interface
if (require.main === module) {
  runSeeding();
}

module.exports = {
  runSeeding,
  seedUsers,
  seedVillageOfficials,
  seedNews,
  seedAnnouncements,
  seedUMKM,
  seedVillageStatistics
};
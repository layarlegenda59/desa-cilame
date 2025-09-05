#!/usr/bin/env node

/**
 * Script untuk debugging masalah UMKM API di production
 * Mendiagnosis koneksi dan konfigurasi
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Fungsi untuk melakukan HTTP request
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const timeout = options.timeout || 10000;
    
    const req = protocol.get(url, { timeout }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
          url: url
        });
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
}

// Fungsi untuk test endpoint
async function testEndpoint(name, url) {
  console.log(`\n🔍 Testing ${name}: ${url}`);
  
  try {
    const startTime = Date.now();
    const response = await makeRequest(url);
    const duration = Date.now() - startTime;
    
    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   ⏱️  Duration: ${duration}ms`);
    
    if (response.status === 200) {
      try {
        const jsonData = JSON.parse(response.data);
        if (jsonData.success !== undefined) {
          console.log(`   📊 Success: ${jsonData.success}`);
          if (jsonData.data && Array.isArray(jsonData.data)) {
            console.log(`   📈 Data count: ${jsonData.data.length}`);
          }
        }
      } catch (e) {
        console.log(`   📄 Response: ${response.data.substring(0, 100)}...`);
      }
    } else {
      console.log(`   ❌ Error response: ${response.data.substring(0, 200)}`);
    }
    
    return { success: true, status: response.status, duration };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Fungsi untuk check konfigurasi
function checkConfiguration() {
  console.log('\n📋 Checking Configuration...');
  console.log('=' .repeat(50));
  
  // Check .env.production
  const envPath = path.join(__dirname, '.env.production');
  if (fs.existsSync(envPath)) {
    console.log('✅ .env.production exists');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const umkmUrl = envContent.match(/NEXT_PUBLIC_UMKM_API_URL=(.+)/);
    if (umkmUrl) {
      console.log(`   🔗 UMKM API URL: ${umkmUrl[1]}`);
    } else {
      console.log('   ⚠️  NEXT_PUBLIC_UMKM_API_URL not found');
    }
  } else {
    console.log('❌ .env.production not found');
  }
  
  // Check nginx config
  const nginxPath = path.join(__dirname, 'nginx', 'nginx.conf');
  if (fs.existsSync(nginxPath)) {
    console.log('✅ nginx.conf exists');
    const nginxContent = fs.readFileSync(nginxPath, 'utf8');
    
    if (nginxContent.includes('location /api/umkm')) {
      console.log('   ✅ UMKM API route configured in Nginx');
    } else {
      console.log('   ❌ UMKM API route not found in Nginx config');
    }
  } else {
    console.log('❌ nginx.conf not found');
  }
  
  // Check ecosystem.config.js
  const ecosystemPath = path.join(__dirname, 'ecosystem.config.js');
  if (fs.existsSync(ecosystemPath)) {
    console.log('✅ ecosystem.config.js exists');
  } else {
    console.log('❌ ecosystem.config.js not found');
  }
}

// Main diagnostic function
async function runDiagnostics() {
  console.log('🚀 UMKM API Production Diagnostics');
  console.log('=' .repeat(50));
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  
  // Check configuration
  checkConfiguration();
  
  console.log('\n🌐 Testing Endpoints...');
  console.log('=' .repeat(50));
  
  const results = [];
  
  // Test production endpoints
  results.push(await testEndpoint('Production UMKM API', 'https://desacilame.com/api/umkm'));
  results.push(await testEndpoint('Production Health Check', 'https://desacilame.com/health'));
  results.push(await testEndpoint('Production Main Site', 'https://desacilame.com'));
  
  // Test direct backend (if accessible)
  results.push(await testEndpoint('Direct Backend UMKM (5001)', 'http://localhost:5001/api/umkm'));
  results.push(await testEndpoint('Direct Backend Health (5001)', 'http://localhost:5001/health'));
  
  // Test other backend services
  results.push(await testEndpoint('Main Backend (5000)', 'http://localhost:5000/health'));
  results.push(await testEndpoint('Admin Backend (5002)', 'http://localhost:5002/health'));
  results.push(await testEndpoint('Location Backend (5003)', 'http://localhost:5003/health'));
  
  // Summary
  console.log('\n📊 Summary');
  console.log('=' .repeat(50));
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Successful tests: ${successful}/${total}`);
  console.log(`❌ Failed tests: ${total - successful}/${total}`);
  
  if (successful < total) {
    console.log('\n🔧 Recommended Actions:');
    
    const failedProduction = results.filter(r => !r.success && r.error);
    if (failedProduction.length > 0) {
      console.log('1. Check if backend services are running: pm2 status');
      console.log('2. Check backend logs: pm2 logs');
      console.log('3. Restart services: pm2 restart ecosystem.config.js');
      console.log('4. Check Nginx status: sudo systemctl status nginx');
      console.log('5. Check Nginx error logs: sudo tail -f /var/log/nginx/error.log');
    }
  } else {
    console.log('\n🎉 All tests passed! The issue might be intermittent or resolved.');
  }
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    results: results,
    summary: {
      total: total,
      successful: successful,
      failed: total - successful
    }
  };
  
  const reportPath = path.join(__dirname, 'umkm-diagnostic-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

// Run diagnostics
runDiagnostics().catch(error => {
  console.error('❌ Diagnostic failed:', error);
  process.exit(1);
});
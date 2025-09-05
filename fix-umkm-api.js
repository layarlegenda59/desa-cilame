#!/usr/bin/env node

/**
 * Script untuk memperbaiki masalah API UMKM di production
 * Mengatasi error: "Failed to fetch UMKM data"
 */

const fs = require('fs');
const path = require('path');

// Fungsi untuk membaca file
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

// Fungsi untuk menulis file
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error writing file ${filePath}:`, error.message);
    return false;
  }
}

// 1. Update API route untuk menambahkan timeout dan retry logic
function updateApiRoute() {
  const apiRoutePath = path.join(__dirname, 'app', 'api', 'umkm', 'route.ts');
  
  const updatedContent = `import { NextRequest, NextResponse } from 'next/server';
import { getApiEndpoint } from '@/lib/api-config';

const BACKEND_URL = getApiEndpoint('umkm').replace('/api', '');

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Retry function with exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response;
      }
      
      // If it's the last retry or a client error, throw
      if (i === maxRetries - 1 || response.status < 500) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }
    } catch (error) {
      console.error(\`Attempt \${i + 1} failed:\`, error);
      
      // If it's the last retry, throw the error
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  
  throw new Error('Max retries exceeded');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    console.log(\`Fetching UMKM data from: \${BACKEND_URL}/api/umkm\`);
    
    const response = await fetchWithRetry(\`\${BACKEND_URL}/api/umkm\${queryString ? \`?\${queryString}\` : ''}\`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
    });

    const data = await response.json();
    
    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from backend');
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching UMKM data:', error);
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch UMKM data',
        details: errorMessage,
        timestamp: new Date().toISOString(),
        backend_url: BACKEND_URL
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetchWithRetry(\`\${BACKEND_URL}/api/umkm\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating UMKM:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to create UMKM',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
`;

  return writeFile(apiRoutePath, updatedContent);
}

// 2. Update api-config.ts untuk production
function updateApiConfig() {
  const configPath = path.join(__dirname, 'lib', 'api-config.ts');
  const currentContent = readFile(configPath);
  
  if (!currentContent) return false;
  
  // Update untuk production environment
  const updatedContent = currentContent.replace(
    /export const API_ENDPOINTS = {[\s\S]*?};/,
    `export const API_ENDPOINTS = {
  main: process.env.NEXT_PUBLIC_MAIN_API_URL || (typeof window !== 'undefined' ? \`\${window.location.origin}/api/main\` : 'https://desacilame.com/api/main'),
  umkm: process.env.NEXT_PUBLIC_UMKM_API_URL || (typeof window !== 'undefined' ? \`\${window.location.origin}/api/umkm\` : 'https://desacilame.com/api/umkm'),
  admin: process.env.NEXT_PUBLIC_ADMIN_API_URL || (typeof window !== 'undefined' ? \`\${window.location.origin}/api/admin\` : 'https://desacilame.com/api/admin'),
  location: process.env.NEXT_PUBLIC_LOCATION_API_URL || (typeof window !== 'undefined' ? \`\${window.location.origin}/api/location\` : 'https://desacilame.com/api/location')
};`
  );
  
  return writeFile(configPath, updatedContent);
}

// 3. Buat script deployment untuk memastikan backend berjalan
function createDeploymentScript() {
  const scriptPath = path.join(__dirname, 'scripts', 'fix-production.sh');
  
  // Buat direktori scripts jika belum ada
  const scriptsDir = path.dirname(scriptPath);
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }
  
  const scriptContent = `#!/bin/bash

# Script untuk memperbaiki masalah UMKM API di production

echo "🔧 Memperbaiki masalah UMKM API di production..."

# 1. Restart backend services
echo "📡 Restarting backend services..."
pm2 restart ecosystem.config.js

# 2. Check if services are running
echo "🔍 Checking service status..."
pm2 status

# 3. Test API endpoints
echo "🧪 Testing API endpoints..."

# Test main API
echo "Testing main API (port 5000)..."
curl -f http://localhost:5000/health || echo "❌ Main API not responding"

# Test UMKM API
echo "Testing UMKM API (port 5001)..."
curl -f http://localhost:5001/health || echo "❌ UMKM API not responding"

# Test admin API
echo "Testing admin API (port 5002)..."
curl -f http://localhost:5002/health || echo "❌ Admin API not responding"

# Test location API
echo "Testing location API (port 5003)..."
curl -f http://localhost:5003/health || echo "❌ Location API not responding"

# 4. Test UMKM endpoint specifically
echo "🎯 Testing UMKM endpoint..."
curl -f http://localhost:5001/api/umkm || echo "❌ UMKM endpoint not responding"

# 5. Check Nginx configuration
echo "🌐 Testing Nginx configuration..."
nginx -t && echo "✅ Nginx config is valid" || echo "❌ Nginx config has errors"

# 6. Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

# 7. Test external access
echo "🌍 Testing external access..."
curl -f https://desacilame.com/api/umkm || echo "❌ External UMKM API not accessible"

echo "✅ Production fix script completed!"
echo "📊 Check PM2 logs for more details: pm2 logs"
`;

  return writeFile(scriptPath, scriptContent);
}

// 4. Update frontend UMKM page dengan better error handling
function updateUmkmPage() {
  const umkmPagePath = path.join(__dirname, 'app', 'umkm', 'page.tsx');
  const currentContent = readFile(umkmPagePath);
  
  if (!currentContent) return false;
  
  // Update fetchUmkmData function dengan better error handling
  const updatedContent = currentContent.replace(
    /const fetchUmkmData = async \(\) => {[\s\S]*?};/,
    `const fetchUmkmData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Tambahkan timestamp untuk cache busting
      const timestamp = new Date().getTime();
      
      console.log('Fetching UMKM data...');
      
      const response = await fetch(\`/api/umkm?t=\${timestamp}\`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || \`HTTP \${response.status}: \${response.statusText}\`);
      }
      
      const result = await response.json();
      
      if (!result || !result.data) {
        throw new Error('Invalid response format: missing data field');
      }
      
      const data = result.data || [];
      
      // Filter hanya UMKM yang aktif untuk halaman publik
      const activeUmkm = data.filter((umkm: UMKM) => umkm.status === 'active');
      
      console.log(\`Successfully loaded \${activeUmkm.length} active UMKM\`);
      setUmkmData(activeUmkm);
      
    } catch (error) {
      console.error('Error fetching UMKM:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(\`Gagal memuat data UMKM: \${errorMessage}\`);
      
      // Fallback: set empty array to prevent UI crashes
      setUmkmData([]);
    } finally {
      setIsLoading(false);
    }
  };`
  );
  
  return writeFile(umkmPagePath, updatedContent);
}

// Main execution
console.log('🚀 Starting UMKM API fix...');
console.log('='.repeat(50));

let success = true;

// Update files
if (!updateApiRoute()) success = false;
if (!updateApiConfig()) success = false;
if (!createDeploymentScript()) success = false;
if (!updateUmkmPage()) success = false;

console.log('='.repeat(50));

if (success) {
  console.log('✅ All fixes applied successfully!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Deploy the updated code to production');
  console.log('2. Run the production fix script: bash scripts/fix-production.sh');
  console.log('3. Monitor the logs: pm2 logs');
  console.log('4. Test the UMKM API: https://desacilame.com/api/umkm');
} else {
  console.log('❌ Some fixes failed. Please check the errors above.');
  process.exit(1);
}
#!/usr/bin/env node

/**
 * Database Connectivity Test for desacilame.com
 * Tests all database servers and frontend connectivity
 * Uses native Node.js http/https modules (no external dependencies)
 */

const http = require('http');
const https = require('https');

const databases = [
    { name: 'Main Database', url: 'http://localhost:5000/health', port: 5000 },
    { name: 'UMKM Database', url: 'http://localhost:5001/health', port: 5001 },
    { name: 'Admin Database', url: 'http://localhost:5002/health', port: 5002 },
    { name: 'Location Database', url: 'http://localhost:5003/health', port: 5003 },
    { name: 'Frontend Application', url: 'http://localhost:3003', port: 3003 }
];

const externalTests = [
    { name: 'Website (desacilame.com)', url: 'https://desacilame.com' },
    { name: 'Main API (External)', url: 'https://desacilame.com:5000/health' },
    { name: 'UMKM API (External)', url: 'https://desacilame.com:5001/health' }
];

function makeRequest(url, timeout = 5000) {
    return new Promise((resolve) => {
        const isHttps = url.startsWith('https');
        const client = isHttps ? https : http;
        const urlObj = new URL(url);
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            timeout: timeout,
            headers: {
                'User-Agent': 'Database-Connectivity-Test/1.0'
            }
        };
        
        const startTime = Date.now();
        
        const req = client.request(options, (res) => {
            const responseTime = Date.now() - startTime;
            let data = '';
            
            res.on('data', chunk => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    success: true,
                    statusCode: res.statusCode,
                    responseTime,
                    data: data.substring(0, 200) // Limit data size
                });
            });
        });
        
        req.on('error', (error) => {
            resolve({
                success: false,
                error: error.message,
                responseTime: Date.now() - startTime
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                success: false,
                error: 'Request timeout',
                responseTime: timeout
            });
        });
        
        req.end();
    });
}

async function testLocalConnections() {
    console.log('🔍 Testing Local Database Connections...\n');
    
    let healthyCount = 0;
    
    for (const db of databases) {
        try {
            const result = await makeRequest(db.url, 3000);
            
            if (result.success && result.statusCode >= 200 && result.statusCode < 300) {
                console.log(`✅ ${db.name} (Port ${db.port}): Connected (${result.responseTime}ms)`);
                
                // Try to parse health data if available
                if (db.url.includes('/health') && result.data) {
                    try {
                        const healthData = JSON.parse(result.data);
                        if (healthData.status) {
                            console.log(`   Status: ${healthData.status}`);
                        }
                    } catch (e) {
                        // Ignore JSON parse errors
                    }
                }
                healthyCount++;
            } else {
                console.log(`❌ ${db.name} (Port ${db.port}): HTTP ${result.statusCode || 'Error'}`);
                if (result.error) {
                    console.log(`   Error: ${result.error}`);
                }
            }
        } catch (error) {
            console.log(`❌ ${db.name} (Port ${db.port}): ${error.message}`);
        }
    }
    
    console.log(`\n📊 Local Status: ${healthyCount}/${databases.length} services healthy\n`);
    return healthyCount;
}

async function testExternalConnections() {
    console.log('🌐 Testing External Connectivity...\n');
    
    let externalHealthy = 0;
    
    for (const test of externalTests) {
        try {
            const result = await makeRequest(test.url, 10000);
            
            if (result.success && result.statusCode >= 200 && result.statusCode < 400) {
                console.log(`✅ ${test.name}: Accessible (${result.responseTime}ms)`);
                externalHealthy++;
            } else {
                console.log(`❌ ${test.name}: HTTP ${result.statusCode || 'Error'}`);
                if (result.error) {
                    console.log(`   Error: ${result.error}`);
                }
            }
        } catch (error) {
            console.log(`❌ ${test.name}: ${error.message}`);
        }
    }
    
    console.log(`\n📊 External Status: ${externalHealthy}/${externalTests.length} endpoints accessible\n`);
    return externalHealthy;
}

async function checkSystemInfo() {
    console.log('ℹ️  System Information:\n');
    console.log(`Node.js Version: ${process.version}`);
    console.log(`Platform: ${process.platform}`);
    console.log(`Architecture: ${process.arch}`);
    console.log(`Working Directory: ${process.cwd()}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
}

async function main() {
    console.log('🚀 Database Connectivity Test for desacilame.com');
    console.log('================================================\n');
    
    await checkSystemInfo();
    
    const localHealthy = await testLocalConnections();
    const externalHealthy = await testExternalConnections();
    
    console.log('📋 Summary Report:');
    console.log('==================');
    console.log(`Local Services: ${localHealthy}/${databases.length} healthy`);
    console.log(`External Access: ${externalHealthy}/${externalTests.length} accessible`);
    
    if (localHealthy === databases.length && externalHealthy > 0) {
        console.log('\n🎉 All systems operational!');
        console.log('✅ Database connectivity is working correctly');
        console.log('✅ Website is accessible externally');
    } else {
        console.log('\n⚠️  Issues detected:');
        
        if (localHealthy < databases.length) {
            console.log('❌ Some local database services are not responding');
            console.log('   → Check PM2 status: pm2 status');
            console.log('   → Check service logs: pm2 logs');
            console.log('   → Restart services: pm2 restart all');
        }
        
        if (externalHealthy === 0) {
            console.log('❌ External connectivity issues');
            console.log('   → Check firewall settings');
            console.log('   → Verify DNS configuration');
            console.log('   → Check web server configuration');
        }
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('   • PM2 status: pm2 status');
    console.log('   • View logs: pm2 logs');
    console.log('   • Restart all: pm2 restart all');
    console.log('   • Health dashboard: https://desacilame.com/health');
    
    process.exit(localHealthy < databases.length ? 1 : 0);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n⚠️  Test interrupted by user');
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('\n⚠️  Test terminated');
    process.exit(1);
});

// Run the test
main().catch(error => {
    console.error('💥 Test failed with error:', error.message);
    process.exit(1);
});
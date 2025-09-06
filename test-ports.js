#!/usr/bin/env node

/**
 * Port Connectivity Test for CloudPanel Deployment
 * Tests if all required ports are accessible
 */

const http = require('http');
const net = require('net');

const PORTS = [3003, 5000, 5001, 5002, 5003];
const HOST = 'localhost';

function testPort(port) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        
        socket.setTimeout(3000);
        
        socket.on('connect', () => {
            socket.destroy();
            resolve({ port, status: 'open', error: null });
        });
        
        socket.on('timeout', () => {
            socket.destroy();
            resolve({ port, status: 'timeout', error: 'Connection timeout' });
        });
        
        socket.on('error', (error) => {
            socket.destroy();
            resolve({ port, status: 'closed', error: error.message });
        });
        
        socket.connect(port, HOST);
    });
}

function testHttpHealth(port) {
    return new Promise((resolve) => {
        const options = {
            hostname: HOST,
            port: port,
            path: port === 3003 ? '/' : '/health',
            method: 'GET',
            timeout: 5000
        };
        
        const req = http.request(options, (res) => {
            resolve({
                port,
                status: 'http_ok',
                statusCode: res.statusCode,
                error: null
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                port,
                status: 'http_timeout',
                statusCode: null,
                error: 'HTTP request timeout'
            });
        });
        
        req.on('error', (error) => {
            resolve({
                port,
                status: 'http_error',
                statusCode: null,
                error: error.message
            });
        });
        
        req.end();
    });
}

async function runTests() {
    console.log('🔍 Testing CloudPanel port connectivity...\n');
    
    // Test port connectivity
    console.log('📡 Testing port connectivity:');
    const portResults = await Promise.all(PORTS.map(testPort));
    
    portResults.forEach(result => {
        const status = result.status === 'open' ? '✅' : '❌';
        const service = getServiceName(result.port);
        console.log(`${status} Port ${result.port} (${service}): ${result.status}`);
        if (result.error) {
            console.log(`   Error: ${result.error}`);
        }
    });
    
    console.log('\n📋 Testing HTTP health endpoints:');
    
    // Test HTTP health for ports that are open
    const openPorts = portResults.filter(r => r.status === 'open').map(r => r.port);
    
    if (openPorts.length > 0) {
        const httpResults = await Promise.all(openPorts.map(testHttpHealth));
        
        httpResults.forEach(result => {
            const status = result.statusCode && result.statusCode < 400 ? '✅' : '❌';
            const service = getServiceName(result.port);
            console.log(`${status} ${service} (${result.port}): HTTP ${result.statusCode || 'N/A'}`);
            if (result.error) {
                console.log(`   Error: ${result.error}`);
            }
        });
    } else {
        console.log('❌ No ports are open for HTTP testing');
    }
    
    // Summary
    console.log('\n📊 Summary:');
    const openCount = portResults.filter(r => r.status === 'open').length;
    const healthyCount = openPorts.length;
    
    console.log(`Ports accessible: ${openCount}/${PORTS.length}`);
    console.log(`Services healthy: ${healthyCount}/${openPorts.length}`);
    
    if (openCount === PORTS.length) {
        console.log('\n🎉 All ports are accessible! CloudPanel deployment should work correctly.');
    } else {
        console.log('\n⚠️  Some ports are not accessible. Check your deployment and firewall settings.');
        console.log('\nTroubleshooting:');
        console.log('1. Make sure all services are running: pm2 status');
        console.log('2. Check if processes are listening on ports: netstat -tlnp');
        console.log('3. Verify firewall settings allow these ports');
        console.log('4. Restart services: pm2 restart all');
    }
    
    return {
        portsOpen: openCount,
        servicesHealthy: healthyCount,
        total: PORTS.length,
        allPortsOpen: openCount === PORTS.length
    };
}

function getServiceName(port) {
    const serviceMap = {
        3003: 'Frontend (Next.js)',
        5000: 'Main Database Server',
        5001: 'UMKM Database Server', 
        5002: 'Admin Database Server',
        5003: 'Location Database Server'
    };
    return serviceMap[port] || 'Unknown Service';
}

// Run tests if called directly
if (require.main === module) {
    runTests().catch(error => {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    });
}

module.exports = { runTests, testPort, testHttpHealth };
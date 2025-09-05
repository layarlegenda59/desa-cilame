#!/usr/bin/env node

/**
 * Health Check Script for Desa Cilame Website
 * Monitors all services and sends alerts if any service is down
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

// Configuration
const CONFIG = {
    services: [
        { name: 'Frontend', url: 'http://localhost:3000', timeout: 10000 },
        { name: 'Main DB Server', url: 'http://localhost:5000/health', timeout: 5000 },
        { name: 'UMKM DB Server', url: 'http://localhost:5001/health', timeout: 5000 },
        { name: 'Admin DB Server', url: 'http://localhost:5002/health', timeout: 5000 },
        { name: 'Location DB Server', url: 'http://localhost:5003/health', timeout: 5000 }
    ],
    website: {
        name: 'Website',
        url: process.env.WEBSITE_URL || 'https://your-domain.com',
        timeout: 15000
    },
    logFile: process.env.LOG_DIR ? path.join(process.env.LOG_DIR, 'health-check.log') : './logs/health-check.log',
    alertThreshold: 3, // Number of consecutive failures before alert
    checkInterval: 30000, // 30 seconds
    email: {
        enabled: process.env.EMAIL_ALERTS === 'true',
        smtp: {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        to: process.env.ALERT_EMAIL || 'admin@your-domain.com',
        from: process.env.FROM_EMAIL || 'noreply@your-domain.com'
    },
    slack: {
        enabled: process.env.SLACK_ALERTS === 'true',
        webhookUrl: process.env.SLACK_WEBHOOK_URL
    }
};

// State tracking
const serviceStates = new Map();
const failureCounts = new Map();

// Initialize service states
CONFIG.services.forEach(service => {
    serviceStates.set(service.name, { status: 'unknown', lastCheck: null, responseTime: 0 });
    failureCounts.set(service.name, 0);
});

// Utility functions
function log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level: level.toUpperCase(),
        message,
        data,
        hostname: os.hostname(),
        pid: process.pid
    };
    
    const logLine = `[${timestamp}] ${level.toUpperCase()}: ${message}${data ? ' ' + JSON.stringify(data) : ''}\n`;
    
    // Console output
    console.log(logLine.trim());
    
    // File output
    try {
        const logDir = path.dirname(CONFIG.logFile);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        fs.appendFileSync(CONFIG.logFile, logLine);
    } catch (error) {
        console.error('Failed to write to log file:', error.message);
    }
}

function makeRequest(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const protocol = url.startsWith('https:') ? https : http;
        
        const req = protocol.get(url, { timeout }, (res) => {
            const responseTime = Date.now() - startTime;
            let data = '';
            
            res.on('data', chunk => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    responseTime,
                    data: data.substring(0, 1000) // Limit data size
                });
            });
        });
        
        req.on('error', (error) => {
            reject({
                error: error.message,
                responseTime: Date.now() - startTime
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            reject({
                error: 'Request timeout',
                responseTime: timeout
            });
        });
    });
}

async function checkService(service) {
    try {
        const result = await makeRequest(service.url, service.timeout);
        
        if (result.statusCode >= 200 && result.statusCode < 300) {
            serviceStates.set(service.name, {
                status: 'healthy',
                lastCheck: new Date(),
                responseTime: result.responseTime,
                statusCode: result.statusCode
            });
            
            // Reset failure count on success
            failureCounts.set(service.name, 0);
            
            log('info', `${service.name} is healthy`, {
                responseTime: result.responseTime,
                statusCode: result.statusCode
            });
            
            return true;
        } else {
            throw new Error(`HTTP ${result.statusCode}`);
        }
    } catch (error) {
        const currentFailures = failureCounts.get(service.name) + 1;
        failureCounts.set(service.name, currentFailures);
        
        serviceStates.set(service.name, {
            status: 'unhealthy',
            lastCheck: new Date(),
            responseTime: error.responseTime || 0,
            error: error.error || error.message
        });
        
        log('error', `${service.name} is unhealthy`, {
            error: error.error || error.message,
            responseTime: error.responseTime,
            failureCount: currentFailures
        });
        
        // Send alert if threshold reached
        if (currentFailures >= CONFIG.alertThreshold) {
            await sendAlert(service.name, error.error || error.message, currentFailures);
        }
        
        return false;
    }
}

async function checkWebsite() {
    try {
        const result = await makeRequest(CONFIG.website.url, CONFIG.website.timeout);
        
        if (result.statusCode >= 200 && result.statusCode < 400) {
            log('info', `Website is accessible`, {
                responseTime: result.responseTime,
                statusCode: result.statusCode
            });
            return true;
        } else {
            throw new Error(`HTTP ${result.statusCode}`);
        }
    } catch (error) {
        log('error', `Website is not accessible`, {
            error: error.error || error.message,
            responseTime: error.responseTime
        });
        return false;
    }
}

async function getSystemMetrics() {
    const metrics = {
        timestamp: new Date().toISOString(),
        cpu: {
            loadAverage: os.loadavg(),
            usage: await getCpuUsage()
        },
        memory: {
            total: os.totalmem(),
            free: os.freemem(),
            used: os.totalmem() - os.freemem(),
            usage: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2)
        },
        disk: await getDiskUsage(),
        uptime: os.uptime()
    };
    
    return metrics;
}

function getCpuUsage() {
    return new Promise((resolve) => {
        const startMeasure = process.cpuUsage();
        const startTime = Date.now();
        
        setTimeout(() => {
            const endMeasure = process.cpuUsage(startMeasure);
            const endTime = Date.now();
            const totalTime = (endTime - startTime) * 1000; // Convert to microseconds
            
            const cpuUsage = ((endMeasure.user + endMeasure.system) / totalTime * 100).toFixed(2);
            resolve(parseFloat(cpuUsage));
        }, 1000);
    });
}

function getDiskUsage() {
    return new Promise((resolve) => {
        exec('df -h /', (error, stdout) => {
            if (error) {
                resolve({ error: error.message });
                return;
            }
            
            const lines = stdout.trim().split('\n');
            if (lines.length >= 2) {
                const parts = lines[1].split(/\s+/);
                resolve({
                    total: parts[1],
                    used: parts[2],
                    available: parts[3],
                    usage: parts[4]
                });
            } else {
                resolve({ error: 'Unable to parse disk usage' });
            }
        });
    });
}

async function sendAlert(serviceName, error, failureCount) {
    const alertMessage = `🚨 ALERT: ${serviceName} has been down for ${failureCount} consecutive checks.\nError: ${error}\nTime: ${new Date().toISOString()}`;
    
    log('warn', `Sending alert for ${serviceName}`, { error, failureCount });
    
    // Email alert
    if (CONFIG.email.enabled && CONFIG.email.smtp.user && CONFIG.email.smtp.pass) {
        try {
            await sendEmailAlert(alertMessage, serviceName);
        } catch (emailError) {
            log('error', 'Failed to send email alert', { error: emailError.message });
        }
    }
    
    // Slack alert
    if (CONFIG.slack.enabled && CONFIG.slack.webhookUrl) {
        try {
            await sendSlackAlert(alertMessage, serviceName);
        } catch (slackError) {
            log('error', 'Failed to send Slack alert', { error: slackError.message });
        }
    }
}

async function sendEmailAlert(message, serviceName) {
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
        host: CONFIG.email.smtp.host,
        port: CONFIG.email.smtp.port,
        secure: CONFIG.email.smtp.port === 465,
        auth: {
            user: CONFIG.email.smtp.user,
            pass: CONFIG.email.smtp.pass
        }
    });
    
    const mailOptions = {
        from: CONFIG.email.from,
        to: CONFIG.email.to,
        subject: `🚨 Desa Cilame Alert: ${serviceName} Down`,
        text: message,
        html: `<pre>${message}</pre>`
    };
    
    await transporter.sendMail(mailOptions);
    log('info', 'Email alert sent successfully');
}

async function sendSlackAlert(message, serviceName) {
    const payload = {
        text: `🚨 Desa Cilame Alert: ${serviceName} Down`,
        attachments: [
            {
                color: 'danger',
                text: message,
                ts: Math.floor(Date.now() / 1000)
            }
        ]
    };
    
    const result = await makeRequest(CONFIG.slack.webhookUrl, 10000, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    
    if (result.statusCode === 200) {
        log('info', 'Slack alert sent successfully');
    } else {
        throw new Error(`Slack API returned ${result.statusCode}`);
    }
}

async function generateHealthReport() {
    const metrics = await getSystemMetrics();
    const serviceStatuses = Array.from(serviceStates.entries()).map(([name, state]) => ({
        name,
        ...state
    }));
    
    const report = {
        timestamp: new Date().toISOString(),
        overall: {
            healthy: serviceStatuses.filter(s => s.status === 'healthy').length,
            unhealthy: serviceStatuses.filter(s => s.status === 'unhealthy').length,
            total: serviceStatuses.length
        },
        services: serviceStatuses,
        system: metrics
    };
    
    // Save report to file
    const reportFile = path.join(path.dirname(CONFIG.logFile), 'health-report.json');
    try {
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    } catch (error) {
        log('error', 'Failed to save health report', { error: error.message });
    }
    
    return report;
}

async function runHealthCheck() {
    log('info', 'Starting health check cycle');
    
    const results = await Promise.allSettled([
        ...CONFIG.services.map(service => checkService(service)),
        checkWebsite()
    ]);
    
    const healthyServices = results.slice(0, -1).filter(result => 
        result.status === 'fulfilled' && result.value === true
    ).length;
    
    const websiteHealthy = results[results.length - 1].status === 'fulfilled' && 
                          results[results.length - 1].value === true;
    
    log('info', 'Health check cycle completed', {
        healthyServices,
        totalServices: CONFIG.services.length,
        websiteHealthy
    });
    
    // Generate and log health report
    const report = await generateHealthReport();
    
    // Check for critical system metrics
    if (report.system.memory.usage > 90) {
        log('warn', 'High memory usage detected', { usage: report.system.memory.usage });
    }
    
    if (report.system.disk.usage && parseFloat(report.system.disk.usage) > 90) {
        log('warn', 'High disk usage detected', { usage: report.system.disk.usage });
    }
    
    return report;
}

// Main execution
async function main() {
    log('info', 'Health check service starting', {
        services: CONFIG.services.length,
        checkInterval: CONFIG.checkInterval,
        alertThreshold: CONFIG.alertThreshold
    });
    
    // Initial health check
    await runHealthCheck();
    
    // Schedule periodic health checks
    setInterval(async () => {
        try {
            await runHealthCheck();
        } catch (error) {
            log('error', 'Health check cycle failed', { error: error.message });
        }
    }, CONFIG.checkInterval);
    
    // Graceful shutdown
    process.on('SIGINT', () => {
        log('info', 'Health check service stopping');
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        log('info', 'Health check service stopping');
        process.exit(0);
    });
}

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error('Failed to start health check service:', error);
        process.exit(1);
    });
}

module.exports = {
    runHealthCheck,
    generateHealthReport,
    checkService,
    getSystemMetrics
};
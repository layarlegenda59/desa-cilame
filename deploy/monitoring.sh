#!/bin/bash

# Desa Cilame Monitoring Script
# Author: DevOps Engineer
# Description: Comprehensive monitoring script for production environment

set -e

# Configuration
APP_NAME="desa-cilame"
LOG_DIR="/var/log/monitoring"
ALERT_EMAIL="admin@desacilame.com"  # Update with your email
SLACK_WEBHOOK=""  # Add your Slack webhook URL if needed
THRESHOLD_CPU=80
THRESHOLD_MEMORY=80
THRESHOLD_DISK=85
THRESHOLD_RESPONSE_TIME=5000  # milliseconds

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create log directory
mkdir -p "$LOG_DIR"

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_DIR/monitoring.log"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_DIR/monitoring.log"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_DIR/monitoring.log"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_DIR/monitoring.log"
}

# Send alert function
send_alert() {
    local subject="$1"
    local message="$2"
    local severity="$3"
    
    # Log alert
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ALERT [$severity]: $subject - $message" >> "$LOG_DIR/alerts.log"
    
    # Send email if configured
    if command -v mail &> /dev/null && [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "[$APP_NAME] $subject" "$ALERT_EMAIL"
    fi
    
    # Send Slack notification if configured
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚨 [$APP_NAME] $subject\\n$message\"}" \
            "$SLACK_WEBHOOK" 2>/dev/null || true
    fi
}

# Check system resources
check_system_resources() {
    log "Checking system resources..."
    
    # CPU Usage
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
    CPU_USAGE=${CPU_USAGE%.*}  # Remove decimal part
    
    if [ "$CPU_USAGE" -gt "$THRESHOLD_CPU" ]; then
        warning "High CPU usage: ${CPU_USAGE}%"
        send_alert "High CPU Usage" "CPU usage is ${CPU_USAGE}%, threshold is ${THRESHOLD_CPU}%" "WARNING"
    else
        success "CPU usage: ${CPU_USAGE}%"
    fi
    
    # Memory Usage
    MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    
    if [ "$MEMORY_USAGE" -gt "$THRESHOLD_MEMORY" ]; then
        warning "High memory usage: ${MEMORY_USAGE}%"
        send_alert "High Memory Usage" "Memory usage is ${MEMORY_USAGE}%, threshold is ${THRESHOLD_MEMORY}%" "WARNING"
    else
        success "Memory usage: ${MEMORY_USAGE}%"
    fi
    
    # Disk Usage
    DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ "$DISK_USAGE" -gt "$THRESHOLD_DISK" ]; then
        warning "High disk usage: ${DISK_USAGE}%"
        send_alert "High Disk Usage" "Disk usage is ${DISK_USAGE}%, threshold is ${THRESHOLD_DISK}%" "WARNING"
    else
        success "Disk usage: ${DISK_USAGE}%"
    fi
    
    # Load Average
    LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    log "Load average: $LOAD_AVG"
}

# Check PM2 processes
check_pm2_processes() {
    log "Checking PM2 processes..."
    
    # Get PM2 status
    PM2_STATUS=$(pm2 jlist 2>/dev/null || echo "[]")
    
    if [ "$PM2_STATUS" = "[]" ]; then
        error "No PM2 processes found"
        send_alert "PM2 Processes Down" "No PM2 processes are running" "CRITICAL"
        return 1
    fi
    
    # Check each process
    PROCESSES=("desa-cilame-frontend" "desa-cilame-main-api" "desa-cilame-umkm-api" "desa-cilame-admin-api" "desa-cilame-location-api")
    
    for process in "${PROCESSES[@]}"; do
        STATUS=$(echo "$PM2_STATUS" | jq -r ".[] | select(.name==\"$process\") | .pm2_env.status" 2>/dev/null || echo "not_found")
        
        if [ "$STATUS" = "online" ]; then
            success "$process: online"
        else
            error "$process: $STATUS"
            send_alert "Process Down" "$process is $STATUS" "CRITICAL"
        fi
    done
}

# Check port availability
check_ports() {
    log "Checking port availability..."
    
    PORTS=(3000 5000 5001 5002 5003)
    
    for port in "${PORTS[@]}"; do
        if netstat -tlnp | grep -q ":$port "; then
            success "Port $port: listening"
        else
            error "Port $port: not listening"
            send_alert "Port Not Available" "Port $port is not listening" "CRITICAL"
        fi
    done
}

# Check Nginx status
check_nginx() {
    log "Checking Nginx status..."
    
    if systemctl is-active --quiet nginx; then
        success "Nginx: active"
        
        # Check Nginx configuration
        if nginx -t 2>/dev/null; then
            success "Nginx configuration: valid"
        else
            error "Nginx configuration: invalid"
            send_alert "Nginx Configuration Error" "Nginx configuration test failed" "CRITICAL"
        fi
    else
        error "Nginx: inactive"
        send_alert "Nginx Down" "Nginx service is not running" "CRITICAL"
    fi
}

# Check SSL certificate
check_ssl_certificate() {
    log "Checking SSL certificate..."
    
    DOMAIN="desacilame.com"
    
    # Check certificate expiration
    CERT_EXPIRY=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    
    if [ -n "$CERT_EXPIRY" ]; then
        EXPIRY_TIMESTAMP=$(date -d "$CERT_EXPIRY" +%s)
        CURRENT_TIMESTAMP=$(date +%s)
        DAYS_UNTIL_EXPIRY=$(( (EXPIRY_TIMESTAMP - CURRENT_TIMESTAMP) / 86400 ))
        
        if [ "$DAYS_UNTIL_EXPIRY" -lt 30 ]; then
            warning "SSL certificate expires in $DAYS_UNTIL_EXPIRY days"
            send_alert "SSL Certificate Expiring" "SSL certificate for $DOMAIN expires in $DAYS_UNTIL_EXPIRY days" "WARNING"
        else
            success "SSL certificate: valid for $DAYS_UNTIL_EXPIRY days"
        fi
    else
        error "Could not check SSL certificate"
        send_alert "SSL Certificate Check Failed" "Unable to verify SSL certificate for $DOMAIN" "WARNING"
    fi
}

# Check application response time
check_response_time() {
    log "Checking application response time..."
    
    ENDPOINTS=(
        "https://desacilame.com"
        "https://desacilame.com/api/main/health"
        "https://desacilame.com/api/umkm/health"
        "https://desacilame.com/api/admin/health"
        "https://desacilame.com/api/location/health"
    )
    
    for endpoint in "${ENDPOINTS[@]}"; do
        RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}" "$endpoint" 2>/dev/null || echo "0")
        RESPONSE_TIME_MS=$(echo "$RESPONSE_TIME * 1000" | bc -l | cut -d. -f1)
        
        if [ "$RESPONSE_TIME_MS" -gt "$THRESHOLD_RESPONSE_TIME" ]; then
            warning "$endpoint: ${RESPONSE_TIME_MS}ms (slow)"
            send_alert "Slow Response Time" "$endpoint responded in ${RESPONSE_TIME_MS}ms" "WARNING"
        elif [ "$RESPONSE_TIME_MS" -eq 0 ]; then
            error "$endpoint: unreachable"
            send_alert "Endpoint Unreachable" "$endpoint is not responding" "CRITICAL"
        else
            success "$endpoint: ${RESPONSE_TIME_MS}ms"
        fi
    done
}

# Check database connections (if applicable)
check_database() {
    log "Checking database connections..."
    
    # This is a placeholder - implement based on your database setup
    # Example for MongoDB:
    # if command -v mongo &> /dev/null; then
    #     if mongo --eval "db.adminCommand('ismaster')" &>/dev/null; then
    #         success "MongoDB: connected"
    #     else
    #         error "MongoDB: connection failed"
    #         send_alert "Database Connection Failed" "Cannot connect to MongoDB" "CRITICAL"
    #     fi
    # fi
    
    success "Database check: skipped (not configured)"
}

# Check log files for errors
check_logs() {
    log "Checking application logs for errors..."
    
    LOG_FILES=(
        "/var/log/pm2/frontend-error.log"
        "/var/log/pm2/main-api-error.log"
        "/var/log/pm2/umkm-api-error.log"
        "/var/log/pm2/admin-api-error.log"
        "/var/log/pm2/location-api-error.log"
        "/var/log/nginx/error.log"
    )
    
    for log_file in "${LOG_FILES[@]}"; do
        if [ -f "$log_file" ]; then
            # Check for recent errors (last 5 minutes)
            RECENT_ERRORS=$(find "$log_file" -mmin -5 -exec grep -i "error\|exception\|fatal" {} \; 2>/dev/null | wc -l)
            
            if [ "$RECENT_ERRORS" -gt 0 ]; then
                warning "$log_file: $RECENT_ERRORS recent errors found"
                # Get last few error lines
                LAST_ERRORS=$(tail -n 5 "$log_file" | grep -i "error\|exception\|fatal" || echo "No specific errors in last 5 lines")
                send_alert "Application Errors Detected" "$RECENT_ERRORS errors found in $log_file\n\nLast errors:\n$LAST_ERRORS" "WARNING"
            else
                success "$log_file: no recent errors"
            fi
        else
            warning "$log_file: not found"
        fi
    done
}

# Generate monitoring report
generate_report() {
    local report_file="$LOG_DIR/monitoring_report_$(date +%Y%m%d_%H%M%S).json"
    
    cat > "$report_file" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "server": "$(hostname)",
  "uptime": "$(uptime -p)",
  "cpu_usage": "$CPU_USAGE%",
  "memory_usage": "$MEMORY_USAGE%",
  "disk_usage": "$DISK_USAGE%",
  "load_average": "$LOAD_AVG",
  "pm2_processes": $(pm2 jlist 2>/dev/null || echo "[]"),
  "nginx_status": "$(systemctl is-active nginx)",
  "ssl_days_until_expiry": "${DAYS_UNTIL_EXPIRY:-unknown}"
}
EOF
    
    log "Monitoring report saved: $report_file"
}

# Cleanup old logs
cleanup_logs() {
    log "Cleaning up old monitoring logs..."
    
    # Keep logs for 30 days
    find "$LOG_DIR" -name "*.log" -mtime +30 -delete 2>/dev/null || true
    find "$LOG_DIR" -name "*.json" -mtime +7 -delete 2>/dev/null || true
    
    success "Log cleanup completed"
}

# Main monitoring function
main() {
    log "Starting monitoring check for $APP_NAME..."
    
    check_system_resources
    check_pm2_processes
    check_ports
    check_nginx
    check_ssl_certificate
    check_response_time
    check_database
    check_logs
    generate_report
    cleanup_logs
    
    success "Monitoring check completed"
}

# Handle script arguments
case "${1:-}" in
    "system")
        check_system_resources
        ;;
    "processes")
        check_pm2_processes
        ;;
    "network")
        check_ports
        check_nginx
        check_ssl_certificate
        check_response_time
        ;;
    "logs")
        check_logs
        ;;
    "report")
        generate_report
        ;;
    "")
        main
        ;;
    *)
        echo "Usage: $0 [system|processes|network|logs|report]"
        echo "  system    - Check system resources only"
        echo "  processes - Check PM2 processes only"
        echo "  network   - Check network and web services"
        echo "  logs      - Check application logs"
        echo "  report    - Generate monitoring report"
        echo "  (no args) - Full monitoring check"
        exit 1
        ;;
esac
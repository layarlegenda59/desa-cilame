# Multi-stage Dockerfile for Desa Cilame Website
# Optimized for production deployment on Hostinger Cloud Panel

# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force
RUN cd backend && npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    curl \
    bash \
    mysql-client \
    && rm -rf /var/cache/apk/*

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/backend ./backend
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./

# Copy environment files
COPY --chown=nextjs:nodejs .env.production ./.env

# Create necessary directories
RUN mkdir -p /app/uploads /app/logs
RUN chown -R nextjs:nodejs /app/uploads /app/logs

# Expose ports
EXPOSE 3000 5000 5001 5002 5003

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start script
CMD ["npm", "start"]
# ./web/Dockerfile
# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --omit=dev; \
  elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile --production=true; \
  else npm i --omit=dev; fi

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Make sure next.config.js has: output: 'standalone'
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
# Copy minimal standalone server
COPY --from=build /app/.next/standalone ./
# Public/static assets
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static

ENV PORT=3000 HOSTNAME=0.0.0.0 NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
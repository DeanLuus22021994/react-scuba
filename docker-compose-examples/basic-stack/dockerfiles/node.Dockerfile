# Multi-stage Node.js Dockerfile for basic-stack
# Optimized for development with dependency caching and health checks

FROM node:20-alpine AS base
WORKDIR /app

# Install system dependencies for health checks and development
RUN apk add --no-cache curl wget

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nextjs -u 1001

FROM base AS deps
# Copy package files for dependency installation
COPY package*.json ./
# Skip prepare scripts during Docker build
ENV npm_config_ignore_scripts=true
# Install dependencies with legacy peer deps support
RUN npm install --only=production --legacy-peer-deps && npm cache clean --force

FROM base AS dev-deps
# Copy package files for development dependencies
COPY package*.json ./
# Skip prepare scripts during Docker build
ENV npm_config_ignore_scripts=true
# Install all dependencies including dev dependencies
RUN npm install --legacy-peer-deps && npm cache clean --force

FROM dev-deps AS builder
# Copy source code
COPY . .
# Build application if needed (uncomment if you have build scripts)
# RUN npm run build

FROM base AS runner
# Copy installed dependencies from deps stage
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app ./

# Switch to non-root user
USER nextjs

# Health check for React development server
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
  CMD curl -f http://localhost:3000/ || exit 1

EXPOSE 3000

# Default command (can be overridden in docker-compose)
CMD ["npm", "start"]

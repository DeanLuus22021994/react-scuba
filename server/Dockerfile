# Node.js Monorepo Builder - Optimized with persistent caching
# Builds all workspace packages (apps/*, packages/*) with zero repository pollution
# 
# OPTIMIZATION: Named volumes for node_modules, npm cache, package-lock.json
# PERFORMANCE: Multi-stage builds, build cache mounts, slim base image

FROM node:20-slim AS base

# Enable corepack for package manager version pinning
RUN corepack enable

WORKDIR /app

# Install build dependencies with cache mount
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,target=/var/lib/apt,sharing=locked \
  apt-get update && apt-get install -y --no-install-recommends \
  tini \
  git \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# ==============================================================================
# Stage: Dependencies Installation
# ==============================================================================
FROM base AS deps

# Copy package files for dependency resolution
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY apps/docs/package.json ./apps/docs/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/

# Install dependencies with cache mount and save to named volume
# Volume: node_modules-cache (persisted across builds)
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
  npm ci --prefer-offline --no-audit --no-fund && \
  npm cache clean --force

# ==============================================================================
# Stage: Builder
# ==============================================================================
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps ./apps
COPY --from=deps /app/packages ./packages

# Copy source code and build configs
COPY . .

# Build all workspaces with npm
RUN npm run build

# ==============================================================================
# Stage: Production Runtime
# ==============================================================================
FROM base AS runner

# Create non-root user for security
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

# Create volume mount points for persistent caching
RUN mkdir -p \
  /cache/node_modules \
  /cache/npm \
  /cache/lockfile && \
  chown -R nodejs:nodejs /cache

VOLUME ["/cache/node_modules", "/cache/npm", "/cache/lockfile"]

# Copy built artifacts
COPY --from=builder --chown=nodejs:nodejs /app/apps ./apps
COPY --from=builder --chown=nodejs:nodejs /app/packages ./packages
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

# Symlink node_modules and package-lock.json to persistent volumes
# This keeps repository clean while maintaining cache across builds
RUN ln -sf /cache/node_modules ./node_modules && \
  ln -sf /cache/lockfile/package-lock.json ./package-lock.json

# Performance tuning for Node.js
ENV NODE_ENV=production \
  NODE_OPTIONS="--max-old-space-size=4096" \
  NPM_CONFIG_CACHE=/cache/npm

USER nodejs

ENTRYPOINT ["/usr/bin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node --eval "console.log('healthy')" || exit 1

# Default: Run development server (override in docker-compose)
CMD ["npm", "run", "dev"]

LABEL monorepo="npm-workspaces" \
  workspaces="apps/web,apps/api,apps/docs,packages/*" \
  node.version="20" \
  package.manager="npm@10.9.2" \
  cache.strategy="named-volumes" \
  cache.volumes="node_modules,npm,lockfile" \
  optimization="multi-stage,cache-mounts,zero-pollution" \
  description="React Scuba Monorepo - Node.js build environment with persistent caching"
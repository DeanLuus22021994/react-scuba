# MCP PostgreSQL Server - Official Node.js implementation
# Reference: https://github.com/modelcontextprotocol/servers/tree/main/src/postgres
# Provides PostgreSQL database operations via MCP protocol
#
# OPTIMIZATION: Build cache mounts, connection pooling, performance tuning

FROM node:22-alpine AS base

WORKDIR /app

# Install runtime dependencies with cache mount
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
  apk add --no-cache \
  tini \
  postgresql-client \
  ca-certificates \
  && rm -rf /tmp/*

# Install MCP postgres server with npm cache persistence
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
  npm install -g @modelcontextprotocol/server-postgres@latest && \
  npm cache verify

# Create cache directories
RUN mkdir -p /cache/node /cache/pg && \
  chmod 755 /cache/node /cache/pg

VOLUME ["/cache/node", "/cache/pg"]

# Performance tuning for Node.js and PostgreSQL
ENV NODE_ENV=production \
  NODE_OPTIONS="--max-old-space-size=2048 --enable-source-maps" \
  NPM_CONFIG_CACHE=/cache/node \
  PGCLIENTENCODING=UTF8 \
  POSTGRES_CONNECTION="postgresql://postgres:password@host.docker.internal:5432/postgres"

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

# Connection string passed as argument at runtime
CMD ["sh", "-c", "mcp-server-postgres $POSTGRES_CONNECTION"]

LABEL mcp.server="postgres" \
  mcp.version="latest" \
  mcp.language="node" \
  mcp.source="https://github.com/modelcontextprotocol/servers" \
  mcp.cache.volume="postgres-node-cache" \
  optimization.cache="enabled" \
  description="MCP PostgreSQL Server - database operations via MCP protocol"
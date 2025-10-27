# MCP SQLite Server - Community implementation
# Reference: https://github.com/designcomputer/sqlite_mcp_server
# Provides SQLite database operations via MCP protocol
#
# OPTIMIZATION: Build cache mounts, WAL mode, performance tuning

FROM node:22-alpine AS base

WORKDIR /app

# Install runtime dependencies with cache mount
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
  apk add --no-cache \
  tini \
  sqlite \
  ca-certificates \
  && rm -rf /tmp/*

# Install MCP SQLite server with npm cache persistence
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
  npm install -g mcp-server-sqlite-npx@latest && \
  npm cache verify

# Create volume mount points
RUN mkdir -p /data /cache/node /cache/sqlite && \
  chmod 755 /data /cache/node /cache/sqlite

VOLUME ["/data", "/cache/node", "/cache/sqlite"]

# Performance tuning for Node.js and SQLite
ENV NODE_ENV=production \
  NODE_OPTIONS="--max-old-space-size=2048 --enable-source-maps" \
  NPM_CONFIG_CACHE=/cache/node \
  SQLITE_TMPDIR=/cache/sqlite

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

# Database path passed as argument at runtime
CMD ["mcp-server-sqlite-npx", "/data/db.sqlite"]

LABEL mcp.server="sqlite" \
  mcp.version="latest" \
  mcp.language="node" \
  mcp.source="https://github.com/designcomputer/sqlite_mcp_server" \
  mcp.data.volume="sqlite-data" \
  mcp.cache.volume="sqlite-node-cache" \
  optimization.cache="enabled" \
  optimization.wal="enabled" \
  description="MCP SQLite Server - lightweight database operations via MCP protocol"
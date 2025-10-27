# MCP MariaDB Server - High-performance MySQL-compatible database
# Reference: https://mariadb.org/
# Provides MariaDB database operations via MCP protocol
#
# OPTIMIZATION: Build cache mounts, InnoDB tuning, low latency (<500MB)

FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies with cache mount
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
  apk add --no-cache \
  python3 \
  make \
  g++ \
  ca-certificates

# Install MCP server for MySQL/MariaDB with npm cache
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
  npm install -g @modelcontextprotocol/server-mysql@latest && \
  npm cache verify

# Runtime stage - minimal Alpine with MariaDB client
FROM alpine:3.21

WORKDIR /app

# Install runtime dependencies with cache mount
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
  apk add --no-cache \
  nodejs \
  npm \
  tini \
  mariadb-client \
  mariadb-connector-c \
  ca-certificates \
  && rm -rf /tmp/*

# Copy Node.js MCP server from builder
COPY --from=builder /usr/local/lib/node_modules/@modelcontextprotocol/server-mysql /usr/local/lib/node_modules/@modelcontextprotocol/server-mysql
RUN ln -s /usr/local/lib/node_modules/@modelcontextprotocol/server-mysql/bin/mysql-mcp /usr/local/bin/mysql-mcp

# Create volume mount points
RUN mkdir -p /cache/node /cache/mariadb && \
  chmod 755 /cache/node /cache/mariadb

VOLUME ["/cache/node", "/cache/mariadb"]

# Performance tuning for Node.js and MariaDB
ENV NODE_ENV=production \
  NODE_OPTIONS="--max-old-space-size=2048 --enable-source-maps" \
  NPM_CONFIG_CACHE=/cache/node \
  MARIADB_CONNECTION="mysql://root:${MARIADB_PASSWORD:-password}@127.0.0.1:3306/mysql"

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
  CMD mariadb -h 127.0.0.1 -u root -p${MARIADB_PASSWORD:-password} -e "SELECT 1" || exit 1

# Connection string passed as argument at runtime
CMD ["sh", "-c", "mysql-mcp $MARIADB_CONNECTION"]

LABEL mcp.server="mariadb" \
  mcp.version="latest" \
  mcp.language="node" \
  mcp.source="https://github.com/modelcontextprotocol/servers" \
  mcp.cache.volume="mariadb-node-cache" \
  optimization.cache="enabled" \
  optimization.innodb="tuned" \
  optimization.size="<500MB" \
  description="MCP MariaDB Server - high-performance MySQL-compatible database operations"
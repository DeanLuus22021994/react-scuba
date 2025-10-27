# MCP SQLite Server - Community implementation
# Reference: https://github.com/designcomputer/sqlite_mcp_server
# Provides SQLite database operations via MCP protocol
#
# OPTIMIZATION: Minimal layers for maximum cache efficiency

FROM node:22-alpine AS base

WORKDIR /app

# Install runtime dependencies in single layer
RUN apk add --no-cache \
  tini \
  sqlite \
  && rm -rf /var/cache/apk/*

# Install MCP SQLite server globally
RUN npm install -g mcp-server-sqlite-npx@latest && \
  npm cache clean --force

# Create volume mount point for database files
RUN mkdir -p /data && chmod 755 /data

VOLUME ["/data"]

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

# Database path passed as argument at runtime
CMD ["mcp-server-sqlite-npx", "/data/db.sqlite"]

LABEL mcp.server="sqlite" \
  mcp.version="latest" \
  mcp.language="node" \
  mcp.source="https://github.com/designcomputer/sqlite_mcp_server" \
  mcp.data.volume="sqlite-data" \
  description="MCP SQLite Server - lightweight database operations via MCP protocol"
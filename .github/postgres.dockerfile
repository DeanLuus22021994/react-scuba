# MCP PostgreSQL Server - Official Node.js implementation
# Reference: https://github.com/modelcontextprotocol/servers/tree/main/src/postgres
# Provides PostgreSQL database operations via MCP protocol
#
# OPTIMIZATION: Minimal layers for maximum cache efficiency

FROM node:22-alpine AS base

WORKDIR /app

# Install runtime dependencies in single layer
RUN apk add --no-cache \
  tini \
  postgresql-client \
  && rm -rf /var/cache/apk/*

# Install MCP postgres server globally
RUN npm install -g @modelcontextprotocol/server-postgres@latest && \
  npm cache clean --force

# Environment for PostgreSQL connection
# Override at runtime with actual connection string
ENV POSTGRES_CONNECTION="postgresql://postgres:password@host.docker.internal:5432/postgres"

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

# Connection string passed as argument at runtime
CMD ["sh", "-c", "mcp-server-postgres $POSTGRES_CONNECTION"]

LABEL mcp.server="postgres" \
  mcp.version="latest" \
  mcp.language="node" \
  mcp.source="https://github.com/modelcontextprotocol/servers" \
  description="MCP PostgreSQL Server - database operations via MCP protocol"
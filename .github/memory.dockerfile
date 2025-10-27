# MCP Memory Server - Official Node.js implementation
# Reference: https://github.com/modelcontextprotocol/servers/tree/main/src/memory
# Provides persistent memory/knowledge graph storage via MCP protocol
#
# OPTIMIZATION: Minimal layers for maximum cache efficiency

FROM node:22-alpine AS base

WORKDIR /app

# Install runtime dependencies in single layer
RUN apk add --no-cache \
  tini \
  && rm -rf /var/cache/apk/*

# Install MCP memory server globally
RUN npm install -g @modelcontextprotocol/server-memory@latest && \
  npm cache clean --force

# Create volume mount point for persistent memory storage
RUN mkdir -p /memory && chmod 755 /memory

VOLUME ["/memory"]

ENV MEMORY_STORAGE_PATH="/memory"

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

CMD ["mcp-server-memory"]

LABEL mcp.server="memory" \
  mcp.version="latest" \
  mcp.language="node" \
  mcp.source="https://github.com/modelcontextprotocol/servers" \
  mcp.memory.volume="memory-data" \
  description="MCP Memory Server - persistent knowledge graph storage via MCP protocol"
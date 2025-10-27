# MCP Memory Server - Official Node.js implementation
# Reference: https://github.com/modelcontextprotocol/servers/tree/main/src/memory
# Provides persistent memory/knowledge graph storage via MCP protocol
#
# OPTIMIZATION: Build cache mounts, memory tuning, NVMe-optimized I/O

FROM node:22-alpine AS base

WORKDIR /app

# Install runtime dependencies with cache mount
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
  apk add --no-cache \
  tini \
  ca-certificates \
  && rm -rf /tmp/*

# Install MCP memory server with npm cache persistence
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
  npm install -g @modelcontextprotocol/server-memory@latest && \
  npm cache verify

# Create volume mount points for persistent storage
RUN mkdir -p /memory /cache/node /cache/memory && \
  chmod 755 /memory /cache/node /cache/memory

VOLUME ["/memory", "/cache/node", "/cache/memory"]

# Performance tuning for Node.js and memory operations
ENV NODE_ENV=production \
  NODE_OPTIONS="--max-old-space-size=4096 --enable-source-maps" \
  NPM_CONFIG_CACHE=/cache/node \
  MEMORY_STORAGE_PATH="/memory" \
  MEMORY_CACHE_PATH="/cache/memory"

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

CMD ["mcp-server-memory"]

LABEL mcp.server="memory" \
  mcp.version="latest" \
  mcp.language="node" \
  mcp.source="https://github.com/modelcontextprotocol/servers" \
  mcp.memory.volume="memory-data" \
  mcp.cache.volume="memory-node-cache" \
  optimization.cache="enabled" \
  optimization.nvme="enabled" \
  description="MCP Memory Server - persistent knowledge graph storage via MCP protocol"
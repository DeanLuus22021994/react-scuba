# MCP Filesystem Server - Official Node.js implementation
# Reference: https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem
# Provides filesystem operations with configurable allowed directories
#
# OPTIMIZATION: Build cache mounts for instant rebuilds, performance-tuned Node.js

FROM node:22-alpine AS base

WORKDIR /app

# Install runtime dependencies with cache mount
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
  apk add --no-cache \
  tini \
  ca-certificates \
  && rm -rf /tmp/*

# Install MCP filesystem server with npm cache persistence
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
  npm install -g @modelcontextprotocol/server-filesystem@latest && \
  npm cache verify

# Create volume mount points with proper permissions
RUN mkdir -p /workspace /cache/node && \
  chmod 755 /workspace /cache/node

VOLUME ["/workspace", "/cache/node"]

# Performance tuning for Node.js
ENV NODE_ENV=production \
  NODE_OPTIONS="--max-old-space-size=2048 --enable-source-maps" \
  NPM_CONFIG_CACHE=/cache/node

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

# Run filesystem server with workspace directory
CMD ["mcp-server-filesystem", "/workspace"]

LABEL mcp.server="filesystem" \
  mcp.version="latest" \
  mcp.language="node" \
  mcp.source="https://github.com/modelcontextprotocol/servers" \
  mcp.workspace.volume="workspace" \
  mcp.cache.volume="filesystem-node-cache" \
  optimization.cache="enabled" \
  description="MCP Filesystem Server - secure file operations within allowed directories"
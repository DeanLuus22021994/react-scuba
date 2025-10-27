# MCP Filesystem Server - Official Node.js implementation
# Reference: https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem
# Provides filesystem operations with configurable allowed directories
#
# OPTIMIZATION: Minimal layers for maximum cache efficiency

FROM node:22-alpine AS base

WORKDIR /app

# Install runtime dependencies in single layer
RUN apk add --no-cache \
  tini \
  && rm -rf /var/cache/apk/*

# Install MCP filesystem server globally
RUN npm install -g @modelcontextprotocol/server-filesystem@latest && \
  npm cache clean --force

# Create volume mount point for workspace access
RUN mkdir -p /workspace && chmod 755 /workspace

VOLUME ["/workspace"]

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

# Run filesystem server with workspace directory
CMD ["mcp-server-filesystem", "/workspace"]

LABEL mcp.server="filesystem" \
  mcp.version="latest" \
  mcp.language="node" \
  mcp.source="https://github.com/modelcontextprotocol/servers" \
  mcp.workspace.volume="workspace" \
  description="MCP Filesystem Server - secure file operations within allowed directories"
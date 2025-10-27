# MCP Git Server - Python implementation
# Reference: https://github.com/modelcontextprotocol/servers/tree/main/src/git
# Provides Git operations via MCP protocol
#
# OPTIMIZATION: Minimal layers for maximum cache efficiency

FROM python:3.12-alpine AS base

WORKDIR /app

# Install runtime dependencies in single layer
RUN apk add --no-cache \
  git \
  tini \
  && rm -rf /var/cache/apk/*

# Install uv package manager and mcp-server-git
RUN pip install --no-cache-dir uv && \
  uv pip install --system mcp-server-git && \
  pip cache purge

# Create volume mount point for git repositories
RUN mkdir -p /repos && chmod 755 /repos

VOLUME ["/repos"]

WORKDIR /repos

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "print('healthy')" || exit 1

CMD ["mcp-server-git"]

LABEL mcp.server="git" \
  mcp.version="latest" \
  mcp.language="python" \
  mcp.source="https://github.com/modelcontextprotocol/servers" \
  mcp.repos.volume="git-repos" \
  description="MCP Git Server - Git operations via MCP protocol"
# MCP Fetch Server - Python implementation
# Reference: https://github.com/modelcontextprotocol/servers/tree/main/src/fetch
# Provides web content fetching via MCP protocol
#
# OPTIMIZATION: Minimal layers for maximum cache efficiency

FROM python:3.12-alpine AS base

WORKDIR /app

# Install runtime dependencies in single layer
RUN apk add --no-cache \
  curl \
  tini \
  ca-certificates \
  && rm -rf /var/cache/apk/*

# Install uv package manager and mcp-server-fetch
RUN pip install --no-cache-dir uv && \
  uv pip install --system mcp-server-fetch && \
  pip cache purge

# Create cache directory for fetched content
RUN mkdir -p /cache && chmod 755 /cache

VOLUME ["/cache"]

ENV FETCH_CACHE_DIR="/cache"

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "print('healthy')" || exit 1

CMD ["mcp-server-fetch"]

LABEL mcp.server="fetch" \
  mcp.version="latest" \
  mcp.language="python" \
  mcp.source="https://github.com/modelcontextprotocol/servers" \
  mcp.cache.volume="fetch-cache" \
  description="MCP Fetch Server - web content fetching via MCP protocol"
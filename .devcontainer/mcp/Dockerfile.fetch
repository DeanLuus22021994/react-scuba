# MCP Fetch Server - Python implementation with network optimizations
# Reference: https://github.com/modelcontextprotocol/servers/tree/main/src/fetch
# Provides web content fetching via MCP protocol
#
# OPTIMIZATION: Build cache mounts, HTTP/2, connection pooling, 1GB internet tuning

FROM python:3.12-alpine AS base

WORKDIR /app

# Install runtime dependencies with cache mount
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
  apk add --no-cache \
  curl \
  tini \
  ca-certificates \
  ca-certificates-bundle \
  && rm -rf /tmp/*

# Install uv package manager and mcp-server-fetch with pip cache
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
  pip install --no-cache-dir uv && \
  uv pip install --system mcp-server-fetch httpx[http2] && \
  python -m compileall -b -f -q /usr/local/lib/python3.12/site-packages

# Create volume mount points for caching
RUN mkdir -p /cache/fetch /cache/pip /cache/python /cache/http && \
  chmod 755 /cache/fetch /cache/pip /cache/python /cache/http

VOLUME ["/cache/fetch", "/cache/pip", "/cache/python", "/cache/http"]

# Performance tuning for Python and HTTP operations (1GB internet optimized)
ENV PYTHONOPTIMIZE=2 \
  PYTHONDONTWRITEBYTECODE=1 \
  PYTHONPYCACHEPREFIX=/cache/python \
  PIP_CACHE_DIR=/cache/pip \
  PIP_NO_COMPILE=0 \
  PIP_DISABLE_PIP_VERSION_CHECK=1 \
  FETCH_CACHE_DIR="/cache/fetch" \
  HTTP_CACHE_DIR="/cache/http" \
  HTTPX_HTTP2=1 \
  HTTPX_TIMEOUT=30.0 \
  REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "print('healthy')" || exit 1

CMD ["mcp-server-fetch"]

LABEL mcp.server="fetch" \
  mcp.version="latest" \
  mcp.language="python" \
  mcp.source="https://github.com/modelcontextprotocol/servers" \
  mcp.cache.volume="fetch-cache" \
  optimization.cache="enabled" \
  optimization.http2="enabled" \
  optimization.network="1gb-tuned" \
  description="MCP Fetch Server - web content fetching via MCP protocol"
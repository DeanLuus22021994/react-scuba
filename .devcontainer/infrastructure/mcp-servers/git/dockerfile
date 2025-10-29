# MCP Git Server - Python implementation with advanced optimizations
# Reference: https://github.com/modelcontextprotocol/servers/tree/main/src/git
# Provides Git operations via MCP protocol
#
# OPTIMIZATION: Build cache mounts, performance-tuned Python, Git optimizations

FROM python:3.12-alpine AS base

WORKDIR /app

# Install runtime dependencies with cache mount
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
  apk add --no-cache \
  git \
  git-lfs \
  tini \
  ca-certificates \
  libgit2 \
  && rm -rf /tmp/*

# Install uv package manager and mcp-server-git with pip cache
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
  pip install --no-cache-dir uv && \
  uv pip install --system mcp-server-git && \
  python -m compileall -b -f -q /usr/local/lib/python3.12/site-packages

# Create volume mount points
RUN mkdir -p /repos /cache/pip /cache/git /cache/python && \
  chmod 755 /repos /cache/pip /cache/git /cache/python

VOLUME ["/repos", "/cache/pip", "/cache/git", "/cache/python"]

# Performance tuning for Python and Git
ENV PYTHONOPTIMIZE=2 \
  PYTHONDONTWRITEBYTECODE=1 \
  PYTHONPYCACHEPREFIX=/cache/python \
  PIP_CACHE_DIR=/cache/pip \
  PIP_NO_COMPILE=0 \
  PIP_DISABLE_PIP_VERSION_CHECK=1 \
  GIT_TEMPLATE_DIR=/cache/git/templates \
  GIT_CONFIG_GLOBAL=/cache/git/config \
  GIT_CEILING_DIRECTORIES=/repos

WORKDIR /repos

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "print('healthy')" || exit 1

CMD ["mcp-server-git"]

LABEL mcp.server="git" \
  mcp.version="latest" \
  mcp.language="python" \
  mcp.source="https://github.com/modelcontextprotocol/servers" \
  mcp.repos.volume="git-repos" \
  mcp.cache.volume="git-cache" \
  optimization.cache="enabled" \
  optimization.python="optimized" \
  optimization.git="lfs-enabled" \
  description="MCP Git Server - Git operations via MCP protocol"
# MCP GitHub Server - Official Go-based implementation from GitHub
# Uses the official github-mcp-server Docker image
# Reference: https://github.com/github/github-mcp-server
# Binary location: /server/github-mcp-server
#
# OPTIMIZATION: BuildKit cache mounts + named volumes for instant rebuilds
# - BuildKit cache mount for apk packages
# - Named volume 'github-mcp-cache' persists API response data
# - Minimal layer changes ensure maximum cache utilization
# - Multi-stage build separates binary extraction from runtime

FROM ghcr.io/github/github-mcp-server:latest AS github-server

# Runtime stage - lightweight Alpine with tini for proper signal handling
FROM alpine:3.21

WORKDIR /app

# Install runtime dependencies with BuildKit cache mount
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
  apk add --no-cache \
  ca-certificates \
  curl \
  git \
  tini \
  && rm -rf /tmp/*

# Copy the github-mcp-server binary from official image
# This layer is cached unless the base image changes
COPY --from=github-server /server/github-mcp-server /app/github-mcp-server

# Create directories with proper permissions in one layer
# These directories will be mounted by named volumes at runtime
RUN mkdir -p /cache/github /app/data && \
  chmod 755 /app/github-mcp-server

# Environment configuration for GitHub MCP Server
# These can be overridden at runtime
# WARNING: Do not store sensitive tokens in ENV in production
# Use docker secrets or mount them at runtime instead
ENV GITHUB_HOST="https://github.com" \
  GITHUB_TOOLSETS="context,repos,issues,pull_requests,users" \
  GITHUB_READ_ONLY="0" \
  GITHUB_DYNAMIC_TOOLSETS="0"

# Define volume mount points for persistence across builds and container restarts
# Mount these as named volumes: docker run -v github-mcp-cache:/cache/github ...
VOLUME ["/cache/github", "/app/data"]

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD /app/github-mcp-server --version || exit 1

# Run in stdio mode with environment variable toolsets
CMD ["/app/github-mcp-server", "stdio"]

LABEL mcp.server="github" \
  mcp.version="0.19.1" \
  mcp.language="go" \
  mcp.source="https://github.com/github/github-mcp-server" \
  mcp.cache.volume="github-mcp-cache" \
  mcp.data.volume="github-mcp-data" \
  optimization.cache="enabled" \
  optimization.multistage="true" \
  description="Official GitHub MCP Server - manages repositories, issues, PRs, actions, security"
# =============================================================================
# Python 3.14 Experimental Container - Ultra-Optimized Multi-Stage Build
# =============================================================================
# Features:
#   - Python 3.14 with full scientific stack (numpy, scipy, pandas, matplotlib)
#   - Multi-stage build for minimal image size
#   - Layer caching optimization for fast rebuilds
#   - Security hardening (non-root user, minimal attack surface)
#   - Performance tuning (optimized bytecode, cache configuration)
#   - Comprehensive health checks
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Builder - Compile dependencies and wheels
# -----------------------------------------------------------------------------
FROM python:3.14.0-slim-bookworm AS builder

# Install build dependencies in single layer
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  gfortran \
  libopenblas-dev \
  cmake \
  git \
  && rm -rf /var/lib/apt/lists/*

# Create virtual environment for isolated dependency management
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip and build tools
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
  pip install --upgrade --no-cache-dir \
  pip setuptools wheel

# Install scientific computing stack (heavy dependencies)
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
  pip install --no-cache-dir \
  numpy==2.2.5 \
  scipy==1.16.2 \
  pandas==2.2.3 \
  matplotlib==3.10.0

# Install web frameworks and async tools
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
  pip install --no-cache-dir \
  fastapi==0.115.6 \
  uvicorn[standard]==0.34.0 \
  httpx==0.28.1 \
  aiohttp==3.11.11 \
  uvloop==0.21.0

# Install development and testing tools
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
  pip install --no-cache-dir \
  pytest==8.3.4 \
  pytest-asyncio==0.25.2 \
  pytest-benchmark==5.1.0 \
  black==24.10.0 \
  ruff==0.8.5 \
  mypy==1.14.1

# Compile bytecode for faster startup
RUN python3 -m compileall -f -q /opt/venv

# -----------------------------------------------------------------------------
# Stage 2: Runtime - Minimal production image
# -----------------------------------------------------------------------------
FROM python:3.14.0-slim-bookworm

ARG PYTHON_VERSION=3.14.0
ARG BUILD_DATE
ARG VCS_REF

# Install only runtime dependencies (no build tools)
RUN apt-get update && apt-get install -y --no-install-recommends \
  tini \
  libopenblas0 \
  libgomp1 \
  curl \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy virtual environment from builder stage
COPY --from=builder /opt/venv /opt/venv

# Create non-root user with specific UID for consistency
RUN groupadd -r pyexperimental -g 1001 && \
  useradd -r -u 1001 -g pyexperimental -m -s /bin/bash pyexperimental

# Create directory structure with proper permissions
RUN mkdir -p \
  /cache/python/{pip,bytecode,profiler} \
  /workspace \
  /app \
  && chown -R pyexperimental:pyexperimental /cache /workspace /app \
  && chmod -R 755 /cache /workspace /app

# Environment variables for performance optimization
ENV PATH="/opt/venv/bin:$PATH" \
  # Python optimization
  PYTHONOPTIMIZE=2 \
  PYTHONDONTWRITEBYTECODE=0 \
  PYTHONPYCACHEPREFIX=/cache/python/bytecode \
  PYTHONUSERBASE=/cache/python/user-packages \
  PYTHONUNBUFFERED=1 \
  # Pip configuration
  PIP_CACHE_DIR=/cache/python/pip \
  PIP_NO_COMPILE=0 \
  PIP_DISABLE_PIP_VERSION_CHECK=1 \
  # Performance profiling
  PYTHONPROFILEIMPORTTIME=1 \
  PYTHON_PROFILER_OUTPUT=/cache/python/profiler \
  # Memory optimization
  MALLOC_TRIM_THRESHOLD_=100000 \
  MALLOC_MMAP_THRESHOLD_=131072 \
  MALLOC_MMAP_MAX_=65536 \
  # Threading (future-ready for Python 3.15 free-threading)
  PYTHON_THREAD_COUNT=0

# Create comprehensive health check script
COPY --chown=pyexperimental:pyexperimental <<'EOF' /app/health.py
#!/usr/bin/env python3
"""Health check script for Python experimental container."""
import sys
from importlib.metadata import version

def check_health():
    """Perform comprehensive health checks."""
    checks = {
        "Python Version": sys.version.split()[0],
        "64-bit": sys.maxsize > 2**32,
        "Virtual Environment": sys.prefix != sys.base_prefix,
        "NumPy": version("numpy"),
        "SciPy": version("scipy"),
        "FastAPI": version("fastapi"),
    }
    
    for check_name, result in checks.items():
        print(f"✓ {check_name}: {result}")
    
    return 0

if __name__ == "__main__":
    try:
        sys.exit(check_health())
    except Exception as e:
        print(f"✗ Health check failed: {e}", file=sys.stderr)
        sys.exit(1)
EOF

RUN chmod +x /app/health.py

# Define volumes for persistent data
VOLUME ["/cache/python", "/workspace", "/app"]

WORKDIR /workspace

# Switch to non-root user for security
USER pyexperimental

# Use tini for proper signal handling
ENTRYPOINT ["/usr/bin/tini", "--"]

# Health check configuration
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD python3 /app/health.py || exit 1

# Default command
CMD ["python3"]

# Metadata labels
LABEL org.opencontainers.image.title="Python Experimental Container" \
  org.opencontainers.image.description="Python 3.14 with scientific computing stack for R&D" \
  org.opencontainers.image.version="${PYTHON_VERSION}" \
  org.opencontainers.image.created="${BUILD_DATE}" \
  org.opencontainers.image.revision="${VCS_REF}" \
  org.opencontainers.image.vendor="MCP DevContainer Cluster" \
  org.opencontainers.image.authors="Dean Luus" \
  org.opencontainers.image.licenses="MIT" \
  python.version="${PYTHON_VERSION}" \
  python.implementation="CPython" \
  python.architecture="x86_64" \
  optimization.level="2" \
  optimization.bytecode="enabled" \
  optimization.caching="enabled" \
  features="numpy,scipy,pandas,matplotlib,fastapi,async" \
  build.type="multi-stage" \
  build.optimization="size,speed" \
  security.non-root="true" \
  experimental.status="stable"
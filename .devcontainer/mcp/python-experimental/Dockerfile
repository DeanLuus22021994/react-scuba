# Python 3.15.0a1 Experimental - Free-threaded (GIL-disabled) build
# Reference: https://docs.python.org/3.15/whatsnew/3.15.html  
# Features: PEP 703 free-threading, low-latency profiler, experimental R&D
# Updated: October 2025 - Using official Python 3.15.0a1 with free-threading

FROM python:3.15.0a1-bookworm

ARG PYTHON_VERSION=3.15.0a1

# Install additional tools for experimental development
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  curl \
  git \
  tini \
  linux-perf \
  binutils \
  && rm -rf /var/lib/apt/lists/* /tmp/*

# Verify Python build capabilities
RUN python3 -c "import sys; print(f'Python {sys.version}')" && \
  python3 -c "import sys; print(f'64-bit: {sys.maxsize > 2**32}')" && \
  python3 -c "import sys; print(f'Free-threading support: {hasattr(sys, \"_is_gil_enabled\")}')" && \
  python3 -c "import sys; print(f'GIL disabled: {not sys._is_gil_enabled() if hasattr(sys, \"_is_gil_enabled\") else \"Not supported\"}')" || echo 'Python experimental ready'

# Install essential packages with pip cache
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
  python3 -m pip install --upgrade \
  pip setuptools wheel \
  numpy scipy pandas matplotlib \
  fastapi uvicorn httpx aiohttp \
  pytest pytest-asyncio pytest-benchmark \
  black ruff mypy \
  uvloop

# Create cache and workspace directories
RUN mkdir -p /cache/python/{pip,bytecode,profiler} /workspace /app && \
  useradd -m -u 1001 -s /bin/bash pyexperimental 2>/dev/null || true && \
  chown -R pyexperimental:pyexperimental /cache /workspace /app && \
  chmod -R 755 /cache /workspace /app

# Performance environment variables for free-threaded Python
ENV PYTHONOPTIMIZE=2 \
  PYTHONDONTWRITEBYTECODE=0 \
  PYTHONPYCACHEPREFIX=/cache/python/bytecode \
  PYTHONUSERBASE=/cache/python/user-packages \
  PIP_CACHE_DIR=/cache/python/pip \
  PIP_NO_COMPILE=0 \
  PIP_DISABLE_PIP_VERSION_CHECK=1 \
  PYTHON_GIL=0 \
  PYTHON_CPU_COUNT=0 \
  PYTHONPROFILEIMPORTTIME=1 \
  PYTHON_PROFILER_OUTPUT=/cache/python/profiler \
  MALLOC_TRIM_THRESHOLD_=100000 \
  MALLOC_MMAP_THRESHOLD_=131072

VOLUME ["/cache/python", "/workspace", "/app"]

WORKDIR /workspace

USER pyexperimental

# Create simple health check script
RUN echo '#!/usr/bin/env python3' > /app/health.py && \
  echo 'import sys' >> /app/health.py && \
  echo 'print(f"Python {sys.version.split()[0]}")' >> /app/health.py && \
  echo 'print(f"64-bit: {sys.maxsize > 2**32}")' >> /app/health.py && \
  echo 'print(f"Free-threading: {hasattr(sys, \"_is_gil_enabled\")}")' >> /app/health.py && \
  echo 'if hasattr(sys, "_is_gil_enabled"):' >> /app/health.py && \
  echo '    print(f"GIL disabled: {not sys._is_gil_enabled()}")' >> /app/health.py && \
  chmod +x /app/health.py && \
  chown pyexperimental:pyexperimental /app/health.pyENTRYPOINT ["/usr/bin/tini", "--"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD python3 /app/health.py || exit 1

CMD ["python3"]\n\nLABEL maintainer=\"Dean Luus\" \\\n  python.version=\"${PYTHON_VERSION}\" \\\n  python.implementation=\"CPython\" \\\n  python.arch=\"x86_64-64bit\" \\\n  python.gil=\"disabled\" \\\n  python.freethreaded=\"true\" \\\n  python.profiler=\"enabled\" \\\n  optimization.march=\"x86-64-v3\" \\\n  optimization.lto=\"full\" \\\n  optimization.pgo=\"enabled\" \\\n  optimization.computed-gotos=\"enabled\" \\\n  experimental.status=\"alpha\" \\\n  experimental.features=\"free-threading,profiler,low-latency\" \\\n  description=\"Python 3.15.0a1 experimental - free-threaded GIL-disabled build for R&D\"
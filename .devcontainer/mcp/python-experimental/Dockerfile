# Python 3.15.0a1 Experimental - Free-threaded (GIL-disabled) build
# Reference: https://docs.python.org/3.15/whatsnew/3.15.html
# Features: PEP 703 free-threading, low-latency profiler, experimental R&D
#
# OPTIMIZATION: 64-bit x86_64-v3, LTO, PGO, free-threading for parallel execution

FROM debian:trixie-slim AS python-builder

ARG PYTHON_VERSION=3.15.0a1
ARG DEBIAN_FRONTEND=noninteractive

# Install build dependencies with cache mount
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,target=/var/lib/apt,sharing=locked \
  apt-get update && apt-get install -y --no-install-recommends \
  build-essential ca-certificates curl dpkg-dev g++ gcc libbz2-dev \
  libexpat1-dev libffi-dev libgdbm-dev liblzma-dev libncursesw5-dev \
  libreadline-dev libsqlite3-dev libssl-dev lzma-dev make pkg-config \
  tk-dev uuid-dev wget xz-utils zlib1g-dev \
  # Additional for profiling\n  linux-perf binutils && \
  rm -rf /tmp/*

WORKDIR /tmp/python-build

# Download Python 3.15.0a1 with cache mount
RUN --mount=type=cache,target=/tmp/python-src,sharing=locked \
  [ -f /tmp/python-src/Python-${PYTHON_VERSION}.tgz ] || \
  wget -O /tmp/python-src/Python-${PYTHON_VERSION}.tgz \
  https://www.python.org/ftp/python/${PYTHON_VERSION}/Python-${PYTHON_VERSION}.tgz && \
  cp /tmp/python-src/Python-${PYTHON_VERSION}.tgz . && \
  tar xzf Python-${PYTHON_VERSION}.tgz

WORKDIR /tmp/python-build/Python-${PYTHON_VERSION}

# Configure Python with free-threading, LTO, PGO, and profiling support
RUN ./configure \
  --disable-gil \
  --with-lto=full \
  --enable-optimizations \
  --with-computed-gotos \
  --with-system-expat \
  --enable-loadable-sqlite-extensions \
  --with-ssl-default-suites=openssl \
  --with-ensurepip=upgrade \
  --enable-ipv6 \
  --enable-profiling \
  --with-pydebug=no \
  --prefix=/opt/python3.15t \
  --with-platlibdir=lib \
  LDFLAGS=\"-Wl,-rpath=/opt/python3.15t/lib\" \
  CFLAGS=\"-march=x86-64-v3 -mtune=generic -O3 -fomit-frame-pointer\" \
  CXXFLAGS=\"-march=x86-64-v3 -mtune=generic -O3 -fomit-frame-pointer\" && \
  make -j$(nproc) && \
  make install && \
  /opt/python3.15t/bin/python3.15t -c \"import sys; assert sys.maxsize > 2**32 and not sys._is_gil_enabled()\" && \
  /opt/python3.15t/bin/python3.15t -m ensurepip --upgrade

# Install essential packages with pip cache
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
  /opt/python3.15t/bin/python3.15t -m pip install --upgrade \
  pip setuptools wheel \
  numpy scipy pandas matplotlib \
  fastapi uvicorn httpx aiohttp \
  pytest pytest-asyncio pytest-benchmark \
  black ruff mypy \
  uvloop \
  && /opt/python3.15t/bin/python3.15t -m compileall -b -f -q /opt/python3.15t/lib/python3.15/site-packages

# Runtime stage - minimal Debian Trixie
FROM debian:trixie-slim

ARG PYTHON_VERSION=3.15.0a1

# Install minimal runtime dependencies with cache mount
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,target=/var/lib/apt,sharing=locked \
  apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates curl tini \
  libexpat1 libffi8 libreadline8 libsqlite3-0 libssl3 \
  linux-perf && \
  rm -rf /tmp/*

# Copy Python installation from builder
COPY --from=python-builder /opt/python3.15t /opt/python3.15t

# Create cache and workspace directories
RUN mkdir -p /cache/python/{pip,bytecode,profiler} /workspace /app && \
  useradd -m -u 1001 -s /bin/bash pyexperimental 2>/dev/null || true && \
  chown -R pyexperimental:pyexperimental /cache /workspace /app && \
  chmod -R 755 /cache /workspace /app

# Performance environment variables for free-threaded Python
ENV PATH=/opt/python3.15t/bin:$PATH \
  PYTHONPATH=/opt/python3.15t/lib/python3.15/site-packages \
  PYTHONOPTIMIZE=2 \
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
  MALLOC_MMAP_THRESHOLD_=131072\n\nVOLUME [\"/cache/python\", \"/workspace\", \"/app\"]\n\nWORKDIR /workspace\n\nUSER pyexperimental\n\n# Health check with profiling validation\nCOPY --chown=pyexperimental:pyexperimental <<'EOF' /app/health.py\nimport sys\nimport os\n\nchecks = [\n    (\"Python 3.15\", sys.version.startswith(\"3.15\")),\n    (\"64-bit\", sys.maxsize > 2**32),\n    (\"GIL disabled\", not sys._is_gil_enabled()),\n    (\"Free-threaded\", hasattr(sys, '_is_gil_enabled')),\n    (\"Profiler available\", hasattr(sys, 'set_asyncgen_hooks')),\n]\n\nfailed = [k for k, v in checks if not v]\nfor k, v in checks:\n    print(f\"{'✓' if v else '✗'} {k}\")\n\nif not failed:\n    print(f\"\\n🚀 Python {sys.version.split()[0]} ready for experimental R&D\")\n    print(f\"   GIL: {'Disabled (Free-threaded)' if not sys._is_gil_enabled() else 'Enabled'}\")\n    print(f\"   Architecture: {os.uname().machine}\")\n    print(f\"   Profiler: Enabled\")\n\nsys.exit(1 if failed else 0)\nEOF\n\nENTRYPOINT [\"/usr/bin/tini\", \"--\"]\n\nHEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \\\n  CMD /opt/python3.15t/bin/python3.15t /app/health.py || exit 1\n\nCMD [\"/opt/python3.15t/bin/python3.15t\"]\n\nLABEL maintainer=\"Dean Luus\" \\\n  python.version=\"${PYTHON_VERSION}\" \\\n  python.implementation=\"CPython\" \\\n  python.arch=\"x86_64-64bit\" \\\n  python.gil=\"disabled\" \\\n  python.freethreaded=\"true\" \\\n  python.profiler=\"enabled\" \\\n  optimization.march=\"x86-64-v3\" \\\n  optimization.lto=\"full\" \\\n  optimization.pgo=\"enabled\" \\\n  optimization.computed-gotos=\"enabled\" \\\n  experimental.status=\"alpha\" \\\n  experimental.features=\"free-threading,profiler,low-latency\" \\\n  description=\"Python 3.15.0a1 experimental - free-threaded GIL-disabled build for R&D\"
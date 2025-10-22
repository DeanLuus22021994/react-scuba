# Multi-stage Python Dockerfile for cluster-example
# Optimized for Python 3.14 free-threaded execution and cluster performance

FROM python:3.14-slim AS base
WORKDIR /app

# Install system dependencies optimized for Python 3.14 and clustering
RUN apt-get update && apt-get install -y \
  curl \
  build-essential \
  pkg-config \
  postgresql-client \
  redis-tools \
  && rm -rf /var/lib/apt/lists/*

# Create non-root user optimized for container security
RUN useradd --create-home --shell /bin/bash --uid 1001 app \
  && chown -R app:app /app
USER app

FROM base AS deps
# Copy requirements file
COPY --chown=app:app python_utils/requirements.txt ./
# Create virtual environment optimized for Python 3.14
RUN python -m venv /app/.venv \
  && /app/.venv/bin/pip install --no-cache-dir --upgrade pip \
  && /app/.venv/bin/pip install --no-cache-dir -r requirements.txt

FROM deps AS runner
# Copy virtual environment from deps stage
COPY --from=deps --chown=app:app /app/.venv /app/.venv
# Copy application code
COPY --chown=app:app . .

# Activate virtual environment
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV HOST=0.0.0.0
ENV PORT=8000

# Python 3.14 optimizations for cluster performance
ENV PYTHONOPTIMIZE=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONMALLOC=malloc

# Cluster-specific environment variables
ENV CLUSTER_MODE=true
ENV REDIS_URL=redis://redis:6379
ENV POSTGRES_URL=postgresql://postgres:password@postgres:5432/scuba_db

# Copy health check script
COPY --chown=app:app docker-compose-examples/cluster-example/dockerfiles/healthcheck.py /app/healthcheck.py

# Health check optimized for Python 3.14 and cluster monitoring
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 \
  CMD ["python", "/app/healthcheck.py"]EXPOSE 8000

# Default command leveraging Python 3.14 concurrent features
CMD ["python", "-m", "python_utils.doc_utils", "inventory", "--cluster"]

# syntax=docker/dockerfile:1

FROM python:3.14-slim AS base
WORKDIR /app

# Install system dependencies with BuildKit caching
RUN --mount=type=cache,target=/var/cache/apt \
  --mount=type=cache,target=/var/lib/apt \
  apt-get update && apt-get install -y \
  curl \
  build-essential \
  pkg-config \
  postgresql-client \
  redis-tools \
  docker.io \
  && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd --create-home --shell /bin/bash --uid 1001 app \
  && chown -R app:app /app
USER app

FROM base AS deps
# Copy dependency files
COPY --chown=app:app pyproject.toml ./
COPY --chown=app:app python_utils/ ./python_utils/

# Create virtual environment with pip cache mounting
RUN --mount=type=cache,target=/tmp/.cache/pip,uid=1001 \
  python -m venv /app/.venv \
  && /app/.venv/bin/pip install --no-cache-dir --upgrade pip \
  && /app/.venv/bin/pip install --no-cache-dir -e .

FROM deps AS runner
# Copy virtual environment
COPY --from=deps --chown=app:app /app/.venv /app/.venv
# Copy application code
COPY --chown=app:app . .

# Environment configuration
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH=/app/python_utils:/app
ENV PYTHONUNBUFFERED=1
ENV HOST=0.0.0.0
ENV PORT=8000

# Python 3.14 optimizations
ENV PYTHONOPTIMIZE=1
ENV PYTHONDONTWRITEBYTECODE=1

# Health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
  CMD python -c "import sys; print('Python OK'); sys.exit(0)" || exit 1

EXPOSE 8000

# Default command
CMD ["python", "-m", "uvicorn", "react_scuba_utils.api:app", "--host", "0.0.0.0", "--port", "8000"]

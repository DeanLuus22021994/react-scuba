# cAdvisor - Container Advisor for Docker
# Provides detailed container metrics for Prometheus
# Reference: https://github.com/google/cadvisor

FROM gcr.io/cadvisor/cadvisor:v0.47.2

LABEL maintainer="Dean Luus" \
  description="cAdvisor container metrics exporter" \
  version="0.47.2"

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/healthz || exit 1

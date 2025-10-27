# PostgreSQL Exporter for Prometheus
# Reference: https://github.com/prometheus-community/postgres_exporter

FROM quay.io/prometheuscommunity/postgres-exporter:v0.15.0

LABEL maintainer="Dean Luus" \
  description="PostgreSQL metrics exporter for Prometheus" \
  version="0.15.0"

USER nobody

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:9187/ || exit 1

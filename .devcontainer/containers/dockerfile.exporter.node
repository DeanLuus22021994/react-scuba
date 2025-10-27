# Node Exporter - Hardware and OS metrics
# Reference: https://github.com/prometheus/node_exporter

FROM prom/node-exporter:v1.7.0

LABEL maintainer="Dean Luus" \
  description="Prometheus Node Exporter for host metrics" \
  version="1.7.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:9100/metrics || exit 1

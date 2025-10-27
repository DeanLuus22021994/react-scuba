# MySQL/MariaDB Exporter for Prometheus
# Reference: https://github.com/prometheus/mysqld_exporter

FROM prom/mysqld-exporter:v0.15.1

LABEL maintainer="Dean Luus" \
  description="MySQL/MariaDB metrics exporter for Prometheus" \
  version="0.15.1"

USER root

# Copy default config and set permissions
COPY .my.cnf /.my.cnf
RUN chmod 644 /.my.cnf && chown nobody:nobody /.my.cnf

USER nobody

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:9104/metrics || exit 1

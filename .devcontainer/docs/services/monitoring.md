# MCP Cluster Monitoring Stack

## Overview

Comprehensive observability stack providing real-time metrics, visualization, and alerting for all 15+ services in the MCP DevContainer cluster.

## Components

### Grafana (172.20.0.72)

**Purpose**: Visualization and dashboards

- **Version**: 12.2.1
- **Port**: 3000 (host) → 3000 (container)
- **Credentials**: admin/admin (change on first login)
- **Datasource**: Prometheus (auto-provisioned)
- **Dashboards**: Auto-provisioned from `/etc/grafana/provisioning/dashboards/json/`

**Pre-configured Dashboards**:

1. **MCP Cluster Overview** (12 panels)
   - Container health status
   - CPU/Memory utilization
   - Network I/O
   - Service availability matrix
2. **Database Monitoring**
   - PostgreSQL connections, transactions, query performance
   - MariaDB threads, queries, slow queries
   - Connection pool status

**Access**: http://localhost:3000

### Prometheus (172.20.0.71)

**Purpose**: Metrics collection and storage

- **Version**: Latest (rolling tag)
- **Port**: 9090 (host) → 9090 (container)
- **Retention**: 15 days (configurable via `PROMETHEUS_RETENTION`)
- **Scrape Interval**: 15 seconds (low-latency monitoring)
- **Storage**: Named volume `prometheus-data`

**Scrape Targets**:

- Self (Prometheus metrics): :9090/metrics
- PostgreSQL: postgres-db:5432
- MariaDB: mariadb:3306
- cAdvisor: cadvisor:8080/metrics
- Node Exporter: node-exporter:9100/metrics
- Postgres Exporter: postgres-exporter:9187/metrics
- MySQL Exporter: mysql-exporter:9104/metrics

**Access**: http://localhost:9090

### nginx (172.20.0.70)

**Purpose**: Reverse proxy and gateway

- **Version**: Alpine (latest)
- **Port**: 80 (host) → 80 (container)
- **Configuration**: `/etc/nginx/conf.d/`
- **Features**: Health endpoint, request routing, load balancing

**Routes**:

- `/` → Default nginx page
- `/prometheus` → Prometheus UI (proxy)
- `/grafana` → Grafana UI (proxy)
- `/health` → Health check endpoint

**Access**: http://localhost

## Exporters

### cAdvisor (172.20.0.75)

**Purpose**: Container-level resource metrics

- **Version**: Latest
- **Port**: 8081 (host) → 8080 (container)
- **Privileged**: Yes (requires host filesystem access)
- **Metrics**:
  - CPU usage per container
  - Memory usage (RSS, cache, swap)
  - Network I/O (bytes, packets, errors)
  - Disk I/O (read/write bytes, operations)
  - Filesystem usage

**Mounts**:

- `/:/rootfs:ro` - Root filesystem (read-only)
- `/var/run:/var/run:ro` - Docker socket
- `/sys:/sys:ro` - System information
- `/var/lib/docker:/var/lib/docker:ro` - Docker data

**Access**: http://localhost:8081

### Node Exporter (172.20.0.76)

**Purpose**: Host-level system metrics

- **Version**: Latest
- **Port**: 9100 (host) → 9100 (container)
- **Metrics**:
  - CPU utilization, load average
  - Memory (total, used, available, buffers, cache)
  - Disk usage, I/O stats
  - Network interface stats
  - System uptime

**Mounts**:

- `/proc:/host/proc:ro` - Process information
- `/sys:/host/sys:ro` - System information
- `/:/rootfs:ro` - Filesystem stats

**Access**: http://localhost:9100/metrics

### Postgres Exporter (172.20.0.77)

**Purpose**: PostgreSQL database metrics

- **Version**: Latest (prom/postgres-exporter)
- **Port**: 9187 (host) → 9187 (container)
- **Connection**: postgres-db:5432
- **Metrics**:
  - Active connections, idle connections
  - Transactions per second (commits, rollbacks)
  - Database size, table sizes
  - Index usage
  - Replication lag (if applicable)
  - Query execution time

**Environment**:

```bash
DATA_SOURCE_NAME=postgresql://postgres:password@postgres-db:5432/postgres?sslmode=disable
```

**Access**: http://localhost:9187/metrics

### MySQL Exporter (172.20.0.78)

**Purpose**: MariaDB database metrics

- **Version**: v0.15.1 (prom/mysqld-exporter)
- **Port**: 9104 (host) → 9104 (container)
- **Connection**: mariadb:3306
- **Configuration**: `/exporter/.my.cnf` (credentials)
- **Metrics**:
  - Threads connected, running
  - Queries per second
  - Slow queries
  - InnoDB buffer pool usage
  - Table locks
  - Replication status (if applicable)

**Scrapers Enabled**:

- `auto_increment.columns`
- `info_schema.userstats`
- `perf_schema.eventswaits`
- `perf_schema.file_events`
- `perf_schema.tableiowaits`
- `perf_schema.tablelocks`

**Access**: http://localhost:9104/metrics

## Metric Query Examples

### Container CPU Usage (PromQL)

```promql
# CPU usage percentage per container
rate(container_cpu_usage_seconds_total{name!=""}[5m]) * 100

# Top 5 CPU-consuming containers
topk(5, rate(container_cpu_usage_seconds_total{name!=""}[5m]))
```

### Database Connections

```promql
# PostgreSQL active connections
pg_stat_database_numbackends{datname="postgres"}

# MariaDB threads connected
mysql_global_status_threads_connected
```

### Memory Usage

```promql
# Container memory usage (bytes)
container_memory_usage_bytes{name!=""}

# Host memory utilization (%)
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
```

### Network Throughput

```promql
# Network receive bytes/sec per container
rate(container_network_receive_bytes_total[5m])

# Network transmit bytes/sec per container
rate(container_network_transmit_bytes_total[5m])
```

## Alerting (Future Enhancement)

Placeholder for Prometheus Alertmanager integration:

- Service down (health check failures)
- High CPU/memory usage (>80% for 5 minutes)
- Disk space low (<10% free)
- Database connection pool exhausted
- Slow query threshold exceeded

## Performance Optimization

### Query Performance

- **Dashboard Refresh**: 10-30 seconds (configurable)
- **PromQL Optimization**: Use `rate()` for counters, avoid `irate()` for dashboards
- **Recording Rules**: Pre-compute expensive queries
- **Retention**: Balance storage vs historical data needs

### Resource Usage

- **Prometheus Memory**: ~500MB for 15d retention
- **Grafana Memory**: ~100MB base + dashboard complexity
- **Exporter Memory**: <50MB each
- **Total Monitoring Overhead**: ~1GB RAM

### Network Bandwidth

- **Scrape Overhead**: ~1Mbps (15s intervals, 8 targets)
- **Dashboard Queries**: Depends on refresh rate
- **Optimization**: Increase scrape intervals for less critical metrics

## Troubleshooting

### Dashboard Not Loading

1. Verify Grafana running: `docker ps | grep grafana`
2. Check datasource: Grafana → Configuration → Data Sources
3. Test Prometheus: http://localhost:9090/targets

### Missing Metrics

1. Check Prometheus targets: http://localhost:9090/targets
2. Verify exporter health: `curl http://localhost:<exporter_port>/metrics`
3. Review exporter logs: `docker logs <exporter_container>`

### High Memory Usage

1. Reduce Prometheus retention: Edit `PROMETHEUS_RETENTION` in `.env`
2. Optimize queries: Use recording rules for complex queries
3. Limit scrape targets: Remove unnecessary exporters

### Slow Dashboard Loading

1. Increase refresh interval in dashboard settings
2. Reduce time range (e.g., 1h instead of 24h)
3. Optimize PromQL queries (avoid `*` selectors)

## Configuration Files

- **Prometheus**: `.devcontainer/containers/gateway/config/prometheus.yml`
- **Grafana Datasources**: `.devcontainer/containers/gateway/config/grafana/provisioning/datasources/`
- **Grafana Dashboards**: `.devcontainer/containers/gateway/config/grafana/provisioning/dashboards/`
- **nginx**: `.devcontainer/containers/gateway/config/nginx/`

## Security Notes

- Change default Grafana password immediately
- Restrict access to monitoring endpoints (firewall/VPN)
- Use TLS for production deployments
- Limit Prometheus external access (internal network only)
- Rotate database exporter credentials regularly

## References

- Grafana Docs: https://grafana.com/docs/grafana/latest/
- Prometheus Docs: https://prometheus.io/docs/prometheus/latest/
- cAdvisor: https://github.com/google/cadvisor
- Node Exporter: https://github.com/prometheus/node_exporter
- Postgres Exporter: https://github.com/prometheus-community/postgres_exporter
- MySQL Exporter: https://github.com/prometheus/mysqld_exporter

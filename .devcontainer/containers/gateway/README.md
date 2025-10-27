# Gateway Monitoring Stack - Multi-Container Architecture

**Purpose**: Unified monitoring and web server for the MCP cluster using sidecar pattern.

## Architecture

- **nginx:alpine** - Reverse proxy and web server (~25MB)
- **prom/prometheus:latest** - Metrics collection and storage (~250MB)
- **grafana/grafana:latest** - Visualization and dashboards (~350MB)

**Total footprint**: ~625MB images + data volumes

## Network Configuration

- **nginx**: 172.20.0.70 (ports 80/443)
- **prometheus**: 172.20.0.71 (port 9090)
- **grafana**: 172.20.0.72 (port 3000)

## Services Overview

### nginx (Reverse Proxy)

- Routes traffic to prometheus and grafana
- SSL termination (if configured)
- Health endpoint at `/health`
- Configuration: `config/nginx.conf`

### prometheus (Metrics)

- Scrapes all MCP cluster services
- 15-day retention policy
- Configuration: `config/prometheus.yml`
- Web UI: http://localhost:9090

### grafana (Visualization)

- Pre-configured with Prometheus datasource
- Docker monitoring dashboard
- Admin credentials: admin / ${GRAFANA_ADMIN_PASSWORD}
- Web UI: http://localhost:3000

## Deployment

All three containers are deployed via the main docker-compose.mcp.yml file as part of the infrastructure tier.

## Configuration Files

- `nginx.conf` - Nginx reverse proxy configuration
- `nginx-health.conf` - Nginx health endpoint module
- `prometheus.yml` - Prometheus scrape targets
- `grafana-datasources.yml` - Grafana datasource provisioning
- `grafana-dashboards.yml` - Grafana dashboard provisioning
- `dashboard-cluster.json` - MCP cluster overview dashboard
- `dashboard-database.json` - Database monitoring dashboard
- `dashboard-system.json` - System resources dashboard

# Grafana Configuration for MCP Cluster

## Overview

Comprehensive monitoring dashboards for the MCP (Model Context Protocol) cluster infrastructure.

## Features

### 🎯 Dashboards

1. **MCP Cluster Overview** - Real-time cluster health and resource monitoring
   - Total containers count
   - Healthy vs unhealthy services
   - CPU usage per container
   - Memory usage trends
   - Network I/O statistics
   - Health status table

2. **MCP Database Monitoring** - Database-specific metrics
   - PostgreSQL status and connections
   - MariaDB status and performance
   - Transaction rates
   - Query performance
   - Resource utilization

### 📊 Dashboard Access

- URL: `http://localhost:3000`
- Default credentials:
  - Username: `admin`
  - Password: `${GRAFANA_ADMIN_PASSWORD}` (from devcontainer.env)

### 🔄 Auto-Refresh

All dashboards refresh every 10 seconds with configurable intervals:

- 5s, 10s, 30s, 1m, 5m

### 🎨 Modern UI Features

- **Dark theme** optimized for readability
- **Smooth animations** with gradient fills
- **Interactive legends** with real-time stats (last, max, mean)
- **Multi-series tooltips** for comparison
- **Color-coded status** (green = healthy, red = down)
- **Responsive layouts** with proper grid alignment

## Data Sources

### Prometheus

- Pre-configured as default datasource
- URL: `http://prometheus:9090`
- Metrics collected every 15s
- 15-day retention

## Customization

### Adding New Dashboards

1. Create JSON file in `provisioning/dashboards/json/`
2. Dashboard will auto-load within 10 seconds
3. Edit through Grafana UI (changes persist)

### Adding Data Sources

1. Edit `provisioning/datasources/prometheus.yml`
2. Restart Grafana container

### Metrics Available

- Container CPU/Memory/Network
- Docker daemon stats
- Database connections
- Transaction rates
- Health check status
- Build metrics (BuildKit)

## Industry Standards

### Best Practices Implemented

✅ **Low-code approach** - JSON-based dashboard provisioning  
✅ **Semantic versioning** - Dashboard version control  
✅ **Infrastructure as Code** - All config in Git  
✅ **Auto-discovery** - Prometheus service discovery  
✅ **Multi-tenancy ready** - Org-based provisioning  
✅ **High availability** - Stateless configuration  
✅ **Security** - Proxy access mode for datasources

### Monitoring Stack

- **Prometheus** - Time-series metrics database
- **Grafana** - Visualization and dashboards
- **cAdvisor** - Container metrics (optional)
- **Node Exporter** - Host metrics (optional)
- **DB Exporters** - PostgreSQL/MySQL metrics (optional)

## Troubleshooting

### Dashboard Not Loading

```bash
# Check Grafana logs
docker logs tbc-grafana

# Verify provisioning config
docker exec tbc-grafana ls -la /etc/grafana/provisioning/dashboards/
```

### No Data in Panels

```bash
# Verify Prometheus is scraping
curl http://localhost:9090/api/v1/targets

# Check container metrics
curl http://localhost:9090/api/v1/query?query=up
```

### Health Check Failing

```bash
# Test Grafana health endpoint
curl http://localhost:3000/api/health
```

## Performance Optimization

### Query Optimization

- Use `rate()` for counter metrics
- Limit time ranges for heavy queries
- Use recording rules for complex calculations
- Enable query caching in Grafana

### Resource Limits

```yaml
# In docker-compose.yml
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.5'
```

## Plugin Management

### Pre-installed Plugins

- `grafana-clock-panel` - Time display widget

### Installing Additional Plugins

```bash
# Add to docker-compose.yml environment
GF_INSTALL_PLUGINS=grafana-piechart-panel,grafana-worldmap-panel
```

## API Access

### Grafana HTTP API

- Documentation: https://grafana.com/docs/grafana/latest/developers/http_api/
- Create dashboards programmatically
- Manage users and orgs
- Configure data sources

### Example API Call

```bash
curl -X GET http://admin:${GRAFANA_ADMIN_PASSWORD}@localhost:3000/api/dashboards/uid/mcp-cluster-overview
```

## Production Considerations

### Security

- [ ] Change default admin password
- [ ] Enable HTTPS (nginx proxy)
- [ ] Configure OAuth/LDAP
- [ ] Enable audit logging
- [ ] Restrict API access

### High Availability

- [ ] External database (PostgreSQL/MySQL)
- [ ] Shared storage for dashboards
- [ ] Load balancer for multiple instances
- [ ] Prometheus federation

### Backup

```bash
# Backup dashboards
docker exec tbc-grafana grafana-cli admin export-dashboard > backup.json

# Backup data
docker cp tbc-grafana:/var/lib/grafana ./grafana-backup
```

## Resources

- [Grafana Documentation](https://grafana.com/docs/grafana/latest/)
- [Prometheus Best Practices](https://prometheus.io/docs/practices/)
- [Dashboard Design Guide](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/)

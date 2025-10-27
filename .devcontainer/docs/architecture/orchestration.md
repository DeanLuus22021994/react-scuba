# MCP Cluster Orchestration Architecture

## Overview

The MCP DevContainer cluster uses a five-tier orchestration model with Docker Compose, ensuring proper dependency ordering, health propagation, and service discovery across 15+ containers.

## Tier Architecture

### Tier 1: Database Layer (172.20.0.20-21)

**Purpose**: Foundation data persistence

- `postgres-db` (PostgreSQL 16)
- `mariadb` (MariaDB 11.4)
- **Startup**: First (no dependencies)
- **Health Check**: 5s interval, 10s start period
- **Volumes**: Named volumes for data persistence

### Tier 2: MCP Database Services (172.20.0.30-39)

**Purpose**: Database-backed MCP servers

- `postgres-mcp` → requires `postgres-db`
- `mariadb-mcp` → requires `mariadb`
- `python-experimental` → requires databases
- **Dependency**: `depends_on` with health conditions
- **Startup**: After Tier 1 healthy

### Tier 3: Infrastructure Tools (172.20.0.50-59)

**Purpose**: Build and CI/CD infrastructure

- `buildkit` (172.20.0.55) → Docker BuildKit daemon
- `runner` (172.20.0.56) → GitHub Actions self-hosted runner
- `k8s-plugin` (172.20.0.50) → Kubernetes tooling with GPU
- **Characteristics**: Long-running, stateful services

### Tier 4: Monitoring Stack (172.20.0.70-79)

**Purpose**: Observability and metrics collection

- **Gateway**: nginx (172.20.0.70), prometheus (172.20.0.71), grafana (172.20.0.72)
- **Exporters**: cadvisor (172.20.0.75), node-exporter (172.20.0.76), postgres-exporter (172.20.0.77), mysql-exporter (172.20.0.78)
- **Data Flow**: Exporters → Prometheus → Grafana
- **Refresh**: 10-15s intervals for low-latency dashboards

### Tier 5: DevContainer (172.20.0.60)

**Purpose**: Development environment

- Depends on all infrastructure layers
- MCP stdio servers configured in `devcontainer.json`
- Access to all services via internal network

## Service Discovery

- **DNS**: Container name resolution (e.g., `postgres-db:5432`)
- **Static IPs**: Predictable addressing for monitoring
- **Network**: `mcp-cluster` bridge (172.20.0.0/16)

## Health Propagation

```yaml
Service Start → Health Check (start_period) → Healthy State → Dependent Services Start
```

- **Dependencies**: Use `condition: service_healthy`
- **Retries**: 3-5 retries with exponential backoff
- **Timeout**: 3-10s based on service complexity

## Restart Policies

- **Databases**: `unless-stopped` (preserve across reboots)
- **MCP Services**: `unless-stopped` (critical for development)
- **Tools**: `unless-stopped` (BuildKit, runner)
- **Monitoring**: `unless-stopped` (continuous observability)

## Volume Strategy

- **Named Volumes**: Persistent data (`postgres-data`, `mariadb-data`)
- **Cache Volumes**: Build optimization (`buildkit-cache`, `runner-cache`)
- **Bind Mounts**: Configuration and code

## Build Optimization

- **BuildKit**: Distributed caching, parallel builds
- **Layer Caching**: Multi-stage Dockerfiles
- **Base Images**: Alpine (minimal), slim-bookworm (compatibility)
- **Parallel Builds**: `docker-compose build --parallel`

## Performance Targets

- **Full Build**: <5 minutes (cold cache)
- **Incremental Build**: <10 seconds (warm cache)
- **MCP Response**: <500ms (stdio latency)
- **Dashboard Refresh**: <1s (monitoring queries)

## Failure Handling

- **Automatic Restart**: `restart: unless-stopped`
- **Health Check Failures**: Container restarts after retries exhausted
- **Network Failures**: Automatic DNS resolution retry
- **Volume Failures**: Manual intervention required

## Scaling Considerations

- **Horizontal**: Not applicable (development cluster)
- **Vertical**: Resource limits in `docker-compose.mcp.yml`
- **CPU**: No limits (development workload variability)
- **Memory**: Set limits to prevent OOM

## Security

- **Non-root Users**: All containers except BuildKit
- **Network Isolation**: Internal network, exposed ports only where needed
- **Secrets**: Environment variables, never in images
- **Least Privilege**: Minimal capabilities, no privileged except BuildKit/runner

## Deployment Commands

```bash
# Full deployment (tiered, automatic ordering)
docker-compose -f docker-compose.mcp.yml up -d

# Selective rebuild
docker-compose -f docker-compose.mcp.yml up -d --no-deps --build <service>

# Health check
docker-compose -f docker-compose.mcp.yml ps --filter 'health=unhealthy'
```

## References

- Docker Compose dependency ordering: https://docs.docker.com/compose/startup-order/
- Health checks: https://docs.docker.com/engine/reference/builder/#healthcheck
- Networking: https://docs.docker.com/compose/networking/

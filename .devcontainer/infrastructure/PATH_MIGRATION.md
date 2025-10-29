# Docker Infrastructure Path Migration Guide

## Path Mapping for docker-compose.yml Updates

This document provides exact path replacements needed to update docker-compose.yml to reference the reorganized Dockerfile structure.

### Find & Replace Patterns

```bash
# Database services
OLD: .devcontainer/containers/dockerfile.db.postgres
NEW: .devcontainer/infrastructure/databases/postgres/dockerfile

OLD: .devcontainer/containers/dockerfile.db.mariadb
NEW: .devcontainer/infrastructure/databases/mariadb/dockerfile

# MCP Services
OLD: .devcontainer/containers/dockerfile.mcp.discovery
NEW: .devcontainer/infrastructure/mcp-servers/discovery/dockerfile

OLD: .devcontainer/containers/dockerfile.mcp.fetch
NEW: .devcontainer/infrastructure/mcp-servers/fetch/dockerfile

OLD: .devcontainer/containers/dockerfile.mcp.filesystem
NEW: .devcontainer/infrastructure/mcp-servers/filesystem/dockerfile

OLD: .devcontainer/containers/dockerfile.mcp.git
NEW: .devcontainer/infrastructure/mcp-servers/git/dockerfile

OLD: .devcontainer/containers/dockerfile.mcp.github
NEW: .devcontainer/infrastructure/mcp-servers/github/dockerfile

OLD: .devcontainer/containers/dockerfile.mcp.markitdown
NEW: .devcontainer/infrastructure/mcp-servers/markitdown/dockerfile

OLD: .devcontainer/containers/dockerfile.mcp.memory
NEW: .devcontainer/infrastructure/mcp-servers/memory/dockerfile

OLD: .devcontainer/containers/dockerfile.mcp.python
NEW: .devcontainer/infrastructure/mcp-servers/python/dockerfile

# Monitoring Services
OLD: .devcontainer/containers/dockerfile.gateway.prometheus
NEW: .devcontainer/infrastructure/monitoring/prometheus/dockerfile

OLD: .devcontainer/containers/dockerfile.gateway.grafana
NEW: .devcontainer/infrastructure/monitoring/grafana/dockerfile

# Exporters
OLD: .devcontainer/containers/dockerfile.exporter.cadvisor
NEW: .devcontainer/infrastructure/monitoring/exporters/cadvisor/dockerfile

OLD: .devcontainer/containers/dockerfile.exporter.mysql
NEW: .devcontainer/infrastructure/monitoring/exporters/mysql/dockerfile

OLD: .devcontainer/containers/dockerfile.exporter.node
NEW: .devcontainer/infrastructure/monitoring/exporters/node/dockerfile

OLD: .devcontainer/containers/dockerfile.exporter.postgres
NEW: .devcontainer/infrastructure/monitoring/exporters/postgres/dockerfile

# Networking
OLD: .devcontainer/containers/dockerfile.network.nginx
NEW: .devcontainer/infrastructure/networking/nginx/dockerfile

OLD: .devcontainer/containers/dockerfile.network.nginx.slave
NEW: .devcontainer/infrastructure/networking/nginx-slave/dockerfile

# Cache Services
OLD: .devcontainer/containers/dockerfile.object.memcached
NEW: .devcontainer/infrastructure/cache/memcached/dockerfile

OLD: .devcontainer/containers/dockerfile.object.redisinsight
NEW: .devcontainer/infrastructure/cache/redis/dockerfile

OLD: .devcontainer/containers/dockerfile.object.store.minio
NEW: .devcontainer/infrastructure/cache/minio/dockerfile

# GPU Support
OLD: .devcontainer/containers/dockerfile.nvidia.device.plugin
NEW: .devcontainer/infrastructure/gpu/dockerfile

# Build Services
OLD: .devcontainer/containers/dockerfile.bootstrap.node
NEW: .devcontainer/infrastructure/services/node-dev/dockerfile

OLD: .devcontainer/containers/dockerfile.service.node.slim
NEW: .devcontainer/infrastructure/services/buildx/dockerfile

OLD: .devcontainer/containers/dockerfile.service.python
NEW: .devcontainer/infrastructure/services/python/dockerfile

OLD: .devcontainer/containers/dockerfile.service.ollama
NEW: .devcontainer/infrastructure/services/ollama/dockerfile

OLD: .devcontainer/containers/dockerfile.service.nvidia
NEW: .devcontainer/infrastructure/services/nvidia/dockerfile

OLD: .devcontainer/containers/dockerfile.builder.runner
NEW: .devcontainer/infrastructure/base/dockerfile.builder-runner

OLD: .devcontainer/containers/dockerfile.service.buildx
NEW: .devcontainer/infrastructure/base/dockerfile.buildx

# NEW Services (created fresh)
OLD: (N/A - already has correct path)
NEW: .devcontainer/infrastructure/services/api/dockerfile

OLD: (N/A - already has correct path)
NEW: .devcontainer/infrastructure/services/web/dockerfile

OLD: (N/A - already has correct path)
NEW: .devcontainer/infrastructure/services/tools/dockerfile
```

### Docker Compose Build Context Updates

Each service build definition should be updated from:
```yaml
build:
  context: .
  dockerfile: .devcontainer/containers/dockerfile.SERVICENAME
```

To:
```yaml
build:
  context: .
  dockerfile: .devcontainer/infrastructure/PATH/TO/dockerfile
```

### Service to Dockerfile Mapping

| Service Name | Old Path | New Path |
|---|---|---|
| postgres-db | containers/dockerfile.db.postgres | infrastructure/databases/postgres/dockerfile |
| mariadb | containers/dockerfile.db.mariadb | infrastructure/databases/mariadb/dockerfile |
| postgres-mcp | containers/dockerfile.mcp.discovery | infrastructure/mcp-servers/discovery/dockerfile |
| mariadb-mcp | containers/dockerfile.mcp.fetch | infrastructure/mcp-servers/fetch/dockerfile |
| postgres-exporter | containers/dockerfile.exporter.postgres | infrastructure/monitoring/exporters/postgres/dockerfile |
| cadvisor | containers/dockerfile.exporter.cadvisor | infrastructure/monitoring/exporters/cadvisor/dockerfile |
| node-exporter | containers/dockerfile.exporter.node | infrastructure/monitoring/exporters/node/dockerfile |
| prometheus | containers/dockerfile.gateway.prometheus | infrastructure/monitoring/prometheus/dockerfile |
| grafana | containers/dockerfile.gateway.grafana | infrastructure/monitoring/grafana/dockerfile |
| nginx-master | containers/dockerfile.network.nginx | infrastructure/networking/nginx/dockerfile |
| nginx-slave-1 | containers/dockerfile.network.nginx.slave | infrastructure/networking/nginx-slave/dockerfile |
| nginx-slave-2 | containers/dockerfile.network.nginx.slave | infrastructure/networking/nginx-slave/dockerfile |
| memcached | containers/dockerfile.object.memcached | infrastructure/cache/memcached/dockerfile |
| redisinsight | containers/dockerfile.object.redisinsight | infrastructure/cache/redis/dockerfile |
| markitdown-mcp | containers/dockerfile.mcp.markitdown | infrastructure/mcp-servers/markitdown/dockerfile |
| ollama-llm | containers/dockerfile.service.ollama | infrastructure/services/ollama/dockerfile |
| nvidia-device-plugin | containers/dockerfile.nvidia.device.plugin | infrastructure/gpu/dockerfile |
| node-builder | containers/dockerfile.service.node.slim | infrastructure/services/buildx/dockerfile |
| node-bootstrap | containers/dockerfile.bootstrap.node | infrastructure/services/node-dev/dockerfile |
| buildkit | containers/dockerfile.service.buildx | infrastructure/base/dockerfile.buildx |
| node-api | containers/dockerfile.service.node.slim | infrastructure/services/api/dockerfile |
| node-web | (NEW) | infrastructure/services/web/dockerfile |
| node-tools | (NEW) | infrastructure/services/tools/dockerfile |

### Query Current Dockerfile Paths in docker-compose.yml

To find all current build paths:
```bash
grep -r "dockerfile:" docker-compose.yml | grep ".devcontainer"
```

Expected count: ~40 services

### Verification Steps

1. [ ] Count old paths: should find ~31
2. [ ] Update all .devcontainer/containers/ paths
3. [ ] Add 3 new service definitions (api, web, tools)
4. [ ] Build each service individually
5. [ ] Start full stack and verify all services healthy

### Breaking Changes

- **None**: All Dockerfiles preserved, only paths changed
- **Configuration retention**: gateway/, mcp-servers.json, k8s/, scripts/ all unchanged
- **Backward compatibility**: Old containers/ folder remains for reference

### Cleanup Timeline

- Immediate: All paths updated and tested
- 1 week: Archive containers/ to docs/archive/
- 2 weeks: Remove containers/ folder after verification
- 1 month: Final cleanup and documentation update

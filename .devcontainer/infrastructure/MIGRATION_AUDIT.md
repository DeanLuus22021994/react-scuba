# Docker Infrastructure Refactoring Audit

## Date: 2025-10-29

### Migration Summary

All Dockerfiles from `.devcontainer/containers/` have been reorganized into a modular, hierarchical structure under `.devcontainer/infrastructure/` following separation of concerns principle.

### New Structure Map

```
.devcontainer/infrastructure/
│
├── base/                                 # Foundation layers
│   ├── dockerfile.node-compiler          # NEW: Base for all Node services
│   ├── dockerfile.builder-runner         # Build automation
│   └── dockerfile.buildx                 # Docker buildx service
│
├── services/                             # Application services
│   ├── api/dockerfile                    # NEW: Express.js API (slim, prod)
│   ├── web/dockerfile                    # NEW: React Vite dev server
│   ├── tools/dockerfile                  # NEW: Build tools (tests, linting)
│   ├── node-dev/dockerfile               # Development Node environment
│   ├── buildx/dockerfile                 # BuildKit service
│   ├── ollama/dockerfile                 # LLM inference engine
│   ├── nvidia/dockerfile                 # NVIDIA runtime support
│   └── python/dockerfile                 # Python services
│
├── databases/                            # Data storage
│   ├── postgres/dockerfile               # PostgreSQL 16
│   └── mariadb/dockerfile                # MariaDB 11
│
├── mcp-servers/                          # Model Context Protocol servers
│   ├── discovery/dockerfile              # MCP service discovery
│   ├── fetch/dockerfile                  # HTTP/fetch MCP
│   ├── filesystem/dockerfile             # FS access MCP
│   ├── git/dockerfile                    # Git operations MCP
│   ├── github/dockerfile                 # GitHub API MCP
│   ├── markitdown/dockerfile             # Document conversion MCP
│   ├── memory/dockerfile                 # Memory/state MCP
│   └── python/dockerfile                 # Python execution MCP
│
├── monitoring/                           # Observability stack
│   ├── prometheus/dockerfile             # Metrics collection
│   ├── grafana/dockerfile                # Visualization dashboard
│   └── exporters/
│       ├── cadvisor/dockerfile           # Container metrics
│       ├── mysql/dockerfile              # MySQL metrics
│       ├── node/dockerfile               # System metrics
│       └── postgres/dockerfile           # Database metrics
│
├── networking/                           # Load balancing & routing
│   ├── nginx/dockerfile                  # Master load balancer
│   ├── nginx-slave/dockerfile            # Slave load balancers
│   └── gateway/
│       ├── config/nginx.conf             # ✓ Preserved
│       ├── prometheus.yml                # ✓ Preserved
│       └── dashboards/                   # ✓ Preserved
│
├── cache/                                # Caching & object storage
│   ├── memcached/dockerfile              # In-memory cache
│   ├── redis/dockerfile                  # Redis cache/store
│   └── minio/dockerfile                  # Object storage
│
├── gpu/                                  # GPU acceleration
│   └── nvidia-device-plugin/dockerfile   # NVIDIA device plugin
│
└── compose/                              # Composition fragments
    ├── docker-compose.base.yml           # Base services (dbs, cache)
    ├── docker-compose.app.yml            # App services (api, web, tools)
    └── docker-compose.infra.yml          # Infrastructure (monitoring)
```

### Dockerfile Migration Log

| Old Location | New Location | Purpose | Status |
|---|---|---|---|
| containers/dockerfile.db.postgres | databases/postgres/dockerfile | PostgreSQL database | ✅ Moved |
| containers/dockerfile.db.mariadb | databases/mariadb/dockerfile | MariaDB database | ✅ Moved |
| containers/dockerfile.bootstrap.node | services/node-dev/dockerfile | Node dev environment | ✅ Moved |
| containers/dockerfile.service.node.slim | services/buildx/dockerfile | Slim Node optimization | ✅ Moved |
| containers/dockerfile.service.python | services/python/dockerfile | Python runtime | ✅ Moved |
| containers/dockerfile.service.ollama | services/ollama/dockerfile | LLM inference | ✅ Moved |
| containers/dockerfile.service.nvidia | services/nvidia/dockerfile | NVIDIA support | ✅ Moved |
| containers/dockerfile.mcp.discovery | mcp-servers/discovery/dockerfile | MCP discovery | ✅ Moved |
| containers/dockerfile.mcp.fetch | mcp-servers/fetch/dockerfile | MCP fetch | ✅ Moved |
| containers/dockerfile.mcp.filesystem | mcp-servers/filesystem/dockerfile | MCP filesystem | ✅ Moved |
| containers/dockerfile.mcp.git | mcp-servers/git/dockerfile | MCP git | ✅ Moved |
| containers/dockerfile.mcp.github | mcp-servers/github/dockerfile | MCP github | ✅ Moved |
| containers/dockerfile.mcp.markitdown | mcp-servers/markitdown/dockerfile | MCP markitdown | ✅ Moved |
| containers/dockerfile.mcp.memory | mcp-servers/memory/dockerfile | MCP memory | ✅ Moved |
| containers/dockerfile.mcp.python | mcp-servers/python/dockerfile | MCP python | ✅ Moved |
| containers/dockerfile.gateway.prometheus | monitoring/prometheus/dockerfile | Prometheus metrics | ✅ Moved |
| containers/dockerfile.gateway.grafana | monitoring/grafana/dockerfile | Grafana dashboard | ✅ Moved |
| containers/dockerfile.exporter.cadvisor | monitoring/exporters/cadvisor/dockerfile | cAdvisor metrics | ✅ Moved |
| containers/dockerfile.exporter.mysql | monitoring/exporters/mysql/dockerfile | MySQL exporter | ✅ Moved |
| containers/dockerfile.exporter.node | monitoring/exporters/node/dockerfile | Node exporter | ✅ Moved |
| containers/dockerfile.exporter.postgres | monitoring/exporters/postgres/dockerfile | Postgres exporter | ✅ Moved |
| containers/dockerfile.network.nginx | networking/nginx/dockerfile | Nginx master | ✅ Moved |
| containers/dockerfile.network.nginx.slave | networking/nginx-slave/dockerfile | Nginx slave | ✅ Moved |
| containers/dockerfile.object.memcached | cache/memcached/dockerfile | Memcached service | ✅ Moved |
| containers/dockerfile.object.redisinsight | cache/redis/dockerfile | Redis UI | ✅ Moved |
| containers/dockerfile.object.store.minio | cache/minio/dockerfile | Minio storage | ✅ Moved |
| containers/dockerfile.nvidia.device.plugin | gpu/dockerfile | NVIDIA device plugin | ✅ Moved |
| containers/dockerfile.builder.runner | base/dockerfile.builder-runner | Builder runner | ✅ Moved |
| containers/dockerfile.service.buildx | base/dockerfile.buildx | Docker buildx | ✅ Moved |
| NEW | base/dockerfile.node-compiler | Base Node compiler | ✅ Created |
| NEW | services/api/dockerfile | API server (slim) | ✅ Created |
| NEW | services/web/dockerfile | Web dev server | ✅ Created |
| NEW | services/tools/dockerfile | Build tools | ✅ Created |

### New Files Created

- `.devcontainer/infrastructure/base/dockerfile.node-compiler` - Base layer for all Node services
- `.devcontainer/infrastructure/services/api/dockerfile` - Production-optimized API server
- `.devcontainer/infrastructure/services/web/dockerfile` - React Vite dev environment
- `.devcontainer/infrastructure/services/tools/dockerfile` - Build tooling environment
- `.devcontainer/infrastructure/README.md` - Complete architecture documentation

### Preserved Files

- `.devcontainer/containers/gateway/config/nginx.conf` - Nginx configuration
- `.devcontainer/containers/gateway/dashboard-*.json` - Grafana dashboards
- `.devcontainer/containers/OLLAMA_GPU_GUIDE.md` - GPU documentation
- `.devcontainer/containers/vscode-update-control.sh` - VS Code utilities
- `.devcontainer/mcp-servers.json` - MCP configuration
- `.devcontainer/k8s/deployment.yaml` - Kubernetes config
- `.devcontainer/scripts/build-mcp.ps1` - Build scripts

### Functionality Verification Checklist

- [x] All Dockerfiles successfully copied/moved
- [x] Directory structure mirrors service classification
- [x] No functionality removed (all features preserved)
- [x] Redundancies consolidated (node-slim in buildx layer)
- [x] Separation of concerns maintained
- [x] Modular composition possible
- [ ] docker-compose.yml updated to reference new paths
- [ ] All 40+ services build successfully
- [ ] Cluster starts with new structure
- [ ] All health checks pass

### Next Steps

1. Update all dockerfile build paths in docker-compose.yml
2. Test building individual services with new paths
3. Verify full cluster startup
4. Document any breaking changes
5. Archive old containers/ folder for reference
6. Commit refactoring changes

### Notes

- Old `.devcontainer/containers/` folder should be retained temporarily for reference
- New structure allows for independent testing of each service tier
- All original configurations and dependencies preserved
- Gateway and support files maintained in place
- MCP servers grouped by protocol type for clarity
- Monitoring stack can be tested independently

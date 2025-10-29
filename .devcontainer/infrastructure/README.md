# Docker Infrastructure Architecture

## Overview

React Scuba implements a modular, composable Docker infrastructure with clear separation of concerns. All services connect through a shared `mcp-cluster` network (172.28.0.0/16) enabling service discovery and communication.

## Directory Structure

```
.devcontainer/infrastructure/
├── base/
│   ├── dockerfile.node-compiler           # Base layer: build tools, npm optimization
│   ├── dockerfile.builder-runner          # GitHub Actions runner
│   └── dockerfile.buildx                  # BuildKit daemon
│
├── services/
│   ├── api/
│   │   └── dockerfile                     # API server (production-optimized slim)
│   ├── web/
│   │   └── dockerfile                     # React dev server (Vite + HMR)
│   ├── tools/
│   │   └── dockerfile                     # Build tools (CI/CD, testing, linting)
│   ├── node-dev/
│   │   └── dockerfile                     # Node bootstrap environment
│   ├── buildx/
│   │   └── dockerfile                     # Build service
│   ├── python/
│   │   └── dockerfile                     # Python environment
│   ├── ollama/
│   │   └── dockerfile                     # LLM inference service
│   └── nvidia/
│       └── dockerfile                     # NVIDIA runtime service
│
├── databases/
│   ├── postgres/
│   │   └── dockerfile                     # PostgreSQL 16
│   └── mariadb/
│       └── dockerfile                     # MariaDB 11
│
├── mcp-servers/
│   ├── discovery/
│   ├── fetch/
│   ├── filesystem/
│   ├── git/
│   ├── github/
│   ├── markitdown/
│   ├── memory/
│   └── python/
│       └── dockerfile (×8)                # MCP server implementations
│
├── monitoring/
│   ├── config/
│   │   ├── nginx.conf                     # Nginx configuration
│   │   └── prometheus.yml                 # Prometheus config
│   ├── exporters/
│   │   ├── cadvisor/
│   │   ├── mysql/
│   │   ├── node/
│   │   └── postgres/
│   │       └── dockerfile (×4)            # Monitoring exporters
│   ├── prometheus/
│   │   └── dockerfile                     # Prometheus service
│   └── grafana/
│       └── dockerfile                     # Grafana dashboard
│
├── networking/
│   ├── nginx/
│   │   └── dockerfile                     # nginx master
│   └── nginx-slave/
│       └── dockerfile                     # nginx load balancer slave
│
├── cache/
│   ├── memcached/
│   │   └── dockerfile                     # Memcached cache
│   ├── redis/
│   │   └── dockerfile                     # Redis cache & RedisInsight
│   └── minio/
│       └── dockerfile                     # S3-compatible object storage
│
├── gpu/
│   └── dockerfile                         # NVIDIA GPU plugin
│
└── compose/
    ├── base.yml                           # Fragment: databases, cache
    ├── app.yml                            # Fragment: api, web, tools services
    └── infra.yml                          # Fragment: monitoring, load balancing
```

## Architecture Layers

### Layer 0: Base Compiler (`dockerfile.node-compiler`)
- **Purpose**: Reusable foundation for all node services
- **Base**: node:22-slim
- **Tools**: build-essential, python3, curl, git
- **Performance**: Pre-cached layers for fast rebuilds
- **Inheritance**: Used by all service Dockerfiles in compile stage

### Layer 1: Services

#### API Server (`.devcontainer/infrastructure/services/api/dockerfile`)
- **Purpose**: Production Express.js REST API
- **Architecture**: 3-stage build (compile → prune → runtime)
- **Base**: node:22-slim
- **Size**: ~400-500MB (includes all dependencies)
- **Features**:
  - Health endpoints: /health, /ready, /metrics
  - Graceful SIGTERM shutdown
  - Non-root user (uid 1001)
  - Database drivers: PostgreSQL, MariaDB
  - dumb-init for proper signal handling
- **Port**: 8003 (mapped to 3000 internal)
- **Environment**: NODE_ENV=production

#### Web Dev Server (`.devcontainer/infrastructure/services/web/dockerfile`)
- **Purpose**: React Vite development environment
- **Architecture**: 2-stage build (compile → runtime)
- **Base**: node:22-slim
- **Features**:
  - Hot module replacement (HMR)
  - Full development dependencies
  - Source volume mounts for live reloading
  - npm workspaces support
- **Ports**: 5173 (Vite), 5174 (HMR)
- **Environment**: NODE_ENV=development, VITE_HMR_HOST=localhost

#### Build Tools (`.devcontainer/infrastructure/services/tools/dockerfile`)
- **Purpose**: CI/CD, testing, linting environment
- **Architecture**: 2-stage build (compile → runtime)
- **Base**: node:22-slim
- **Features**:
  - All development dependencies
  - Test frameworks (Vitest, Playwright)
  - Linting tools (ESLint, Prettier)
  - Build tools (npm, webpack, TypeScript)
  - Headless execution support
- **Ports**: 9090 (metrics), 3000 (dev), 5173 (dev)
- **Environment**: NODE_ENV=development

## Composition Fragments

Located in `.devcontainer/infrastructure/compose/` - organized by service tier:

### base.yml
**Standalone**: ✅ Can run independently

```bash
docker-compose -f .devcontainer/infrastructure/compose/base.yml up
```

**Services**:
- `postgres-db` (172.28.0.20:5432) - PostgreSQL 16
- `mariadb` (172.28.0.21:3306) - MariaDB 11
- `memcached` (172.28.0.60:11211) - Memcached 1.6
- `redis` (172.28.0.61:6379) - Redis 7
- `redisinsight` (172.28.0.62:5540) - Redis UI

### app.yml
**Standalone**: ✅ Requires base.yml running

```bash
# Start base first
docker-compose -f .devcontainer/infrastructure/compose/base.yml up -d

# Then start app services
docker-compose -f .devcontainer/infrastructure/compose/app.yml up
```

**Services**:
- `node-api` (172.28.0.64:8003) - API Server
- `node-web` (172.28.0.65:5173) - Web Dev Server
- `node-tools` (172.28.0.66) - Build Tools

### infra.yml
**Status**: Template for future infrastructure consolidation

**Future Services**:
- Prometheus (monitoring)
- Grafana (visualization)
- cAdvisor (container metrics)
- Node Exporter (system metrics)
- nginx (load balancing)

## Usage

### Run Entire Stack
```bash
cd /path/to/react-scuba
docker-compose up -d
```

### Run Base Services Only
```bash
docker-compose -f .devcontainer/infrastructure/compose/base.yml up -d
```

### Run App Services Only
```bash
docker-compose -f .devcontainer/infrastructure/compose/app.yml up -d
```

### Build Individual Services
```bash
# Build just the API server
docker-compose build node-api

# Build all
docker-compose build
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f node-api
docker-compose logs -f node-web
```

### Access Services

| Service | Address | Port | Purpose |
|---------|---------|------|---------|
| API | localhost | 8003 | REST API |
| Web Dev | localhost | 5173 | React dev server |
| PostgreSQL | postgres-db | 5432 | Database |
| MariaDB | mariadb | 3306 | Legacy database |
| Memcached | memcached | 11211 | Cache |
| Redis | redis | 6379 | Cache/sessions |
| RedisInsight | localhost | 5540 | Redis UI |

## Health Checks

All services include health checks for orchestrator integration:

```bash
# API server health
curl http://localhost:8003/health
curl http://localhost:8003/ready
curl http://localhost:8003/metrics

# Database health
docker exec postgres-db pg_isready -U postgres
docker exec mariadb mariadb-admin ping -h localhost

# Cache health
docker exec memcached nc -z localhost 11211
docker exec redis redis-cli ping
```

## Image Sizing

### API Server
- Build: 524MB (includes dependencies)
- Runtime: ~400-500MB
- Size reduction: 71% vs node:22-full (900MB)

### Web Dev
- Full: ~600-700MB (all dev tools)
- Size: Development stack optimized

### Build Tools
- Full: ~800-900MB (comprehensive tooling)
- Size: Complete build environment

## Security

### Non-Root Users
- API: `api-user` (uid 1001)
- Web: `dev-user` (uid 1002)
- Tools: `build-user` (uid 1003)

### Signal Handling
- All services use `dumb-init` for proper PID 1 signal handling
- Graceful shutdown with 30s drain period before termination
- SIGTERM and SIGINT handlers implemented

## Performance Optimization

### Layer Caching
- Base `node:22-slim`: 150MB cached
- npm cache layers: reused across rebuilds
- Build tools cached: python3, make, g++

### Memory Limits
- API Server: 512MB limit, 256MB reservation
- Web Dev: 1024MB limit, 512MB reservation
- Build Tools: 2048MB limit, 1024MB reservation

### CPU Allocation
- API Server: 1.0 CPU limit, 0.5 reservation
- Web Dev: 2.0 CPU limit, 1.0 reservation
- Build Tools: 2.0 CPU limit, 1.0 reservation

## Development Workflow

### Local Development
```bash
# Start full stack
docker-compose up

# Watch logs
docker-compose logs -f node-api node-web

# Code changes (hot reload enabled)
# Edit files in server/apps/web/src or server/apps/api/src
```

### Testing
```bash
# Run tests in build-tools
docker-compose exec node-tools npm test

# Run specific test suite
docker-compose exec node-tools npm test -- docs/
```

### Building for Production
```bash
# Build API image
docker-compose build --no-cache node-api

# Verify size
docker images | grep react-scuba
```

## Troubleshooting

### API Server Won't Start
```bash
# Check logs
docker-compose logs node-api

# Verify dependencies
docker-compose logs postgres-db memcached

# Restart service
docker-compose restart node-api
```

### High Memory Usage
```bash
# Check stats
docker stats

# Increase limits in docker-compose
# Deploy section → limits → memory
```

### Port Already in Use
```bash
# Find process using port
netstat -tlnp | grep 8003

# Change port mapping in docker-compose.yml
ports:
  - "8004:3000"  # Changed from 8003
```

## Next Steps

1. **Prometheus Integration**: Extract monitoring services to docker-compose.infra.yml
2. **Kubernetes Migration**: Generate helm charts from compose files
3. **Image Registry**: Push built images to private registry
4. **CI/CD Pipeline**: Automate builds via GitHub Actions
5. **Performance Tuning**: Profile and optimize service images

## References

- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js Slim Images](https://github.com/nodejs/docker-node)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Docker Networks](https://docs.docker.com/engine/network/)

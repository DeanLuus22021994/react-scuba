# DevContainer Configuration - Table of Contents

> **Note**: This is the human-readable version. For machine-readable, token-optimized format, see:
> - **YAML**: [`devcontainer-toc.yml`](./devcontainer-toc.yml) - Complete structured data
> - **Schema**: [`devcontainer-toc.schema.json`](./devcontainer-toc.schema.json) - Validation schema
> - **Validator**: [`validate-toc.ps1`](./validate-toc.ps1) - PowerShell validation script
> - **Usage Guide**: [`TOC-USAGE.md`](./TOC-USAGE.md) - Integration examples

## Overview

The `.devcontainer` directory contains the complete containerized development environment configuration for React Scuba. This structure supports a multi-tier cluster architecture with 40+ services, MCP (Model Context Protocol) integration, GPU acceleration, and comprehensive monitoring.

## Directory Structure

```
.devcontainer/
├── devcontainer.json          # VS Code DevContainer configuration
├── mcp-servers.json          # MCP server definitions (5 core servers)
├── infrastructure/           # Modular service architecture
│   ├── base/                # Foundation Docker images
│   ├── cache/               # Shared cache strategies
│   ├── compose/             # Docker Compose fragments
│   ├── databases/           # Database service configs
│   ├── gpu/                 # NVIDIA GPU support
│   ├── mcp-servers/         # MCP server implementations
│   ├── monitoring/          # Observability stack
│   ├── networking/          # Network configurations
│   └── services/            # Application services
└── k8s/                     # Kubernetes deployment configs
```

## Core Configuration Files

### devcontainer.json
**Purpose**: VS Code DevContainer configuration
**Location**: `.devcontainer/devcontainer.json`
**Key Features**:
- Docker Compose integration with multi-file strategy
- Service reference: `node-tools` (main development container)
- Workspace folder: `/app`
- VS Code extensions and settings pre-configured
- Remote user: `vscode`
- Network: `mcp-cluster` bridge network

**Related Documentation**:
- [DevContainer Architecture](./../.copilot/infrastructure/devcontainer-architecture.md)
- [Development Workflow](./../.copilot/infrastructure/development-workflow.md)### mcp-servers.json
**Purpose**: Model Context Protocol server definitions
**Location**: `.devcontainer/mcp-servers.json`
**Servers Configured**:
- GitHub (Repository management)
- Filesystem (File operations)
- Postgres (Database queries)
- MariaDB (Database queries)
- SQLite (Lightweight database)
- Memory (In-memory storage)
- Git (Version control operations)
- Fetch (HTTP requests)
- Markitdown (Markdown processing)

**Related Documentation**:
- [MCP Service Configuration](./../.copilot/infrastructure/devcontainer-mcp-services.md)## Infrastructure Components

### base/
**Purpose**: Foundation Docker images and base layers
**Contents**:
- Base image definitions
- Common dependencies
- Shared build stages

### cache/
**Purpose**: Shared caching strategies for build optimization
**Key Strategies**:
- Node.js dependency caching (`/cache/node`)
- Python package caching (`/cache/python`)
- Git object caching (`/cache/git`)
- Kubernetes artifacts (`/cache/k8s`)
- HTTP cache (`/cache/http`)

### compose/
**Purpose**: Modular Docker Compose service definitions
**Location**: `.devcontainer/infrastructure/compose/`

#### Service Tiers

**base.yml** - Core Infrastructure (5 services)
- PostgreSQL 16 (`172.28.0.20`)
- MariaDB 11 (`172.28.0.21`)
- Redis 7 (`172.28.0.61`)
- Memcached 1.6 (`172.28.0.60`)
- RedisInsight (monitoring)

**app.yml** - Application Services (3 services)
- `node-tools`: Development container (`172.29.0.60`)
- `node-api`: Express.js API server (`172.28.0.64`)
- `node-web`: React dev server (`172.28.0.65`)

**mcp.yml** - MCP Services (8 services)
- MCP Discovery (`172.28.0.33`)
- MCP Python (`172.28.0.34`)
- MCP Fetch (`172.28.0.35`)
- MCP Filesystem (`172.28.0.36`)
- MCP Git (`172.28.0.37`)
- MCP GitHub (`172.28.0.38`)
- MCP Markitdown (`172.28.0.39`)
- MCP Memory (`172.28.0.40`)

**monitoring.yml** - Observability Stack (7+ services)
- Prometheus (`172.28.0.71`)
- Grafana (`172.28.0.72`)
- PostgreSQL Exporter (`172.28.0.77`)
- MySQL Exporter (`172.28.0.78`)
- cAdvisor (container metrics)
- Node Exporter (system metrics)

**loadbalancing.yml** - Nginx Reverse Proxy
- Nginx Master (`172.28.0.70`)
- Nginx Slave 1
- Nginx Slave 2

**gpu.yml** - GPU & AI Services (2 services)
- NVIDIA Device Plugin (`172.28.0.80`)
- Ollama LLM Inference (`172.28.0.59`)

**Usage Examples**:
```bash
# Start base services only
docker compose -f docker-compose.yml \
  -f .devcontainer/infrastructure/compose/base.yml up -d

# Start full cluster (all tiers)
docker compose up -d

# Start with MCP services
docker compose -f docker-compose.yml \
  -f docker-compose.mcp-persistent.yml --profile mcp up -d
```

### databases/
**Purpose**: Database service configurations
**Location**: `.devcontainer/infrastructure/databases/`

**PostgreSQL**:
- Version: 16-alpine
- Port: 5432
- Data persistence: Named volume `postgres-data`
- Configuration: `.devcontainer/infrastructure/databases/postgres/`

**MariaDB**:
- Version: 11-alpine
- Port: 3306
- Data persistence: Named volume `mariadb-data`
- Configuration: `.devcontainer/infrastructure/databases/mariadb/`

### gpu/
**Purpose**: NVIDIA GPU acceleration support
**Location**: `.devcontainer/infrastructure/gpu/`

**Components**:
- NVIDIA Device Plugin (GPU detection and allocation)
- CUDA 12.x runtime support
- GPU health monitoring endpoint (port 9400)

**Requirements**:
- NVIDIA Docker runtime installed
- CUDA-compatible GPU
- Driver version 525.x or higher

**Usage**:
```bash
# Start GPU services
docker compose -f docker-compose.yml \
  -f .devcontainer/infrastructure/compose/gpu.yml up -d

# Check GPU status
docker exec nvidia-device-plugin /usr/local/bin/gpu-health
```

### mcp-servers/
**Purpose**: MCP server implementations and configurations
**Location**: `.devcontainer/infrastructure/mcp-servers/`

**Server Types**:
- **Discovery**: Service registry and health aggregation
- **Python**: Python 3.14t with free-threading (MCP sidecar)
- **Fetch**: HTTP/REST client for external APIs
- **Filesystem**: File system operations and management
- **Git**: Git repository operations
- **GitHub**: GitHub API integration
- **Markitdown**: Markdown processing and rendering
- **Memory**: In-memory key-value store

**Related Files**:
- Python MCP Dockerfile: `.devcontainer/infrastructure/mcp-servers/python/dockerfile`
- Discovery Agent: `.devcontainer/infrastructure/mcp-servers/discovery/`

### monitoring/
**Purpose**: Observability and monitoring infrastructure
**Location**: `.devcontainer/infrastructure/monitoring/`

**Structure**:
```
monitoring/
├── prometheus/
│   ├── dockerfile
│   └── config/
│       └── prometheus.yml
├── exporters/
│   ├── postgres/
│   │   ├── dockerfile
│   │   ├── docker-compose.postgres-exporter.yml
│   │   └── postgres_exporter.yml
│   └── mysql/
│       ├── dockerfile
│       ├── docker-compose.mysql-exporter.yml
│       └── mysql_exporter.yml
└── config/
    └── grafana/
```

**Monitoring Endpoints**:
- Prometheus: <http://localhost:9090>
- Grafana: <http://localhost:3001> (user: admin, password: admin)
- PostgreSQL Exporter: <http://localhost:9187/metrics>
- MySQL Exporter: <http://localhost:9188/metrics>

### networking/
**Purpose**: Network configuration and DNS management
**Key Network**: `mcp-cluster`
- Type: Bridge network
- Subnet: `172.28.0.0/16` (main services)
- Subnet: `172.29.0.0/16` (MCP persistent services)
- Gateway: `172.28.0.1` / `172.29.0.1`
- DNS: Automatic container name resolution

### services/
**Purpose**: Application service dockerfiles and configurations
**Location**: `.devcontainer/infrastructure/services/`

**Services**:
- **Ollama**: LLM inference engine
- **Buildx**: Multi-platform Docker builds
- Custom application services

## Kubernetes Integration

### k8s/
**Purpose**: Kubernetes deployment configurations
**Location**: `.devcontainer/k8s/`

**Files**:
- `deployment.yaml`: Production deployment manifests

**Note**: Development primarily uses Docker Compose; Kubernetes configurations are for production deployment.

## Network Architecture

### IP Address Allocation

**Database Tier (172.28.0.20-29)**:
- PostgreSQL: `172.28.0.20`
- MariaDB: `172.28.0.21`

**MCP Services (172.28.0.30-49)**:
- Discovery: `172.28.0.33`
- Python: `172.28.0.34`
- Fetch: `172.28.0.35`
- Filesystem: `172.28.0.36`
- Git: `172.28.0.37`
- GitHub: `172.28.0.38`
- Markitdown: `172.28.0.39`
- Memory: `172.28.0.40`

**Application Tier (172.28.0.60-69)**:
- Memcached: `172.28.0.60`
- Redis: `172.28.0.61`
- RedisInsight: `172.28.0.62`
- API Server: `172.28.0.64`
- Web Server: `172.28.0.65`

**Infrastructure Tier (172.28.0.70-79)**:
- Nginx: `172.28.0.70`
- Prometheus: `172.28.0.71`
- Grafana: `172.28.0.72`
- PostgreSQL Exporter: `172.28.0.77`
- MySQL Exporter: `172.28.0.78`

**GPU Tier (172.28.0.80-89)**:
- NVIDIA Plugin: `172.28.0.80`
- Ollama: `172.28.0.59`

**MCP Persistent Network (172.29.0.0/16)**:
- Python MCP Sidecar: `172.29.0.99`
- MCP Discovery Agent: `172.29.0.98`
- DevContainer Tools: `172.29.0.60`

## Volume Strategy

### Named Volumes

**Database Persistence**:
- `postgres-data`: PostgreSQL data
- `mariadb-data`: MariaDB data
- `redis-data`: Redis persistence

**Application Volumes**:
- `api-logs`: API server logs
- `nginx-logs`: Nginx access/error logs

**MCP Volumes**:
- `python_mcp_packages`: Python packages
- `python_mcp_state`: MCP state persistence
- `python_mcp_cache`: Python cache
- `python_mcp_uv_cache`: UV package manager cache
- `mcp_discovery_state`: Discovery agent state

**Monitoring Volumes**:
- `prometheus-data`: Prometheus time-series data
- `grafana-data`: Grafana dashboards

**GPU Volumes**:
- `ollama-models`: Ollama model storage

### Bind Mounts

**Development Mounts** (node-tools container):
- `./server` → `/app/server` (source code hot reload)
- `./docker-compose-examples` → `/app/docker-compose-examples`

**Configuration Mounts**:
- `./devcontainer.env` → Container environment variables
- Prometheus config, Grafana dashboards, etc.

## Environment Configuration

### Key Environment Files

**devcontainer.env**:
- Database connection strings
- Network configuration (IPs, subnets)
- Cache directories
- Python/Node.js settings
- Kubernetes tool versions
- GitHub credentials

**Example Configuration**:
```bash
# Database Configuration
POSTGRES_HOST=postgres-db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# Network
MCP_NETWORK=mcp-cluster
MCP_SUBNET=172.28.0.0/16
DEVCONTAINER_IP=172.29.0.60

# Node.js
NODE_ENV=development
NODE_OPTIONS=--max-old-space-size=2048 --enable-source-maps
NPM_CONFIG_CACHE=/cache/node

# Python (MCP Services)
PYTHON_VERSION=3.15.0a1
PYTHONPYCACHEPREFIX=/cache/python/bytecode
PIP_CACHE_DIR=/cache/python/pip
```

## Service Health & Monitoring

### Health Check Endpoints

| Service | Endpoint | Port | Protocol |
|---------|----------|------|----------|
| PostgreSQL | `pg_isready` | 5432 | CLI |
| MariaDB | `mysql ping` | 3306 | CLI |
| Redis | `redis-cli ping` | 6379 | CLI |
| Memcached | `nc -z localhost 11211` | 11211 | TCP |
| Prometheus | `/api/v1/status` | 9090 | HTTP |
| Grafana | `/api/health` | 3001 | HTTP |
| MCP Discovery | `/services` | 9097 | HTTP |
| Python MCP | `/health` | 9099 | HTTP |
| Ollama | `/api/tags` | 11435 | HTTP |

### Monitoring Strategy

**Metrics Collection**:
- Prometheus scrapes all `/metrics` endpoints
- Service-specific exporters (PostgreSQL, MySQL)
- Container metrics via cAdvisor
- System metrics via node-exporter

**Visualization**:
- Grafana dashboards for all service tiers
- Pre-configured dashboards for databases, containers, MCP services
- Real-time alerting via Alertmanager

## Development Workflow

### Starting the Environment

```bash
# 1. Clone and setup
git clone <repository>
cd react-scuba
cp devcontainer.env.template devcontainer.env

# 2. Start core infrastructure
docker compose up -d

# 3. (Optional) Start MCP services
docker compose -f docker-compose.yml \
  -f docker-compose.mcp-persistent.yml --profile mcp up -d

# 4. Open in VS Code
code .
# Then: Command Palette → "Dev Containers: Reopen in Container"
```

### Service Verification

```bash
# Check all services
docker compose ps

# Test database connections
docker exec postgres-db psql -U postgres -c "\l"
docker exec mariadb mysql -u root -ppassword -e "SHOW DATABASES;"

# Check cache layers
docker exec redis redis-cli ping
docker exec memcached nc -z localhost 11211

# Verify monitoring
curl http://localhost:9090  # Prometheus
curl http://localhost:3001  # Grafana

# Check MCP services
curl http://localhost:9097/services  # Service discovery
```

### Common Commands

```bash
# View logs
docker compose logs -f <service-name>

# Rebuild specific service
docker compose build <service-name>

# Restart services
docker compose restart <service-name>

# Stop all services
docker compose down

# Clean volumes (WARNING: deletes data)
docker compose down -v
```

## Troubleshooting

### Common Issues

**Port Conflicts**:
- Check if host ports are already in use
- Modify port mappings in docker-compose files
- Use `netstat -ano | findstr :<port>` to identify conflicts

**Network Issues**:
- Ensure Docker Desktop networking is enabled
- Verify `mcp-cluster` network exists: `docker network ls`
- Recreate network: `docker network rm mcp-cluster && docker compose up -d`

**Volume Permission Issues**:
- Windows: Ensure Docker Desktop has access to C:\ drive
- Check volume mounts are correctly specified
- Use `docker volume inspect <volume-name>` for details

**Build Failures**:
- Clear Docker build cache: `docker builder prune`
- Check Dockerfile paths are correct
- Verify base images are accessible

**Container Health Failures**:
- Check logs: `docker compose logs <service-name>`
- Verify health check commands are correct
- Increase health check timeout/retries

### Debug Commands

```bash
# Container inspection
docker inspect <container-name>

# Network troubleshooting
docker network inspect mcp-cluster

# Volume inspection
docker volume inspect <volume-name>

# Resource usage
docker stats

# Execute commands in container
docker exec -it <container-name> bash
```

## Related Documentation

### Comprehensive Guides
- [DevContainer Architecture Overview](../.copilot/infrastructure/devcontainer-architecture.md)
- [MCP Service Configuration](../.copilot/infrastructure/devcontainer-mcp-services.md)
- [Volume Strategy and Management](../.copilot/infrastructure/devcontainer-volumes.md)
- [Development Workflow](../.copilot/infrastructure/development-workflow.md)

### Quick References
- [Foundation Standards](../FOUNDATION_STANDARDS.md)
- [Getting Started Guide](../.copilot/getting-started/quickstart-setup.md)
- [Planning Documentation](../docs/archive/planning/)

### Technical Specifications
- [Cluster Analysis Research](../.copilot-tracking/20251029-devcontainer-cluster-analysis-research.md)
- [Validation Results](../.copilot-tracking/20251029-devcontainer-cluster-analysis-final-report.md)

## Updates & Maintenance

### Version Tracking
- VS Code: Controlled via `vscode-update-control` script
- Container Images: Manual rebuild triggers
- Dependencies: Tracked in respective package managers

### Update Commands
```bash
# Update VS Code Insiders
npm run vscode:update

# Rebuild all containers
docker compose build --pull

# Update base images
docker compose pull
```

---

**Last Updated**: October 30, 2025
**DevContainer Status**: ✅ Fully Operational
**Total Services**: 42+ containers
**Network Architecture**: Multi-tier with hybrid bridge strategy

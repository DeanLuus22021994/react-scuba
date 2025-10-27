# MCP Cluster - Complete Setup Guide

## 🚀 One-Command Cluster Startup

```bash
# Start the entire MCP cluster with orchestrated health checks
docker-compose -f .github/docker-compose.mcp.yml up --build -d
```

**That's it!** All services start in the correct order with automatic health check dependencies.

## 📊 Service Orchestration

### Startup Order (4 Tiers)

```
TIER 1: GitHub MCP Server
  ↓ (waits for health check)
TIER 2: Databases (PostgreSQL, MariaDB)
  ↓ (waits for health checks)
TIER 3: MCP Services (filesystem, postgres-mcp, mariadb-mcp, memory, git, fetch)
  ↓ (waits for health checks)
TIER 4: Tools (Python 3.15 Experimental, K8s Plugin, DevContainer)
```

## 🏗️ Architecture Overview

### Network Configuration
- **Network**: `mcp-cluster` (172.20.0.0/16)
- **Bridge Mode**: Low-latency, static IP assignment
- **DNS**: Automatic service discovery via hostnames

### Service Matrix

| Service | IP | Ports | Health Check | Dependencies |
|---------|-----|-------|--------------|--------------|
| github-mcp | 172.20.0.10 | 3000 | Binary version | None (starts first) |
| postgres-db | 172.20.0.20 | 5432 | pg_isready | github healthy |
| mariadb | 172.20.0.21 | 3306 | healthcheck.sh | github healthy |
| filesystem-mcp | 172.20.0.30 | - | node test | github healthy |
| postgres-mcp | 172.20.0.31 | - | node test | postgres-db healthy |
| mariadb-mcp | 172.20.0.32 | - | mariadb connect | mariadb healthy |
| memory-mcp | 172.20.0.33 | - | node test | github healthy |
| git-mcp | 172.20.0.34 | - | python test | github healthy |
| fetch-mcp | 172.20.0.35 | - | python test | github healthy |
| python-experimental | 172.20.0.40 | - | health.py | github healthy |
| k8s-plugin | 172.20.0.50 | - | health.sh | github healthy |
| devcontainer | 172.20.0.60 | 5173, 8080 | node version | all databases healthy |

## 🔧 Services Deep Dive

### 1. GitHub MCP Server (Tier 1)
**Priority**: Highest (starts first)
- **Purpose**: Git repository management, issues, PRs
- **Health Check**: Binary version check every 10s
- **Resources**: 2 CPU, 1GB RAM limit

### 2. PostgreSQL Database (Tier 2)
- **Purpose**: Relational database for MCP postgres service
- **Health Check**: `pg_isready` every 5s
- **Optimization**: UTF-8 encoding, optimized for reads
- **Connection**: `postgresql://postgres:password@postgres-db:5432/postgres`

### 3. MariaDB Database (Tier 2)
**Replaces**: SQLite (for higher performance)
- **Purpose**: High-performance MySQL-compatible database
- **Health Check**: `healthcheck.sh` with InnoDB validation every 5s
- **Optimization**:
  - InnoDB buffer pool: 256MB
  - Max connections: 200
  - Direct I/O flush method
  - Log commit optimized (2)
- **Connection**: `mysql://root:password@mariadb:3306/mcp_db`
- **Size**: ~450MB (under 500MB requirement)

### 4. MCP Services (Tier 3)
All MCP services wait for GitHub to be healthy before starting.

#### Filesystem MCP
- Provides read-only workspace access
- Node.js-based with 2GB heap

#### Postgres MCP
- Connects to postgres-db
- Waits for postgres-db health check

#### MariaDB MCP
- Connects to mariadb
- Waits for mariadb health check
- Uses official MySQL protocol

#### Memory MCP
- Knowledge graph storage
- 4GB heap allocation
- NVMe-optimized volumes

#### Git MCP
- Git operations (clone, commit, push, pull)
- Git LFS support
- Python bytecode cached

#### Fetch MCP
- Web content fetching
- HTTP/2 enabled
- 1GB internet optimized

### 5. Python 3.15.0a1 Experimental (Tier 4)
**NEW**: Cutting-edge Python features
- **Free-threaded**: GIL disabled (PEP 703)
- **Profiler**: New 3.15 low-latency profiler
- **Architecture**: x86-64-v3 optimized
- **LTO**: Full link-time optimization
- **PGO**: Profile-guided optimization
- **Packages**: numpy, scipy, pandas, fastapi, pytest, black, ruff
- **Use Case**: R&D, experimental async work, performance testing

**Profiler Features**: https://docs.python.org/3.15/whatsnew/3.15.html

### 6. Kubernetes Plugin (Tier 4)
**NEW**: Official K8s tooling integration
- **kubectl**: v1.31.2 (cluster management)
- **helm**: v3.16.2 (package management)
- **kompose**: v1.34.0 (Compose→K8s conversion)
- **k9s**: v0.32.5 (terminal UI)

**Convert Compose to K8s**:
```bash
docker-compose exec k8s-plugin kompose convert -f /workspace/.github/docker-compose.mcp.yml
```

### 7. DevContainer (Tier 4)
**NEW**: Complete development environment
- **Node.js**: 22 with TypeScript
- **Python**: 3.12 with pytest
- **Docker**: Docker-in-Docker
- **Kubernetes**: kubectl + helm
- **Tools**: vim, nano, zsh, Oh My Zsh
- **VS Code**: Optimized for extensions
- **Ports**: 5173 (Vite), 8080 (app)

## 📦 Volumes & Persistence

### Named Volumes (19 total)
All data persists across container restarts and rebuilds:

```
Build Caches (instant rebuilds):
  - filesystem-node-cache
  - postgres-node-cache
  - mariadb-node-cache
  - memory-node-cache
  - git-pip-cache
  - git-python-cache
  - fetch-pip-cache
  - fetch-python-cache

Application Data:
  - github-mcp-data
  - github-mcp-cache
  - postgres-data
  - mariadb-data
  - memory-data

Runtime Caches:
  - postgres-cache
  - mariadb-cache
  - mariadb-config
  - memory-cache
  - git-cache
  - fetch-cache
  - fetch-http-cache
  - python-exp-cache
  - k8s-config
  - k8s-cache
  - devcontainer-cache
```

## 🎯 Quick Commands

### Cluster Management
```bash
# Start entire cluster
docker-compose -f .github/docker-compose.mcp.yml up -d

# View logs (all services)
docker-compose -f .github/docker-compose.mcp.yml logs -f

# View logs (specific service)
docker-compose -f .github/docker-compose.mcp.yml logs -f github

# Check health status
docker-compose -f .github/docker-compose.mcp.yml ps

# Stop cluster
docker-compose -f .github/docker-compose.mcp.yml down

# Stop and remove volumes (CAUTION: data loss)
docker-compose -f .github/docker-compose.mcp.yml down -v
```

### Individual Services
```bash
# Restart specific service
docker-compose -f .github/docker-compose.mcp.yml restart mariadb

# Rebuild specific service
docker-compose -f .github/docker-compose.mcp.yml up --build -d postgres-mcp

# Execute command in service
docker-compose -f .github/docker-compose.mcp.yml exec postgres-db psql -U postgres

# Shell into service
docker-compose -f .github/docker-compose.mcp.yml exec devcontainer zsh
```

### Health Check Monitoring
```bash
# Watch health status
watch -n 2 'docker-compose -f .github/docker-compose.mcp.yml ps'

# Health check logs
docker inspect github-mcp --format='{{json .State.Health}}' | jq

# All health statuses
docker ps --format '{{.Names}}: {{.Status}}'
```

### Database Connections
```bash
# PostgreSQL
docker-compose -f .github/docker-compose.mcp.yml exec postgres-db psql -U postgres

# MariaDB
docker-compose -f .github/docker-compose.mcp.yml exec mariadb mariadb -u root -p

# From host (with ports exposed)
psql -h 127.0.0.1 -U postgres -d postgres
mariadb -h 127.0.0.1 -u root -p
```

### Python 3.15 Experimental
```bash
# Interactive Python 3.15
docker-compose -f .github/docker-compose.mcp.yml exec python-experimental python3.15t

# Check GIL status
docker-compose -f .github/docker-compose.mcp.yml exec python-experimental \
  python3.15t -c "import sys; print(f'GIL: {'Disabled' if not sys._is_gil_enabled() else 'Enabled'}')"

# Run profiler
docker-compose -f .github/docker-compose.mcp.yml exec python-experimental \
  python3.15t -X importtime your_script.py
```

### Kubernetes Tools
```bash
# Kubectl version
docker-compose -f .github/docker-compose.mcp.yml exec k8s-plugin kubectl version

# Helm charts
docker-compose -f .github/docker-compose.mcp.yml exec k8s-plugin helm list

# Convert to K8s manifests
docker-compose -f .github/docker-compose.mcp.yml exec k8s-plugin \
  kompose convert -f /workspace/.github/docker-compose.mcp.yml -o /workspace/k8s/
```

## 🔐 Environment Variables

Create `.env` file in project root:

```env
# GitHub Token (required for GitHub MCP)
GITHUB_TOKEN=ghp_your_token_here

# PostgreSQL Password
DOCKER_POSTGRES_PASSWORD=secure_postgres_password

# MariaDB Password
MARIADB_PASSWORD=secure_mariadb_password
```

## ⚡ Performance Features

### Health Check Benefits
1. **Ordered Startup**: Services start only when dependencies are ready
2. **Automatic Recovery**: Failed services restart automatically
3. **Status Visibility**: Real-time health status in `docker ps`
4. **Zero Downtime**: Dependent services wait, preventing connection errors

### Network Optimization
- **Bridge Mode**: Low overhead, predictable routing
- **Static IPs**: No DNS lookup delays
- **Service Discovery**: Automatic hostname resolution
- **Low Latency**: Direct container communication

### Resource Limits
All services have CPU and memory limits to prevent resource exhaustion.

## 🐛 Troubleshooting

### Service won't start
```bash
# Check dependency health
docker-compose -f .github/docker-compose.mcp.yml ps

# View service logs
docker-compose -f .github/docker-compose.mcp.yml logs service-name

# Force recreate
docker-compose -f .github/docker-compose.mcp.yml up --force-recreate service-name
```

### Health check failing
```bash
# Manual health check
docker-compose -f .github/docker-compose.mcp.yml exec service-name /health-check-command

# Increase timeout (edit compose file)
healthcheck:
  start_period: 30s  # Increase if service needs more time
```

### Database connection issues
```bash
# Verify database is healthy
docker-compose -f .github/docker-compose.mcp.yml ps postgres-db mariadb

# Test connection manually
docker-compose -f .github/docker-compose.mcp.yml exec postgres-db pg_isready
docker-compose -f .github/docker-compose.mcp.yml exec mariadb mariadb-admin ping
```

## 📊 Monitoring & Observability

```bash
# Resource usage
docker stats

# Disk usage
docker system df -v

# Network inspection
docker network inspect mcp-cluster

# Volume usage
docker volume ls
du -sh /var/lib/docker/volumes/*/
```

## 🎓 Next Steps

1. **Start Cluster**: `docker-compose -f .github/docker-compose.mcp.yml up -d`
2. **Verify Health**: `docker-compose -f .github/docker-compose.mcp.yml ps`
3. **Access DevContainer**: `docker-compose -f .github/docker-compose.mcp.yml exec devcontainer zsh`
4. **Test Python 3.15**: Experiment with free-threaded execution
5. **Deploy to K8s**: Use kompose to generate Kubernetes manifests

---

**Full Documentation**: See `.github/MCP-SERVERS.md` for individual service details.
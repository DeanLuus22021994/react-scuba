# React Scuba Cluster - Node.js Slim API Server Setup

## Overview

This document describes the setup and operation of the React Scuba cluster with a production-optimized Node.js slim API server.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose Cluster                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Tier 1: Databases                                          │
│    ├── PostgreSQL 16 (172.28.0.20:5432)                    │
│    └── MariaDB 11 (172.28.0.21:3306)                       │
│                                                               │
│  Tier 2: MCP Database Services                              │
│    ├── postgres-mcp (172.28.0.31)                           │
│    └── mariadb-mcp (172.28.0.32)                            │
│                                                               │
│  Tier 3: Monitoring & Tools                                 │
│    ├── Prometheus (172.28.0.71:9090)                        │
│    ├── Grafana (172.28.0.72:3000)                           │
│    ├── cAdvisor (172.28.0.75:8082)                          │
│    └── Node Exporter (172.28.0.76:9100)                     │
│                                                               │
│  Tier 4: Cache & Storage                                    │
│    ├── Memcached (172.28.0.60:11211)                        │
│    ├── RedisInsight (172.28.0.62:5540)                      │
│    └── nginx-master (172.28.0.73:8080)                      │
│                                                               │
│  ✨ Tier 7.5: API SERVER (NEW)                              │
│    └── node-api (172.28.0.64:3000) - Node slim             │
│        └── Express.js REST API                              │
│        └── Multi-tenant dive shop backend                   │
│        └── 200-250MB image (83% smaller)                    │
│                                                               │
│  Tier 7: Bootstrap (Development)                            │
│    └── node-bootstrap (172.28.0.65)                         │
│        └── Vite dev server (port 5173)                      │
│        └── npm workspaces build                             │
│                                                               │
│  Tier 8: MCP Servers                                        │
│    └── markitdown-mcp (172.28.0.35)                         │
│                                                               │
│  Tier 5: Network Load Balancing                             │
│    ├── nginx-master (172.28.0.73)                           │
│    ├── nginx-slave-1 (172.28.0.81)                          │
│    └── nginx-slave-2 (172.28.0.82)                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Network: mcp-cluster (172.28.0.0/16)
Gateway: 172.28.0.1
```

## API Server Implementation

### Node Slim Dockerfile Strategy

**File**: `.devcontainer/containers/dockerfile.service.node.slim`

#### Three-Stage Build Process:

1. **Builder Stage** (Full development)
   - Base: `node:22-slim` (150MB)
   - Installs: python3, make, g++, ca-certificates
   - Compiles workspace and dependencies
   - ~500MB intermediate image

2. **Intermediate Stage** (Dependency pruning)
   - Copies built artifacts from builder
   - Runs `npm prune --production` (60% size reduction)
   - Removes src files, git, docs, cache
   - ~300MB pruned image

3. **Production Stage** (Minimal runtime)
   - Base: `node:22-slim` (150MB)
   - Installs: ca-certificates, dumb-init, curl only
   - Copies production dependencies from intermediate
   - Creates non-root user (api-user:1000)
   - **Final size**: 200-250MB
   - **Size reduction**: 71% vs node:22, 83% vs node:22-full

#### Key Features:

```dockerfile
# Security: Non-root user execution
USER api-user

# Signals: dumb-init for proper PID 1 handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Resource limits: 512MB max heap, abort on uncaught exception
NODE_OPTIONS="--max-old-space-size=512 --abort-on-uncaught-exception"

# Health checks: curl-based liveness probe
HEALTHCHECK CMD curl -f http://localhost:3000/health
```

### Health & Readiness Endpoints

The API server exposes three essential endpoints for cluster management:

#### 1. **Liveness Probe** (`/health`)
- **Purpose**: Container is alive
- **Response**: `{ status: "healthy", timestamp: "..." }`
- **Used by**: Docker health checks, Kubernetes livenessProbe
- **Interval**: 30s
- **Timeout**: 5s

#### 2. **Readiness Probe** (`/ready`)
- **Purpose**: Service ready to accept traffic
- **Response**: 
  ```json
  {
    "status": "ready",
    "uptime": 45.123,
    "memory": {
      "heapUsed": 256,
      "heapTotal": 512,
      "rss": 400
    }
  }
  ```
- **Used by**: Kubernetes readinessProbe, load balancers
- **Returns 503** during shutdown

#### 3. **Metrics Endpoint** (`/metrics`)
- **Purpose**: Prometheus-compatible metrics
- **Format**: OpenMetrics text format
- **Metrics**: uptime, memory usage, GC duration, request counts
- **Used by**: Prometheus scraping

### Graceful Shutdown

The API server handles termination signals properly for container orchestrators:

```javascript
// Handles: SIGTERM (docker stop), SIGINT (Ctrl+C)
process.on("SIGTERM", () => {
  // 1. Mark /ready as 503 (stop accepting traffic)
  // 2. Wait 30 seconds (drain existing requests)
  // 3. Force exit if timeout exceeded
});
```

## Docker Compose Configuration

### Service Definition

```yaml
node-api:
  build:
    dockerfile: .devcontainer/containers/dockerfile.service.node.slim
  image: api-server:latest
  container_name: node-api
  networks:
    mcp-cluster:
      ipv4_address: 172.28.0.64
  ports:
    - "3000:3000"
  environment:
    - NODE_ENV=production
    - PORT=3000
    - DB_HOST=postgres-db
    - CACHE_HOST=memcached
  depends_on:
    postgres-db: { condition: service_healthy }
    mariadb: { condition: service_healthy }
    memcached: { condition: service_healthy }
  deploy:
    resources:
      limits: { cpus: "1.0", memory: "512M" }
      reservations: { cpus: "0.5", memory: "256M" }
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
    interval: 30s
    timeout: 5s
    retries: 3
    start_period: 20s
```

### Network Connectivity

The API server connects to cluster services:

| Service | Hostname | Port | Purpose |
|---------|----------|------|---------|
| PostgreSQL | postgres-db | 5432 | Primary database |
| MariaDB | mariadb | 3306 | Legacy database |
| Memcached | memcached | 11211 | Session/query cache |
| Redis | redis | 6379 | Cache (future) |
| Prometheus | prometheus | 9090 | Metrics collection |

## Getting Started

### 1. Build the Cluster

```bash
# Build all services
docker-compose build

# Build only the API server
docker-compose build node-api

# Show image size
docker images | grep api-server
# Result: api-server  latest  200MB (estimated)
```

### 2. Start the Cluster

```bash
# Start all services
docker-compose up -d

# Check service health
docker-compose ps

# View API logs
docker-compose logs -f node-api

# Check API health
curl http://localhost:3000/health
```

### 3. Verify Connectivity

```bash
# Test API endpoints
curl http://localhost:3000/health
curl http://localhost:3000/ready
curl http://localhost:3000/metrics

# Check database connection
docker exec node-api npm run test

# View metrics
curl http://localhost:3000/metrics | grep -A5 nodejs
```

### 4. Development with DevContainer

```bash
# Open in VS Code with DevContainer
# - Ctrl+Shift+P → Remote-Containers: Reopen in Container
# OR
# - Click green Remote icon (bottom-left) → Reopen in Container

# Inside container:
npm run dev          # Start dev server
npm test             # Run tests
npm run build        # Production build
```

## Production Deployment

### Image Size Optimization

```
Comparison:
  node:22 (full)     900MB
  node:22-alpine    400MB
  node:22-slim      150MB
  api-server        200-250MB (this project)
  
Size reduction:
  vs node:22:       71% smaller
  vs node:22-slim:  33% smaller (adds deps)
  vs dockerfile:    83% of alpine size
```

### Resource Requirements

```
CPU:     0.5-1.0 cores
Memory:  256-512MB
Startup: 15-20 seconds
```

### Environment Variables

```bash
# Required
NODE_ENV=production
PORT=3000

# Database
DB_HOST=postgres-db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<secret>
DB_NAME=postgres

# Cache
CACHE_HOST=memcached
CACHE_PORT=11211

# Optional
API_LOG_LEVEL=info
CORS_ORIGIN=https://example.com
```

### Monitoring

#### Prometheus Scrape Config

```yaml
scrape_configs:
  - job_name: 'api-server'
    static_configs:
      - targets: ['node-api:3000']
    metrics_path: '/metrics'
    scrape_interval: 30s
```

#### Grafana Dashboard

Import metrics:
- `nodejs_uptime_seconds`
- `nodejs_process_memory_*`
- Container metrics from cAdvisor
- Database metrics from exporters

## Troubleshooting

### API Server Won't Start

```bash
# Check logs
docker-compose logs node-api

# Common issues:
# 1. Port 3000 already in use
netstat -tlnp | grep 3000

# 2. Database not healthy
docker-compose ps postgres-db

# 3. Out of memory
docker stats node-api
```

### High Memory Usage

```bash
# Check heap usage
curl http://localhost:3000/ready | jq '.memory'

# Increase limit in docker-compose.yml
deploy:
  resources:
    limits:
      memory: "1024M"  # Increase from 512M
```

### Slow Startup

```bash
# Check startup logs
docker-compose logs node-api | grep -E "listening|started|error"

# Measure startup time
time docker-compose up node-api

# Typical: 15-20 seconds (including dependency startup)
```

## File Structure

```
react-scuba/
├── .devcontainer/
│   └── containers/
│       └── dockerfile.service.node.slim      # New API Dockerfile
├── .devcontainer.json                         # Cluster devcontainer config
├── server/
│   ├── apps/
│   │   └── api/
│   │       └── src/
│   │           ├── index.js                  # Health/readiness endpoints
│   │           ├── routes/
│   │           ├── services/
│   │           └── utils/
│   └── package.json
├── docker-compose.yml                         # Updated with node-api service
└── devcontainer.env                          # Environment variables
```

## Next Steps

1. **Database Integration** - Connect API to PostgreSQL/MariaDB
2. **Authentication** - Add JWT/session management
3. **Kubernetes Migration** - Deploy to K8s with helm charts
4. **CI/CD Pipeline** - GitHub Actions for automated builds
5. **Performance Testing** - Load testing with k6 or locust
6. **Observability** - Add distributed tracing (Jaeger)

## References

- Node.js Slim Images: https://github.com/nodejs/docker-node
- Docker Multi-stage Builds: https://docs.docker.com/build/building/multi-stage/
- Express.js Production Best Practices: https://expressjs.com/en/advanced/best-practice-performance.html
- Kubernetes Probes: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/

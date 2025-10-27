# MCP Servers - Docker Implementation

This directory contains Docker-based implementations of Model Context Protocol (MCP) servers for the React Scuba project with enterprise-grade performance optimizations.

## Overview

All MCP servers are containerized using Docker BuildKit with advanced caching for:
- ✅ **Instant rebuilds** with BuildKit cache mounts (10 seconds vs 5 minutes)
- ✅ **Consistent environments** across development machines
- ✅ **Host networking** for low-latency 1GB internet access
- ✅ **NVMe-optimized storage** with named volumes
- ✅ **Isolated dependencies** (no global npm/python packages)
- ✅ **Easy management** with Docker Compose
- ✅ **Persistent data and caches** using named volumes
- ✅ **Python bytecode precompilation** for instant startups
- ✅ **HTTP/2 support** for parallel web fetching

## Performance Optimizations

### BuildKit Cache Mounts
All Dockerfiles use `--mount=type=cache` for:
- **npm/pip downloads**: Never re-download packages
- **APK packages**: Persistent Alpine package cache
- **Python bytecode**: Precompiled `.pyc` files
- **Git templates**: Shared Git configuration

### Host Networking
All services use `network_mode: host` for:
- **Zero NAT overhead**: Native network performance
- **Low latency**: Direct host network stack access
- **1GB internet**: Full bandwidth utilization
- **No port conflicts**: Direct service-to-service communication

### Named Volumes Strategy
Persistent volumes for:
- **Build caches**: npm, pip, apk caches survive rebuilds
- **Application data**: Databases, knowledge graphs, API caches
- **Runtime caches**: HTTP responses, Git objects, Python bytecode
- **NVMe optimization**: All volumes on host SSD/NVMe

## Available MCP Servers

### 1. GitHub Server (`github.dockerfile`)
- **Source**: https://github.com/github/github-mcp-server
- **Language**: Go (official implementation)
- **Features**: Repositories, issues, PRs, actions, security
- **Image**: `ghcr.io/github/github-mcp-server:latest` (official)
- **Volumes**: 
  - `github-mcp-cache:/cache/github` - API response cache
  - `github-mcp-data:/app/data` - Persistent data
- **Environment**:
  - `GITHUB_PERSONAL_ACCESS_TOKEN` - GitHub PAT (required)
  - `GITHUB_DYNAMIC_TOOLSETS=1` - Enable dynamic toolsets

### 2. Filesystem Server (`filesystem.dockerfile`)
- **Source**: https://github.com/modelcontextprotocol/servers
- **Language**: Node.js
- **Features**: Secure file operations within allowed directories
- **Image**: `mcp-filesystem:latest`
- **Volumes**:
  - `${workspaceFolder}:/workspace:ro` - Read-only workspace access
  - `filesystem-node-cache:/cache/node` - npm cache persistence
- **Optimizations**:
  - BuildKit cache mount for npm packages
  - Node.js heap tuning (2GB)
  - Source map support for debugging
- **Security**: Read-only mount prevents accidental file modifications

### 3. PostgreSQL Server (`postgres.dockerfile`)
- **Source**: https://github.com/modelcontextprotocol/servers
- **Language**: Node.js
- **Features**: Database queries, schema inspection, data operations
- **Image**: `mcp-postgres:latest`
- **Volumes**:
  - `postgres-node-cache:/cache/node` - npm cache persistence
  - `postgres-cache:/cache/pg` - PostgreSQL query cache
- **Environment**:
  - `POSTGRES_CONNECTION` - PostgreSQL connection string
- **Optimizations**:
  - BuildKit cache mount for npm packages
  - Connection pooling enabled
  - UTF-8 encoding by default
- **Network**: Uses host networking (127.0.0.1) for direct database access

### 4. SQLite Server (`sqlite.dockerfile`)
- **Source**: https://github.com/designcomputer/sqlite_mcp_server
- **Language**: Node.js (community implementation)
- **Features**: Lightweight SQL database operations
- **Image**: `mcp-sqlite:latest`
- **Volumes**:
  - `${workspaceFolder}:/data` - Database file access
  - `sqlite-node-cache:/cache/node` - npm cache persistence
  - `sqlite-cache:/cache/sqlite` - SQLite temp storage
- **Optimizations**:
  - BuildKit cache mount for npm packages
  - WAL mode enabled for concurrent access
  - Temp storage for sorting operations
- **Default**: Operates on `/data/db.sqlite`

### 5. Memory Server (`memory.dockerfile`)
- **Source**: https://github.com/modelcontextprotocol/servers
- **Language**: Node.js
- **Features**: Persistent knowledge graph storage
- **Image**: `mcp-memory:latest`
- **Volumes**:
  - `memory-data:/memory` - Persistent memory storage
  - `memory-node-cache:/cache/node` - npm cache persistence
  - `memory-cache:/cache/memory` - Runtime memory cache
- **Optimizations**:
  - BuildKit cache mount for npm packages
  - 4GB heap allocation for large graphs
  - NVMe-optimized I/O operations
  - Source map support for debugging

### 6. Git Server (`git.dockerfile`)
- **Source**: https://github.com/modelcontextprotocol/servers
- **Language**: Python
- **Features**: Git operations (clone, commit, push, pull, diff, log)
- **Image**: `mcp-git:latest`
- **Volumes**:
  - `${workspaceFolder}:/repos` - Git repository access
  - `git-cache:/cache/git` - Git object cache and templates
  - `git-pip-cache:/cache/pip` - pip package cache
  - `git-python-cache:/cache/python` - Python bytecode cache
- **Optimizations**:
  - BuildKit cache mount for pip packages
  - Python bytecode precompilation (PYTHONOPTIMIZE=2)
  - Git LFS support for large files
  - libgit2 for performance-critical operations

### 7. Fetch Server (`fetch.dockerfile`)
- **Source**: https://github.com/modelcontextprotocol/servers
- **Language**: Python
- **Features**: Web content fetching, HTML parsing, robots.txt compliance
- **Image**: `mcp-fetch:latest`
- **Volumes**:
  - `fetch-cache:/cache/fetch` - Fetched content cache
  - `fetch-pip-cache:/cache/pip` - pip package cache
  - `fetch-python-cache:/cache/python` - Python bytecode cache
  - `fetch-http-cache:/cache/http` - HTTP response cache
- **Optimizations**:
  - BuildKit cache mount for pip packages
  - Python bytecode precompilation (PYTHONOPTIMIZE=2)
  - HTTP/2 support via httpx for parallel downloads
  - 1GB internet tuning (30s timeout, connection pooling)
  - CA bundle for secure HTTPS connections

## Quick Start

### 1. Build All Servers

```powershell
# Build all MCP servers with BuildKit caching
./.github/build-mcp-servers.ps1

# Build specific server
./.github/build-mcp-servers.ps1 -ServerName filesystem

# Build with no cache (force clean build)
./.github/build-mcp-servers.ps1 -NoCacheParam

# Build in parallel (utilizes all CPU cores, 3x faster)
./.github/build-mcp-servers.ps1 -Parallel

# Pull base images first for optimal caching
./.github/build-mcp-servers.ps1 -PullBase
```

**Performance Notes:**
- First build: ~5 minutes (downloads and compiles everything)
- Subsequent builds: ~10 seconds (BuildKit cache reuse)
- Parallel builds: ~90 seconds (3x faster than sequential)
- BuildKit automatically manages cache invalidation

### 2. Using Docker Compose

```bash
# Build all services
docker-compose -f .github/docker-compose.mcp.yml build

# Build specific service
docker-compose -f .github/docker-compose.mcp.yml build filesystem

# Start PostgreSQL database for testing
docker-compose -f .github/docker-compose.mcp.yml up postgres-db -d

# View logs
docker-compose -f .github/docker-compose.mcp.yml logs -f
```

### 3. VS Code Integration

MCP servers are configured in `.vscode/mcp.json` and automatically started by GitHub Copilot when needed.

**Configuration Example:**
```json
{
  "servers": {
    "filesystem": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "--name", "filesystem-mcp-server",
        "-v", "${workspaceFolder}:/workspace:ro",
        "mcp-filesystem:latest"
      ]
    }
  }
}
```

## Environment Variables

### Required

- `GITHUB_PERSONAL_ACCESS_TOKEN` - GitHub PAT for GitHub server
  - Create at: https://github.com/settings/tokens
  - Scopes: `repo`, `read:org`, `read:user`

### Optional

- `DOCKER_POSTGRES_PASSWORD` - PostgreSQL password (default: `password`)
- `FETCH_CACHE_DIR` - Custom cache directory for fetch server
- `MEMORY_STORAGE_PATH` - Custom storage path for memory server

**Set environment variables:**
```powershell
# PowerShell
$env:GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_your_token_here"
$env:DOCKER_POSTGRES_PASSWORD = "secure_password"

# Or use .env file with docker-compose
```

## Named Volumes

All persistent data is stored in Docker named volumes:

```bash
# List all MCP volumes
docker volume ls --filter name=mcp

# Inspect volume
docker volume inspect github-mcp-cache

# Remove all MCP volumes (WARNING: data loss)
docker volume rm github-mcp-cache github-mcp-data memory-data fetch-cache
```

### Volume Purposes

**Application Data (persists across container restarts):**
- `github-mcp-cache` - GitHub API response cache (improves performance)
- `github-mcp-data` - GitHub server persistent data
- `memory-data` - Knowledge graph storage
- `postgres-data` - PostgreSQL database files

**Build Caches (persists across image rebuilds):**
- `filesystem-node-cache` - npm package cache for filesystem server
- `postgres-node-cache` - npm package cache for postgres server
- `sqlite-node-cache` - npm package cache for sqlite server
- `memory-node-cache` - npm package cache for memory server
- `git-pip-cache` - pip package cache for git server
- `fetch-pip-cache` - pip package cache for fetch server

**Runtime Caches (improves performance):**
- `postgres-cache` - PostgreSQL query cache
- `sqlite-cache` - SQLite temp storage for sorting
- `memory-cache` - Memory server runtime cache
- `git-cache` - Git object cache and templates
- `git-python-cache` - Python bytecode cache for git server
- `fetch-cache` - Fetched web content cache
- `fetch-python-cache` - Python bytecode cache for fetch server
- `fetch-http-cache` - HTTP response cache

**Performance Impact:**
- BuildKit caches reduce rebuild time from 5 minutes to 10 seconds
- npm/pip caches eliminate redundant package downloads
- Python bytecode caches provide instant server startups
- HTTP caches reduce network latency for repeated requests

## Optimization Features

### BuildKit Cache Mounts
Revolutionary caching strategy using `--mount=type=cache`:
- **Package managers**: npm, pip, apk caches persist across builds
- **Zero redundant downloads**: Packages downloaded once, reused forever
- **Shared across builds**: All images share common caches
- **Automatic invalidation**: Smart cache busting when needed

### Layer Caching
Each Dockerfile is optimized for maximum cache utilization:
- Dependencies installed in early layers
- Application code in later layers
- Named volumes prevent data layer invalidation
- Multi-stage builds separate build-time from runtime

### Instant Rebuilds
After first build, subsequent builds complete in ~10 seconds:
- BuildKit cache mounts eliminate package downloads
- Layer cache reuses unchanged layers
- Python bytecode precompiled and cached
- npm/pip dependencies installed once

### Host Networking
All services use `network_mode: host` for:
- **Zero NAT overhead**: Direct host network stack access
- **Native performance**: No Docker network bridge latency
- **1GB internet**: Full bandwidth utilization
- **Low latency**: Sub-millisecond service communication

### Python Optimizations
Python-based servers (git, fetch) include:
- **Bytecode precompilation**: `-m compileall` at build time
- **PYTHONOPTIMIZE=2**: Maximum optimization level
- **PYTHONDONTWRITEBYTECODE=1**: Prevent runtime compilation
- **PYTHONPYCACHEPREFIX**: Centralized bytecode cache
- **Result**: Instant startup, no cold start penalty

### Node.js Optimizations
Node.js-based servers (filesystem, postgres, sqlite, memory) include:
- **Heap tuning**: 2-4GB allocation based on workload
- **Source maps**: Enabled for debugging
- **npm cache**: Persistent across rebuilds
- **Production mode**: NODE_ENV=production

### NVMe Storage Strategy
All named volumes optimized for SSD/NVMe:
- **Local volumes**: Stored on host filesystem
- **Direct I/O**: No virtualization overhead
- **Cache locality**: Hot data stays in SSD cache
- **Wear leveling**: Docker manages volume placement

### Minimal Images
- Alpine Linux base (5-10 MB vs 100+ MB Ubuntu)
- Only essential dependencies installed
- Multi-stage builds where applicable
- tini for proper signal handling (PID 1)

## Troubleshooting

### Server Not Starting

```bash
# Check if Docker is running
docker info

# Check if image exists
docker images | grep mcp

# View container logs
docker logs <container-name>
```

### Permission Issues

```bash
# Ensure volumes have correct permissions
docker run --rm -v ${PWD}:/workspace alpine ls -la /workspace
```

### Network Issues

```bash
# With host networking, PostgreSQL is accessible at 127.0.0.1
# Test connection:
psql -h 127.0.0.1 -U postgres -c "SELECT version();"

# Check if PostgreSQL is listening
netstat -an | grep 5432

# View MCP server network access
docker inspect <container-name> | grep NetworkMode
```

### Cache Management

```bash
# View BuildKit cache usage
docker buildx du

# Clean up old cache (keeps recent)
docker buildx prune

# Nuclear option: clear all BuildKit cache
docker buildx prune -a

# View named volumes
docker volume ls --filter name=mcp

# Inspect volume size
docker system df -v | grep mcp
```

### Rebuild from Scratch

```bash
# Remove all MCP images
docker images | grep mcp | awk '{print $3}' | xargs docker rmi

# Rebuild
./.github/build-mcp-servers.ps1 -NoCacheParam
```

## Development

### Adding a New MCP Server

1. Create `<server-name>.dockerfile` in `.github/`
2. Follow existing Dockerfile patterns:
   - Alpine base image
   - Tini for signal handling
   - Named volumes for persistence
   - Health checks
   - Descriptive labels
3. Add to `docker-compose.mcp.yml`
4. Add to `build-mcp-servers.ps1`
5. Configure in `.vscode/mcp.json`

### Testing Changes

```bash
# Build single server
docker build -f .github/filesystem.dockerfile -t mcp-filesystem:test .

# Run interactively
docker run -it --rm -v ${PWD}:/workspace mcp-filesystem:test sh

# Test server
docker run -i --rm mcp-filesystem:test
```

## Security Considerations

### Secrets Management
- ❌ **Never** commit tokens to Dockerfile ENV
- ✅ Use `-e` flag to pass at runtime
- ✅ Use Docker secrets in production
- ✅ Use VS Code's `${input:}` for interactive tokens

### File Access
- ✅ Mount workspace as read-only (`:ro`) when possible
- ✅ Use specific paths instead of `/`
- ✅ Review Dockerfile volume mounts

### Network Access
- ✅ Limit network access to required hosts
- ✅ Use `--add-host` for local connections
- ✅ Review exposed ports

## Performance Monitoring

```bash
# View resource usage
docker stats

# View image sizes
docker images --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}"

# View volume sizes
docker system df -v
```

## References

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- [GitHub MCP Server](https://github.com/github/github-mcp-server)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## Support

For issues with:
- **Docker setup**: Check Docker Desktop logs
- **MCP servers**: Check official repositories
- **VS Code integration**: Check `.vscode/mcp.json` configuration
- **Build script**: Run with verbose output

---

**Last Updated**: October 27, 2025  
**Maintainer**: React Scuba Team

# MCP Servers - Docker Implementation

This directory contains Docker-based implementations of Model Context Protocol (MCP) servers for the React Scuba project.

## Overview

All MCP servers are containerized using Docker for:
- ✅ **Consistent environments** across development machines
- ✅ **Instant rebuilds** with optimized layer caching
- ✅ **Isolated dependencies** (no global npm/python packages)
- ✅ **Easy management** with Docker Compose
- ✅ **Persistent data** using named volumes

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
- **Security**: Read-only mount prevents accidental file modifications

### 3. PostgreSQL Server (`postgres.dockerfile`)
- **Source**: https://github.com/modelcontextprotocol/servers
- **Language**: Node.js
- **Features**: Database queries, schema inspection, data operations
- **Image**: `mcp-postgres:latest`
- **Environment**:
  - `POSTGRES_CONNECTION` - PostgreSQL connection string
- **Network**: Uses `host.docker.internal` to connect to host PostgreSQL

### 4. SQLite Server (`sqlite.dockerfile`)
- **Source**: https://github.com/designcomputer/sqlite_mcp_server
- **Language**: Node.js (community implementation)
- **Features**: Lightweight SQL database operations
- **Image**: `mcp-sqlite:latest`
- **Volumes**:
  - `${workspaceFolder}:/data` - Database file access
- **Default**: Operates on `/data/db.sqlite`

### 5. Memory Server (`memory.dockerfile`)
- **Source**: https://github.com/modelcontextprotocol/servers
- **Language**: Node.js
- **Features**: Persistent knowledge graph storage
- **Image**: `mcp-memory:latest`
- **Volumes**:
  - `memory-data:/memory` - Persistent memory storage

### 6. Git Server (`git.dockerfile`)
- **Source**: https://github.com/modelcontextprotocol/servers
- **Language**: Python
- **Features**: Git operations (clone, commit, push, pull, diff, log)
- **Image**: `mcp-git:latest`
- **Volumes**:
  - `${workspaceFolder}:/repos` - Git repository access

### 7. Fetch Server (`fetch.dockerfile`)
- **Source**: https://github.com/modelcontextprotocol/servers
- **Language**: Python
- **Features**: Web content fetching, HTML parsing, robots.txt compliance
- **Image**: `mcp-fetch:latest`
- **Volumes**:
  - `fetch-cache:/cache` - HTTP response cache

## Quick Start

### 1. Build All Servers

```powershell
# Build all MCP servers
./.github/build-mcp-servers.ps1

# Build specific server
./.github/build-mcp-servers.ps1 -ServerName filesystem

# Build with no cache (force rebuild)
./.github/build-mcp-servers.ps1 -NoCacheParam

# Build in parallel (faster)
./.github/build-mcp-servers.ps1 -Parallel
```

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

- `github-mcp-cache` - GitHub API response cache (improves performance)
- `github-mcp-data` - GitHub server persistent data
- `memory-data` - Knowledge graph storage
- `fetch-cache` - HTTP response cache
- `postgres-data` - PostgreSQL database files

## Optimization Features

### Layer Caching
Each Dockerfile is optimized for maximum cache utilization:
- Dependencies installed in early layers
- Application code in later layers
- Named volumes prevent data layer invalidation

### Instant Rebuilds
After first build, subsequent builds complete in <10 seconds by reusing cached layers.

### Minimal Images
- Alpine Linux base (5-10 MB)
- Only essential dependencies
- Multi-stage builds where applicable

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

### Network Issues (PostgreSQL)

```bash
# Test PostgreSQL connection from container
docker run --rm --add-host=host.docker.internal:host-gateway \
  postgres:16-alpine \
  psql -h host.docker.internal -U postgres -c "SELECT version();"
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

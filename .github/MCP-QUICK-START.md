# MCP Servers - Quick Start Guide

## 🚀 One-Command Setup

```powershell
# Build all MCP servers with advanced caching (from project root)
./.github/build-mcp-servers.ps1
```

**⚡ Performance Features:**
- BuildKit cache mounts for instant rebuilds
- Host networking for low-latency 1GB internet
- NVMe-optimized named volumes
- Persistent build caches across rebuilds

That's it! First build takes ~5 minutes, subsequent builds **~10 seconds**!

## 📋 What Gets Built

| Server | Purpose | Image Name | Cache Optimizations |
|--------|---------|------------|---------------------|
| GitHub | Repo/issue/PR management | `ghcr.io/github/github-mcp-server` | API cache, data persistence |
| Filesystem | File operations | `mcp-filesystem:latest` | Node cache, workspace access |
| PostgreSQL | Database queries | `mcp-postgres:latest` | Connection pool, query cache |
| SQLite | Lightweight DB | `mcp-sqlite:latest` | WAL mode, temp storage |
| Memory | Knowledge graph | `mcp-memory:latest` | 4GB heap, NVMe storage |
| Git | Git operations | `mcp-git:latest` | Git LFS, Python bytecode |
| Fetch | Web content | `mcp-fetch:latest` | HTTP/2, pip cache, 1GB tuned |

## ✅ Prerequisites

1. **Docker Desktop** running
2. **PowerShell** 5.1+ (Windows) or PowerShell Core 7+ (cross-platform)
3. **GitHub Token** (only for GitHub server)

## 🔑 Setup GitHub Token

1. Go to: https://github.com/settings/tokens/new
2. Create token with scopes: `repo`, `read:org`, `read:user`
3. VS Code will prompt for token when using GitHub server

## 🎯 Quick Commands

```powershell
# Build specific server
./.github/build-mcp-servers.ps1 -ServerName filesystem

# Force rebuild (no cache)
./.github/build-mcp-servers.ps1 -NoCacheParam

# Parallel build (faster, uses all cores)
./.github/build-mcp-servers.ps1 -Parallel

# Pull base images first (for optimal caching)
./.github/build-mcp-servers.ps1 -PullBase

# View built images
docker images | grep mcp

# View BuildKit cache usage
docker buildx du

# Clear BuildKit cache if needed
docker buildx prune

# Test a server
docker run -i --rm mcp-filesystem:latest
```

## 🐳 Using Docker Compose

```bash
# Build with compose
docker-compose -f .github/docker-compose.mcp.yml build

# Start PostgreSQL for testing
docker-compose -f .github/docker-compose.mcp.yml up postgres-db -d

# Stop all services
docker-compose -f .github/docker-compose.mcp.yml down
```

## 💡 VS Code Integration

MCP servers automatically start when GitHub Copilot needs them. Configuration in `.vscode/mcp.json`.

**Test in Copilot Chat:**
```
@workspace What files are in the src/ directory?
```
Uses filesystem server automatically!

## 🔧 Troubleshooting

### Build fails?
```powershell
# Check Docker
docker info

# Rebuild from scratch
./.github/build-mcp-servers.ps1 -NoCacheParam
```

### Server not connecting?
```powershell
# Check if image exists
docker images | grep mcp-filesystem

# Test server directly
docker run -i --rm -v ${PWD}:/workspace:ro mcp-filesystem:latest
```

### PostgreSQL connection issues?
```powershell
# Set password
$env:DOCKER_POSTGRES_PASSWORD = "your_password"

# Start database
docker-compose -f .github/docker-compose.mcp.yml up postgres-db -d

# Test connection
docker-compose -f .github/docker-compose.mcp.yml exec postgres-db psql -U postgres
```

## 📚 Learn More

- Full documentation: [MCP-SERVERS.md](./MCP-SERVERS.md)
- Official MCP docs: https://modelcontextprotocol.io/
- GitHub MCP server: https://github.com/github/github-mcp-server

## ⚡ Pro Tips

1. **First build takes ~5 minutes**, subsequent builds **~10 seconds** with BuildKit cache!
2. **Use `-Parallel`** flag to utilize all CPU cores (3x faster)
3. **Named volumes persist data** and build caches across container restarts
4. **Host networking** provides native network performance for 1GB internet
5. **Read-only mounts** (`:ro`) prevent accidental file modifications
6. **BuildKit cache mounts** eliminate redundant downloads (npm, pip, apk)
7. **Check logs** with `docker logs <container-name>`
8. **Monitor cache usage** with `docker buildx du`
9. **Python bytecode caching** for instant Python server startups
10. **HTTP/2 enabled** on fetch server for parallel downloads

---

**Need help?** See [MCP-SERVERS.md](./MCP-SERVERS.md) for detailed documentation.

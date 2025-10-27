# MCP Servers - Quick Start Guide

## 🚀 One-Command Setup

```powershell
# Build all MCP servers (from project root)
./.github/build-mcp-servers.ps1
```

That's it! All 7 MCP servers will be built and ready to use.

## 📋 What Gets Built

| Server | Purpose | Image Name |
|--------|---------|------------|
| GitHub | Repo/issue/PR management | `ghcr.io/github/github-mcp-server` |
| Filesystem | File operations | `mcp-filesystem:latest` |
| PostgreSQL | Database queries | `mcp-postgres:latest` |
| SQLite | Lightweight DB | `mcp-sqlite:latest` |
| Memory | Knowledge graph | `mcp-memory:latest` |
| Git | Git operations | `mcp-git:latest` |
| Fetch | Web content | `mcp-fetch:latest` |

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

# Parallel build (faster)
./.github/build-mcp-servers.ps1 -Parallel

# View built images
docker images | grep mcp

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

1. **First build takes ~5 minutes**, subsequent builds ~10 seconds (caching!)
2. **Use `-Parallel`** flag for fastest builds
3. **Named volumes persist data** across container restarts
4. **Read-only mounts** (`:ro`) prevent accidental modifications
5. **Check logs** with `docker logs <container-name>`

---

**Need help?** See [MCP-SERVERS.md](./MCP-SERVERS.md) for detailed documentation.

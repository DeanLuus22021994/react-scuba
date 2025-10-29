# Quick Start Guide - MCP Development Environment

## 🚀 Getting Started in 5 Minutes

### Prerequisites

- Docker Desktop with Compose V2
- VS Code with Dev Containers extension
- Git

### 1. Clone and Configure

```bash
# Clone repository
git clone https://github.com/DeanLuus22021994/react-scuba.git
cd react-scuba

# Copy environment configuration
cp .env.example .env

# Optional: Enable MCP auto-start (default: manual)
# Edit .env and set: ENABLE_MCP=true
```

### 2. Start Development Environment

```bash
# Start main infrastructure
docker compose up -d

# Optional: Start MCP service
npm run mcp:start
# or
docker compose --profile mcp up -d
```

### 3. Open in VS Code

```bash
# Open in VS Code
code .

# Or use VS Code Insiders
code-insiders .

# Reopen in Container
# Command Palette (Ctrl+Shift+P) → "Dev Containers: Reopen in Container"
```

### 4. Verify Installation

```bash
# Check service health
npm run mcp:health

# View service discovery
npm run mcp:discovery

# Check workspace volumes
docker volume ls | grep react_scuba
```

---

## 📋 Common Commands

### MCP Service Management

```bash
npm run mcp:start        # Start MCP service
npm run mcp:stop         # Stop MCP service
npm run mcp:restart      # Restart service
npm run mcp:logs         # View logs
npm run mcp:health       # Health check
```

### Development Workflow

```bash
npm run dev              # Start Turbo dev server
npm run build            # Build all workspaces
npm test                 # Run tests
npm run lint:fix         # Fix linting issues
```

### VS Code Insiders Updates

```bash
npm run vscode:update-check    # Check for updates
npm run vscode:update          # Update VS Code Insiders
npm run vscode:rollback        # Rollback to previous version
```

---

## 🎯 Key Features

### ✅ Named Volumes for Dependency Isolation

- No `node_modules` in source tree
- Workspace-specific volumes
- Fast Git operations

### ✅ Persistent MCP Service

- Survives container rebuilds
- Real-time health monitoring
- WebSocket streaming

### ✅ VS Code Insiders with User Control

- Manual update workflow
- Version pinning support
- Rollback capability

### ✅ Full Stack Discovery

- Automatic service registration
- Real-time status monitoring
- Integration with Prometheus/Grafana

---

## 🔧 Configuration

### Enable MCP Auto-Start

Edit `.env`:

```env
ENABLE_MCP=true
```

### Access MCP Endpoints

- **Health**: <http://localhost:9099/health>
- **Service Discovery**: <http://localhost:9097/services>
- **WebSocket**: ws://localhost:9097

### Volume Locations

Named volumes are stored in Docker's volume directory:

```bash
# Linux/Mac
/var/lib/docker/volumes/

# Windows WSL2
\\wsl$\docker-desktop-data\version-pack-data\community\docker\volumes\
```

---

## 🐛 Troubleshooting

### MCP Service Not Accessible

```bash
# Check service status
docker compose ps python-mcp-sidecar

# View logs
npm run mcp:logs

# Restart service
npm run mcp:restart
```

### Volume Permission Issues

```bash
# Fix permissions
docker compose exec python-mcp-sidecar chown -R vscode:vscode /cache

# Or recreate volumes
docker compose down -v
docker compose --profile mcp up -d
```

### Port Conflicts

If port 9099 or 9097 is already in use:

Edit `.env`:

```env
MCP_HTTP_PORT=9199
MCP_HEALTH_WEBSOCKET_PORT=9197
```

---

## 📚 Documentation

- [Full Implementation Guide](DEVCONTAINER_IMPLEMENTATION.md)
- [Multi-Tenant Architecture](MULTI_TENANT.md)
- [Development Guide](DEVELOPMENT.md)
- [Python MCP Utils](docker-compose-examples/mcp/python_utils/README.md)

---

## 🆘 Support

### Health Checks

```bash
npm run mcp:health           # MCP service health
npm run mcp:discovery        # Service discovery status
docker compose ps            # All services status
```

### Logs

```bash
npm run mcp:logs            # MCP logs
docker compose logs -f      # All services logs
```

### Reset Everything

```bash
# Nuclear option - removes all volumes and containers
docker compose down -v
docker compose --profile mcp down -v
rm -rf server/node_modules

# Fresh start
docker compose up -d
npm run mcp:start
```

---

## ✨ Next Steps

1. **Explore the workspace** - Open `react-scuba.code-workspace`
2. **Run the dev server** - `npm run dev`
3. **Check MCP health** - `npm run mcp:health`
4. **View service discovery** - Open <http://localhost:9097/services>
5. **Start building** - Your development environment is ready!

---

**Happy Coding!** 🎉

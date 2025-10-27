# MCP DevContainer Quick Start Guide

## Prerequisites

- **Docker**: 20.10+ with Compose V2
- **VS Code**: Latest version
- **DevContainers Extension**: `ms-vscode-remote.remote-containers`
- **RAM**: 8GB minimum, 16GB recommended
- **Disk Space**: 20GB free
- **OS**: Windows 10/11 (WSL2), macOS, or Linux

## 1-Minute Setup

### Step 1: Clone and Navigate

```bash
git clone https://github.com/DeanLuus22021994/react-scuba.git
cd react-scuba
```

### Step 2: Configure Environment

```bash
cd .devcontainer
cp devcontainer.env .env  # Required for docker-compose variable substitution

# Optional: Set GitHub token for Actions runner
echo "GITHUB_TOKEN=your_github_token_here" >> .env
```

### Step 3: Start Cluster

```powershell
# Full cluster deployment (automatic tier ordering)
docker-compose -f docker-compose.mcp.yml up -d --build

# Wait for services to become healthy (~2 minutes)
Start-Sleep -Seconds 120

# Verify status
docker-compose -f docker-compose.mcp.yml ps
```

### Step 4: Open DevContainer

1. Open VS Code
2. Press `F1` → "Dev Containers: Open Folder in Container..."
3. Select `react-scuba/` directory
4. Wait for DevContainer build and initialization (~3 minutes first time)

## Verify Installation

### Check Service Health

```powershell
# All services should show 'healthy' status
docker-compose -f .devcontainer/docker-compose.mcp.yml ps --filter 'health=healthy'

# Count healthy services (should be 11+)
(docker-compose -f .devcontainer/docker-compose.mcp.yml ps --filter 'health=healthy' --format json | ConvertFrom-Json).Count
```

### Access Monitoring Dashboards

- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **nginx Gateway**: http://localhost
- **cAdvisor**: http://localhost:8081

### Test MCP Servers

1. Open Copilot Chat in VS Code (`Ctrl+Shift+I`)
2. Test commands:
   - `@workspace list all files in src/`
   - `@workspace show git status`
   - `@workspace fetch https://api.github.com/users/octocat`

Expected: Copilot responds with file listings, git status, and fetched JSON data

### Test Database Connections

```powershell
# PostgreSQL
docker exec -it postgres-db psql -U postgres -c "SELECT version();"

# MariaDB
docker exec -it mariadb mysql -u root -ppassword -e "SELECT VERSION();"
```

## Common First-Time Issues

### Issue: "Cannot connect to Docker daemon"

**Solution**: Ensure Docker Desktop is running

```powershell
# Windows: Start Docker Desktop from Start menu
# Verify: docker ps
```

### Issue: "Port already in use"

**Solution**: Stop conflicting services

```powershell
# Check what's using the port
netstat -ano | findstr ":3000"  # Example for port 3000

# Stop and restart cluster
docker-compose -f .devcontainer/docker-compose.mcp.yml down
docker-compose -f .devcontainer/docker-compose.mcp.yml up -d
```

### Issue: "Service unhealthy" after startup

**Solution**: Check logs and wait longer

```powershell
# View logs for unhealthy service
docker logs <service_name>

# Some services take 60s+ to become healthy (e.g., BuildKit, runner)
Start-Sleep -Seconds 60
docker-compose -f .devcontainer/docker-compose.mcp.yml ps
```

### Issue: "Out of memory" during build

**Solution**: Increase Docker memory limit

1. Docker Desktop → Settings → Resources
2. Set Memory to 8GB minimum
3. Restart Docker Desktop

### Issue: "GitHub Actions runner keeps restarting"

**Solution**: Set GitHub credentials

```powershell
# Add to .devcontainer/.env
echo "GITHUB_TOKEN=ghp_your_token_here" >> .env

# Restart runner
docker-compose -f .devcontainer/docker-compose.mcp.yml restart runner
```

## Performance Tips

### Speed Up Builds

```powershell
# Use BuildKit cache
$env:DOCKER_BUILDKIT=1
$env:COMPOSE_DOCKER_CLI_BUILD=1

# Parallel builds
docker-compose -f .devcontainer/docker-compose.mcp.yml build --parallel

# Selective rebuild (only changed services)
docker-compose -f .devcontainer/docker-compose.mcp.yml up -d --no-deps --build <service_name>
```

### Reduce Resource Usage

- **Disable unused services**: Comment out in `docker-compose.mcp.yml`
- **Stop when not in use**: `docker-compose down` (preserves volumes)
- **Prune periodically**: `docker system prune -af` (warning: removes unused images)

## Daily Workflow

### Start Work Session

```powershell
# 1. Start cluster
cd .devcontainer
docker-compose -f docker-compose.mcp.yml up -d

# 2. Wait for health checks (~30s for warm start)
Start-Sleep -Seconds 30

# 3. Open DevContainer in VS Code
code ..
# F1 → "Dev Containers: Reopen in Container"
```

### End Work Session

```powershell
# Stop cluster (preserves volumes)
docker-compose -f .devcontainer/docker-compose.mcp.yml stop

# Or completely shut down
docker-compose -f .devcontainer/docker-compose.mcp.yml down
```

## Next Steps

1. **Customize Configuration**: Edit `.devcontainer/devcontainer.json` for VS Code settings
2. **Explore Dashboards**: Open Grafana and explore pre-configured dashboards
3. **Test MCP Servers**: Use Copilot Chat to interact with filesystem, git, and GitHub
4. **Read Architecture Docs**: See `.devcontainer/docs/architecture/` for deep dives
5. **Contribute**: Follow `.devcontainer/docs/setup/build-process.md` for development

## Troubleshooting Resources

- **Logs**: `docker-compose -f .devcontainer/docker-compose.mcp.yml logs -f <service>`
- **Health**: `docker inspect <container> --format='{{json .State.Health}}'`
- **Network**: `docker network inspect mcp-cluster`
- **Volumes**: `docker volume ls --filter label=com.docker.compose.project=mcp-cluster`

## Support

- **GitHub Issues**: https://github.com/DeanLuus22021994/react-scuba/issues
- **Documentation**: `.devcontainer/docs/`
- **Architecture**: `.devcontainer/docs/architecture/orchestration.md`

## Estimated Timings

- **First-time setup**: 10-15 minutes (image downloads, builds)
- **Subsequent starts**: 30-60 seconds (services already built)
- **DevContainer open**: 1-2 minutes (VS Code initialization)
- **Cold cache build**: <5 minutes (parallel builds)
- **Warm cache build**: <10 seconds (layer cache)

Success! You now have a fully functional MCP DevContainer cluster with comprehensive monitoring.

# Docker Cluster Example with Devcontainer

This simulates a simple cluster with devcontainer load balancer.

## Services

- **loadbalancer**: Devcontainer with Node.js, Python, NVIDIA GPU
- **web1-3**: Nginx web servers
- **db**: PostgreSQL database

## Devcontainer Usage

Open in VS Code Insiders, use "Dev Containers: Reopen in Container" command.

## Manual Usage

```bash
cd cluster-example
docker-compose up -d
```

## Access

- Load balanced web: <http://localhost:8080>
- DB: localhost:5432

## User Acceptance Testing Results

### UAT Session: 2025-10-22 13:47 UTC

**Environment**: Clean Docker slate (all images, volumes, cache pruned)

**Test Summary**:

- **Validation**: ✅ Configuration valid
- **Build**: ✅ Successful (fresh builds)
- **Startup**: ✅ All services started successfully
- **Health Checks**:
  - DB: ✅ Healthy (PostgreSQL ready)
  - Web1-3: ✅ Healthy (nginx serving static content)
  - Node: ✅ Healthy (Vite dev server running on port 3000)
  - Python: ✅ Completed successfully (inventory generation batch job)
- **Loadbalancer**: ✅ Started (devcontainer environment available)
- **Application Access**:
  - React App: ✅ `http://localhost:3000` (Vite dev server)
  - Static Web: ✅ nginx web servers healthy
  - Database: ✅ `localhost:5432` (PostgreSQL)
- **Cleanup**: ✅ Completed successfully

### Infrastructure Status

- ✅ Docker Compose v3.8 compatibility confirmed
- ✅ Load-balanced cluster with 3 nginx instances
- ✅ Named volumes and bind mounts functional
- ✅ PostgreSQL health checks pass
- ✅ Python batch job execution successful
- ✅ Node.js application serves content correctly
- ✅ Devcontainer loadbalancer builds and starts

### Issues Resolved

- Fixed HTML accessibility (added charset, viewport, lang attributes)
- Fixed Python command (added missing "inventory" subcommand)
- Fixed React 19 conflicts (added --legacy-peer-deps to npm install)
- Fixed Node health check (changed from /health to root endpoint with wget)
- Removed Python dependency from loadbalancer (batch job design)

## Cleanup

```bash
docker-compose down -v
```

# Basic Docker Compose Stack with Devcontainer

This is a simple multi-service application with devcontainer support.

## Services

- **app**: Devcontainer with Node.js, Python, NVIDIA GPU
- **db**: PostgreSQL database

## Devcontainer Usage

Open in VS Code Insiders, use "Dev Containers: Reopen in Container" command.

## Manual Usage

```bash
cd basic-stack
docker-compose up -d
```

## Access

- DB: localhost:5432 (user: user, password: password, db: mydb)

## User Acceptance Testing Results

### UAT Session: 2025-10-22 13:45 UTC

**Environment**: Clean Docker slate (all images, volumes, cache pruned)

**Test Summary**:

- **Validation**: ✅ Configuration valid
- **Build**: ✅ Successful (fresh builds)
- **Startup**: ✅ All services started successfully
- **Health Checks**:
  - DB: ✅ Healthy (PostgreSQL pg_isready)
  - Python: ✅ Completed successfully (inventory generation batch job)
  - Node: ⚠️ Running but health check fails (curl not available in Alpine)
- **Application Access**:
  - React App: ✅ `http://localhost:3000` (Vite dev server fully functional)
  - Database: ✅ `localhost:5432` (PostgreSQL accessible)
- **Cleanup**: ✅ Completed successfully

### Infrastructure Status

- ✅ Docker Compose v3.8 compatibility confirmed
- ✅ Named volumes and bind mounts functional
- ✅ PostgreSQL health checks pass
- ✅ Python batch job execution successful
- ✅ Node.js application serves content correctly
- ⚠️ Health check tooling limitations (curl unavailable in Alpine)

### Known Issues

1. **Health Check Tooling**: Node service health check fails due to missing curl in Alpine image, but application is fully functional
2. **Esbuild Performance**: Previous deadlock issues not observed in clean environment testing

### Recommendations

- Consider using wget or alternative health check tools for Alpine-based images
- Health checks could be enhanced to use application-specific endpoints when available

## Cleanup

```bash
docker-compose down -v
```

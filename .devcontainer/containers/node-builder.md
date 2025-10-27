# Node.js Builder Container

**Purpose**: Unified development container for pre-commit hooks, linting, formatting, and Turborepo builds with zero repository pollution.

## Features

- ✅ **Pre-commit hooks** (Husky 9.1.7) with persistent cache
- ✅ **Turborepo builds** with shared .turbo cache across containers
- ✅ **Named volumes** for 
ode_modules, npm cache, Turbo cache
- ✅ **Fast rebuilds** - cached dependencies persist across container restarts
- ✅ **Git integration** - pre-configured git config for container environment
- ✅ **Multi-stage build** - optimized layer caching

## Architecture

### Multi-Stage Build

\\\dockerfile
base           -> Node 22 Alpine + git, python3, make, g++
git-setup      -> Git configuration for container
dependencies   -> Cache directories setup
workspace-clone -> Symlinks for cached volumes
git-hooks      -> Husky setup script
turbo-build    -> Turborepo build script
runtime        -> Production runtime with health checks
\\\

### Named Volumes (Persistent Cache)

- \
ode-builder-node-modules\ - All npm dependencies (\/cache/node_modules\)
- \
ode-builder-npm\ - npm package cache (\/cache/npm\)
- \
ode-builder-turbo\ - Turborepo build cache (\/cache/turbo\)
- \
ode-builder-git-hooks\ - Git hooks cache (\/cache/git-hooks\)
- \
ode-builder-husky\ - Husky configuration (\/cache/husky\)

## Usage

### Build the Image

\\\ash
docker build -f .devcontainer/containers/Dockerfile.node -t react-scuba-node:latest .
\\\

### Run Interactive Shell

\\\ash
docker run -it --rm \\
  -v \C:\react_scuba_runner\react-scuba/server:/workspace \\
  -v node-builder-node-modules:/cache/node_modules \\
  -v node-builder-npm:/cache/npm \\
  -v node-builder-turbo:/cache/turbo \\
  react-scuba-node:latest sh
\\\

### Run Turborepo Build

\\\ash
docker run --rm \\
  -v \C:\react_scuba_runner\react-scuba/server:/workspace \\
  -v node-builder-node-modules:/cache/node_modules \\
  -v node-builder-npm:/cache/npm \\
  -v node-builder-turbo:/cache/turbo \\
  react-scuba-node:latest turbo-build.sh
\\\

### Run Pre-commit Checks

\\\ash
docker run --rm \\
  -v \C:\react_scuba_runner\react-scuba/server:/workspace \\
  -v node-builder-node-modules:/cache/node_modules \\
  -v node-builder-git-hooks:/cache/git-hooks \\
  react-scuba-node:latest npx husky run pre-commit
\\\

## Docker Compose Integration

### Example Service Definition

\\\yaml
services:
  node-builder:
    build:
      context: .
      dockerfile: .devcontainer/containers/Dockerfile.node
    image: react-scuba-node:latest
    container_name: node-builder
    volumes:
      - ./server:/workspace
      - node-builder-node-modules:/cache/node_modules
      - node-builder-npm:/cache/npm
      - node-builder-turbo:/cache/turbo
      - node-builder-git-hooks:/cache/git-hooks
      - node-builder-husky:/cache/husky
    working_dir: /workspace
    command: ["npm", "run", "dev"]
    networks:
      - mcp-cluster
    environment:
      - NODE_ENV=development
      - TURBO_TELEMETRY_DISABLED=1

volumes:
  node-builder-node-modules:
    name: node-builder-node-modules
  node-builder-npm:
    name: node-builder-npm
  node-builder-turbo:
    name: node-builder-turbo
  node-builder-git-hooks:
    name: node-builder-git-hooks
  node-builder-husky:
    name: node-builder-husky
\\\

## Helper Scripts

### \setup-hooks.sh\

Located at \/usr/local/bin/setup-hooks.sh\

- Checks if workspace is mounted
- Installs dependencies if \
ode_modules\ is empty
- Runs \
px husky install\ to setup git hooks

### \	urbo-build.sh\

Located at \/usr/local/bin/turbo-build.sh\

- Runs \
pm run build\ with Turborepo
- Leverages \.turbo\ cache for incremental builds
- Displays cache statistics after build

## Workflow

### First Run (Cold Start)

1. Container starts
2. \setup-hooks.sh\ detects empty \
ode_modules\
3. Runs \
pm ci\ (installs to \/cache/node_modules\)
4. Sets up Husky git hooks
5. **Duration**: ~2-3 minutes

### Subsequent Runs (Warm Start)

1. Container starts
2. \setup-hooks.sh\ finds existing \
ode_modules\ in cache
3. Skips installation
4. Ready immediately
5. **Duration**: <5 seconds

### Turborepo Build (Cached)

1. Run \	urbo-build.sh\
2. Turborepo reads \.turbo/cache\
3. Skips unchanged packages
4. Only builds modified code
5. **Duration**: Seconds to minutes (depends on changes)

## Performance Benefits

### Before (Local Development)

- \
ode_modules\ in repository (~500MB)
- Slow git operations
- Large Docker image sizes
- Fresh install required per container

### After (Container with Named Volumes)

- \
ode_modules\ in named volume (outside repository)
- Fast git operations
- Small Docker images (base + app code)
- Persistent cache across containers
- **~10-50x faster** for warm starts

## Troubleshooting

### Issue: \"Cannot find module\"

**Cause**: node_modules volume not mounted or empty

**Solution**:
\\\ash
docker run -it --rm \\
  -v node-builder-node-modules:/cache/node_modules \\
  react-scuba-node:latest sh -c \"cd /workspace && npm ci\"
\\\

### Issue: Turbo cache not working

**Cause**: \.turbo\ volume not mounted

**Solution**: Ensure \
ode-builder-turbo\ volume is mounted to \/cache/turbo\

### Issue: Git hooks not running

**Cause**: Husky not initialized

**Solution**:
\\\ash
docker exec -it node-builder sh -c \"cd /workspace && npx husky install\"
\\\

## Environment Variables

- \NPM_CONFIG_CACHE=/cache/npm\ - npm cache location
- \TURBO_CACHE_DIR=/cache/turbo\ - Turborepo cache location
- \NODE_OPTIONS=--max-old-space-size=4096\ - 4GB heap size
- \HUSKY=1\ - Enable Husky git hooks

## Health Check

The container includes a health check that runs every 30 seconds:

\\\ash
node --eval \"console.log('healthy')\"
\\\

Check container health:
\\\ash
docker ps --filter name=node-builder --format \"table {{.Names}}\\t{{.Status}}\"
\\\

## Labels

- \purpose=node-development\
- \eatures=pre-commit,turborepo,git-hooks\
- \caching=named-volumes\
- \
ode.version=22\
- \package.manager=npm\

## Next Steps

1. ✅ Build image: \docker build -f .devcontainer/containers/Dockerfile.node -t react-scuba-node:latest .\
2. ✅ Create named volumes (automatic on first run)
3. ✅ Mount workspace and run: \docker run -v ./server:/workspace react-scuba-node:latest\
4. ⏳ Integrate into \docker-compose.mcp.yml\
5. ⏳ Add CI/CD pipeline to use container for builds

## References

- **Turborepo**: https://turbo.build/repo/docs
- **Husky**: https://typicode.github.io/husky/
- **Docker Volumes**: https://docs.docker.com/storage/volumes/
- **Alpine Linux**: https://alpinelinux.org/

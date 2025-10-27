# DevContainer MCP Architecture Reorganization - TODO

**Date**: October 27, 2025  
**Status**: Planning - Awaiting User Approval  
**Priority**: HIGH - Complete architectural refactoring

## User Clarifications (Applied)

✅ **Python Version**: ENV PYTHON_VERSION 3.15.0a1 (from docker-library/python official Dockerfile)  
✅ **Python 3.14 Free-Threaded**: STABLE and RELEASED (use `python:3.14.0-slim-bookworm`)  
✅ **TBC Monitoring**: Multi-container stack exists (using prom/prometheus, grafana/grafana, nginx:alpine separately)  
✅ **GitHub Runner**: Volume-mounted precompilation for persistence (reference: Pwd9000-ML/devcontainer-templates)  
✅ **MCP Servers**: Current docker run pattern with named volume mounts (maintained)  
✅ **BuildKit Privileged**: Approved (required for caching and multi-platform builds)

---

## Phase 1: Research & Validation ✓

### 1.1 Changed Files Assessment ✓
- [x] Retrieved git changes via #get_changed_files
- [x] Confirmed 13 deleted files from .github/
  - MCP-QUICK-START.md (146 lines)
  - MCP-SERVERS.md (482 lines)
  - build-mcp-servers.ps1 (200 lines)
  - docker-compose.mcp.yml (181 lines old version)
  - 9x Dockerfiles (fetch, filesystem, git, github, memory, postgres, sqlite + mariadb, python-experimental)
- [x] Identified current location: .github/services/{service}/ structure exists

### 1.2 Python 3.15.0a1 Image Research ✓
- [x] Confirmed ENV PYTHON_VERSION 3.15.0a1 from docker-library/python
- [x] Located official Dockerfile: https://github.com/docker-library/python/blob/main/3.15-rc/bookworm/Dockerfile
- [x] Image tag: `python:3.15.0a1-slim-bookworm`
- [x] SHA256: 3194939d488eeaeefdcf990d35542d9ad1ce788789c4e2305a2060eb7058e5a4
- [x] Free-threaded note: Python 3.14.0 has free-threaded STABLE release

### 1.3 Python 3.14.0 Free-Threaded Research ✓
- [x] Confirmed official release: python:3.14.0-slim-bookworm
- [x] SHA256: 2299dae542d395ce3883aca00d3c910307cd68e0b2f7336098c8e7b7eee9f3e9
- [x] Free-threaded support: Stable in 3.14.0 (PEP 703)
- [x] Verification command: `import sys; print(sys._is_gil_enabled())`
- [x] Note: May need `--disable-gil` build flag or `PYTHON_GIL=0` environment variable

### 1.4 TBC Monitoring Stack Research ✓
- [x] Confirmed existing multi-container solution pattern
- [x] Images identified:
  - nginx:alpine (~25MB) - Reverse proxy
  - prom/prometheus:latest (~250MB) - Metrics collection
  - grafana/grafana:latest (~350MB) - Visualization
- [x] Total footprint: ~625MB images + data volumes
- [x] Ports: 80/443 (nginx), 9090 (prometheus), 3000 (grafana)
- [x] Architecture: Sidecar pattern (separate containers) ✓ RECOMMENDED

### 1.5 GitHub Actions Runner Research ✓
- [x] Reference found: Pwd9000-ML/devcontainer-templates/github-actions-runner-devcontainer
- [x] Pattern: Volume-mounted precompilation for persistence across builds
- [x] Image: myoung34/github-runner:latest (community) or official source build
- [x] Required volumes:
  - runner-work:/work (job workspace)
  - runner-cache:/.cache (precompiled dependencies)
- [x] Environment variables: GITHUB_TOKEN, REPO_URL, RUNNER_NAME, EPHEMERAL=true

### 1.6 NVIDIA GPU Passthrough Research ✓
- [x] Docker Compose syntax: `deploy.resources.reservations.devices`
- [x] Required environment variables:
  - NVIDIA_VISIBLE_DEVICES=all
  - NVIDIA_DRIVER_CAPABILITIES=compute,utility
- [x] Health check: `nvidia-smi`
- [x] k8s-plugin ONLY (no other containers get GPU)

### 1.7 Docker BuildKit Service Research ✓
- [x] Image: moby/buildkit:latest
- [x] Exposed port: 1234 (TCP)
- [x] Required volumes:
  - /var/run/docker.sock:/var/run/docker.sock (docker-container driver)
  - buildkit-cache:/var/lib/buildkit (state and cache)
  - buildkit-tmp:/tmp (temporary build artifacts)
- [x] Privileged: YES (required for build caching)
- [x] Health check: `buildctl debug info`

---

## Phase 2: Folder Structure Reorganization

### 2.1 Create Target Folder Structure

**Command**:
```powershell
New-Item -ItemType Directory -Force -Path ".devcontainer/mcp/fetch"
New-Item -ItemType Directory -Force -Path ".devcontainer/mcp/filesystem"
New-Item -ItemType Directory -Force -Path ".devcontainer/mcp/git"
New-Item -ItemType Directory -Force -Path ".devcontainer/mcp/github"
New-Item -ItemType Directory -Force -Path ".devcontainer/mcp/memory"
New-Item -ItemType Directory -Force -Path ".devcontainer/mcp/python-experimental"
New-Item -ItemType Directory -Force -Path ".devcontainer/containers/k8s-plugin"
New-Item -ItemType Directory -Force -Path ".devcontainer/containers/mariadb"
New-Item -ItemType Directory -Force -Path ".devcontainer/containers/postgres"
New-Item -ItemType Directory -Force -Path ".devcontainer/containers/buildx"
New-Item -ItemType Directory -Force -Path ".devcontainer/containers/runner"
New-Item -ItemType Directory -Force -Path ".devcontainer/containers/TBC"
New-Item -ItemType Directory -Force -Path ".devcontainer/docs/architecture"
New-Item -ItemType Directory -Force -Path ".devcontainer/docs/services"
New-Item -ItemType Directory -Force -Path ".devcontainer/docs/setup"
```

**Checklist**:
- [ ] Create .devcontainer/mcp/fetch/ folder
- [ ] Create .devcontainer/mcp/filesystem/ folder
- [ ] Create .devcontainer/mcp/git/ folder
- [ ] Create .devcontainer/mcp/github/ folder
- [ ] Create .devcontainer/mcp/memory/ folder
- [ ] Create .devcontainer/mcp/python-experimental/ folder (stays in compose for R&D)
- [ ] Create .devcontainer/containers/k8s-plugin/ folder
- [ ] Create .devcontainer/containers/mariadb/ folder
- [ ] Create .devcontainer/containers/postgres/ folder
- [ ] Create .devcontainer/containers/buildx/ folder
- [ ] Create .devcontainer/containers/runner/ folder
- [ ] Create .devcontainer/containers/TBC/ folder (monitoring stack parent)
- [ ] Create .devcontainer/docs/architecture/ folder
- [ ] Create .devcontainer/docs/services/ folder
- [ ] Create .devcontainer/docs/setup/ folder

### 2.2 Move MCP Server Files (stdio-based)

**Source**: `.github/services/{service}/`  
**Target**: `.devcontainer/mcp/{service}/`

**Checklist**:
- [ ] Move .github/services/fetch/ → .devcontainer/mcp/fetch/
  - [ ] Dockerfile
  - [ ] README.md
  - [ ] config/fetch.yml
- [ ] Move .github/services/filesystem/ → .devcontainer/mcp/filesystem/
  - [ ] Dockerfile
  - [ ] README.md
  - [ ] config/filesystem.yml
- [ ] Move .github/services/git/ → .devcontainer/mcp/git/
  - [ ] Dockerfile
  - [ ] README.md
  - [ ] config/git.yml
- [ ] Move .github/services/github/ → .devcontainer/mcp/github/
  - [ ] Dockerfile (uses ghcr.io/github/github-mcp-server:latest)
  - [ ] README.md
  - [ ] config/github.yml
- [ ] Move .github/services/memory/ → .devcontainer/mcp/memory/
  - [ ] Dockerfile
  - [ ] README.md
  - [ ] config/memory.yml

### 2.3 Move Container Service Files (docker-compose services)

**Source**: `.github/services/{service}/`  
**Target**: `.devcontainer/containers/{service}/`

**Checklist**:
- [ ] Move .github/services/k8s-plugin/ → .devcontainer/containers/k8s-plugin/
  - [ ] Dockerfile
  - [ ] README.md (update with GPU passthrough details)
  - [ ] config/k8s-plugin.yml
- [ ] Move .github/services/mariadb/ → .devcontainer/containers/mariadb/
  - [ ] Dockerfile
  - [ ] README.md
  - [ ] config/mariadb.yml
- [ ] Move .github/services/postgres/ → .devcontainer/containers/postgres/
  - [ ] Dockerfile (database, not MCP server)
  - [ ] README.md
  - [ ] config/postgresql.conf
- [ ] Move .github/services/python-experimental/ → .devcontainer/mcp/python-experimental/
  - [ ] Dockerfile (Python 3.15.0a1 free-threaded)
  - [ ] README.md (already exists, ENV PYTHON_VERSION 3.15.0a1)
  - [ ] config/python-experimental.yml

---

## Phase 3: New Container Definitions

### 3.1 Docker BuildKit Service

**File**: `.devcontainer/containers/buildx/Dockerfile`

**Checklist**:
- [ ] Create Dockerfile:
  ```dockerfile
  FROM moby/buildkit:latest
  EXPOSE 1234
  ENTRYPOINT ["buildkitd"]
  CMD ["--addr", "tcp://0.0.0.0:1234", \
       "--oci-worker-gc=true", \
       "--oci-worker-gc-keepstorage=5000"]
  ```
- [ ] Create README.md:
  - Purpose: BuildKit daemon for multi-platform builds
  - Port: 1234
  - Volumes: buildkit-cache, buildkit-tmp, /var/run/docker.sock
  - Privileged: YES
  - Client connection: `BUILDKIT_HOST=tcp://buildkit:1234`
- [ ] Create config/buildkitd.toml:
  - Cache configuration
  - Worker settings
  - Registry mirrors

### 3.2 GitHub Actions Runner Service

**File**: `.devcontainer/containers/runner/Dockerfile`

**Checklist**:
- [ ] Create Dockerfile:
  ```dockerfile
  FROM myoung34/github-runner:latest
  # Add custom tools
  RUN apt-get update && apt-get install -y \
      python3-pip \
      nodejs \
      npm \
      && rm -rf /var/lib/apt/lists/*
  ENV RUNNER_WORKDIR=/work
  ```
- [ ] Create README.md:
  - Purpose: Self-hosted GitHub Actions runner
  - Environment: GITHUB_TOKEN, REPO_URL, RUNNER_NAME, EPHEMERAL=true
  - Volumes: runner-work:/work, runner-cache:/.cache
  - Privileged: YES (for Docker-in-Docker)
  - Health check: `pgrep Runner.Listener`
- [ ] Create config/runner.env:
  - RUNNER_NAME=docker-runner-01
  - LABELS=docker,linux,x64,self-hosted
  - START_DOCKER_SERVICE=true

### 3.3 TBC Monitoring Stack

**File**: `.devcontainer/containers/TBC/docker-compose.tbc.yml` (sidecar pattern)

**Checklist**:
- [ ] Create docker-compose.tbc.yml:
  ```yaml
  services:
    nginx:
      image: nginx:alpine
      ports:
        - "80:80"
        - "443:443"
      volumes:
        - ./config/nginx.conf:/etc/nginx/nginx.conf:ro
        - ./config/ssl:/etc/nginx/ssl:ro
      networks:
        mcp-cluster:
          ipv4_address: 172.20.0.70
    
    prometheus:
      image: prom/prometheus:latest
      ports:
        - "9090:9090"
      volumes:
        - ./config/prometheus.yml:/etc/prometheus/prometheus.yml:ro
        - prometheus-data:/prometheus
      networks:
        mcp-cluster:
          ipv4_address: 172.20.0.71
    
    grafana:
      image: grafana/grafana:latest
      ports:
        - "3000:3000"
      environment:
        - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD:-admin}
      volumes:
        - grafana-data:/var/lib/grafana
        - ./config/grafana:/etc/grafana/provisioning:ro
      networks:
        mcp-cluster:
          ipv4_address: 172.20.0.72
  ```
- [ ] Create README.md:
  - Purpose: Unified monitoring stack (nginx + prometheus + grafana)
  - Architecture: Sidecar pattern (3 separate containers)
  - Total size: ~625MB images + data
  - Ports: 80/443 (nginx), 9090 (prometheus), 3000 (grafana)
  - IPs: 172.20.0.70-72
- [ ] Create config/nginx.conf (reverse proxy for prometheus/grafana)
- [ ] Create config/prometheus.yml (scrape configs for all services)
- [ ] Create config/grafana/provisioning/datasources/prometheus.yml
- [ ] Create config/grafana/provisioning/dashboards/docker.json

---

## Phase 4: DevContainer Base Image (Python 3.14.0 Free-Threaded)

### 4.1 Rewrite .devcontainer/Dockerfile

**Current**: Node.js 22 bookworm-slim (11 lines)  
**Target**: Python 3.14.0 free-threaded slim-bookworm with Node.js 22 for VS Code

**File**: `.devcontainer/Dockerfile`

**Checklist**:
- [ ] Replace FROM statement:
  ```dockerfile
  FROM python:3.14.0-slim-bookworm
  # SHA256: 2299dae542d395ce3883aca00d3c910307cd68e0b2f7336098c8e7b7eee9f3e9
  ```
- [ ] Install Node.js 22 (required for VS Code compatibility):
  ```dockerfile
  RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
      apt-get install -y nodejs && \
      rm -rf /var/lib/apt/lists/*
  ```
- [ ] Install development tools:
  ```dockerfile
  RUN apt-get update && apt-get install -y \
      git \
      curl \
      wget \
      build-essential \
      vim \
      nano \
      zsh \
      && rm -rf /var/lib/apt/lists/*
  ```
- [ ] Configure Python free-threaded:
  ```dockerfile
  ENV PYTHON_GIL=0 \
      PYTHONPROFILEIMPORTTIME=1 \
      PYTHONOPTIMIZE=2
  ```
- [ ] Create non-root vscode user:
  ```dockerfile
  RUN useradd -m -s /bin/bash vscode && \
      usermod -aG sudo vscode && \
      echo 'vscode ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
      mkdir -p /workspaces && \
      chown vscode:vscode /workspaces
  USER vscode
  ```
- [ ] Verify free-threaded build:
  ```dockerfile
  RUN python3 -c "import sys; assert not sys._is_gil_enabled(), 'GIL is not disabled!'"
  ```
- [ ] Install Python packages:
  ```dockerfile
  RUN pip install --no-cache-dir \
      black \
      ruff \
      mypy \
      pytest \
      uv
  ```
- [ ] Install Node.js packages:
  ```dockerfile
  RUN npm install -g \
      typescript \
      eslint \
      prettier \
      vite \
      vitest
  ```
- [ ] Set working directory:
  ```dockerfile
  WORKDIR /workspaces
  CMD ["/bin/bash"]
  ```

### 4.2 Update devcontainer.json References

**File**: `.devcontainer/devcontainer.json`

**Checklist**:
- [ ] Update dockerComposeFile path: `[".devcontainer/docker-compose.mcp.yml"]`
- [ ] Remove Python feature (already in base image):
  ```json
  // REMOVE:
  // "ghcr.io/devcontainers/features/python:1": {
  //   "version": "3.12"
  // }
  ```
- [ ] Update Python interpreter path: `"python.defaultInterpreterPath": "/usr/local/bin/python3"`
- [ ] Add free-threaded verification to postCreateCommand:
  ```json
  "postCreateCommand": "npm install && python3 -c 'import sys; print(f\"GIL Enabled: {sys._is_gil_enabled()}\")' && echo '✅ Development environment ready!'"
  ```

---

## Phase 5: MCP Server stdio Configuration

### 5.1 Add mcpServers to devcontainer.json

**File**: `.devcontainer/devcontainer.json`

**Checklist**:
- [ ] Add mcpServers object (based on VS Code MCP documentation):
  ```json
  "mcpServers": {
    "filesystem": {
      "type": "stdio",
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "--name", "filesystem-mcp",
        "--network", "mcp-cluster",
        "-v", "${workspaceFolder}:/workspace:ro",
        "-v", "filesystem-node-cache:/cache/node",
        "mcp-filesystem:latest"
      ]
    },
    "git": {
      "type": "stdio",
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "--name", "git-mcp",
        "--network", "mcp-cluster",
        "-v", "${workspaceFolder}:/repos",
        "-v", "git-cache:/cache/git",
        "-v", "git-pip-cache:/cache/pip",
        "-v", "git-python-cache:/cache/python",
        "mcp-git:latest"
      ]
    },
    "fetch": {
      "type": "stdio",
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "--name", "fetch-mcp",
        "--network", "mcp-cluster",
        "-v", "fetch-cache:/cache/fetch",
        "-v", "fetch-pip-cache:/cache/pip",
        "-v", "fetch-python-cache:/cache/python",
        "-v", "fetch-http-cache:/cache/http",
        "mcp-fetch:latest"
      ]
    },
    "github": {
      "type": "stdio",
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "--name", "github-mcp",
        "--network", "mcp-cluster",
        "-e", "GITHUB_TOKEN=${env:GITHUB_TOKEN}",
        "-e", "GITHUB_DYNAMIC_TOOLSETS=1",
        "-v", "github-mcp-cache:/cache/github",
        "-v", "github-mcp-data:/app/data",
        "ghcr.io/github/github-mcp-server:latest",
        "stdio"
      ],
      "env": {
        "GITHUB_TOKEN": "${input:github-token}"
      }
    },
    "memory": {
      "type": "stdio",
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "--name", "memory-mcp",
        "--network", "mcp-cluster",
        "-v", "memory-data:/memory",
        "-v", "memory-node-cache:/cache/node",
        "-v", "memory-cache:/cache/memory",
        "mcp-memory:latest"
      ]
    }
  }
  ```
- [ ] Add input configuration for GitHub token:
  ```json
  "inputs": [
    {
      "id": "github-token",
      "type": "promptString",
      "description": "GitHub Personal Access Token",
      "password": true
    }
  ]
  ```

### 5.2 Remove MCP Servers from docker-compose.mcp.yml

**File**: `.devcontainer/docker-compose.mcp.yml`

**Checklist**:
- [ ] REMOVE filesystem service (now in devcontainer.json stdio)
- [ ] REMOVE git service (now in devcontainer.json stdio)
- [ ] REMOVE fetch service (now in devcontainer.json stdio)
- [ ] REMOVE github service from compose (now in devcontainer.json stdio, uses official image)
- [ ] REMOVE memory service (now in devcontainer.json stdio)
- [ ] KEEP postgres-mcp service (MariaDB MCP server, still in compose)
- [ ] KEEP mariadb-mcp service (still in compose for database operations)
- [ ] KEEP python-experimental service (R&D container, not stdio)

---

## Phase 6: Docker Compose Refactoring

### 6.1 Update docker-compose.mcp.yml Structure

**File**: `.devcontainer/docker-compose.mcp.yml`

**Current Services**: 11 (github, postgres-db, mariadb, filesystem, postgres-mcp, mariadb-mcp, memory, git, fetch, python-experimental, k8s-plugin, devcontainer)  
**Target Services**: 9 (postgres-db, mariadb, postgres-mcp, mariadb-mcp, python-experimental, k8s-plugin, buildkit, runner, devcontainer) + TBC stack (3)

**Checklist**:
- [ ] Update header comment:
  ```yaml
  # Docker Compose MCP Cluster - Infrastructure Services Only
  # MCP stdio servers (filesystem, git, fetch, github, memory) configured in devcontainer.json
  # Single command: docker-compose -f .devcontainer/docker-compose.mcp.yml up --build
  # Tier 1: Databases → Tier 2: MCP DB Services → Tier 3: Tools → Tier 4: DevContainer
  ```
- [ ] Update env_file paths: `- .devcontainer/devcontainer.env` (remove `../` prefix)
- [ ] Update service build contexts: `context: ./containers/{service}` and `dockerfile: Dockerfile`

### 6.2 Add BuildKit Service

**Checklist**:
- [ ] Add buildkit service:
  ```yaml
  buildkit:
    image: moby/buildkit:latest
    container_name: buildkit-daemon
    hostname: buildkit
    privileged: true
    ports:
      - "1234:1234"
    networks:
      mcp-cluster:
        ipv4_address: 172.20.0.55
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - buildkit-cache:/var/lib/buildkit
      - buildkit-tmp:/tmp
    environment:
      - BUILDKIT_STEP_LOG_MAX_SIZE=10485760
    command:
      - --addr
      - tcp://0.0.0.0:1234
      - --oci-worker-gc=true
      - --oci-worker-gc-keepstorage=5000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "buildctl", "debug", "info"]
      interval: 30s
      timeout: 10s
      retries: 3
  ```
- [ ] Add named volumes:
  ```yaml
  volumes:
    buildkit-cache:
      name: buildkit-cache
    buildkit-tmp:
      name: buildkit-tmp
  ```

### 6.3 Add GitHub Runner Service

**Checklist**:
- [ ] Add runner service:
  ```yaml
  runner:
    image: myoung34/github-runner:latest
    container_name: github-actions-runner
    hostname: gh-runner-01
    privileged: true
    networks:
      mcp-cluster:
        ipv4_address: 172.20.0.56
    volumes:
      - runner-work:/work
      - runner-cache:/.cache
      - /var/run/docker.sock:/var/run/docker.sock
    env_file:
      - .devcontainer/devcontainer.env
    environment:
      - ACCESS_TOKEN=${GITHUB_TOKEN}
      - REPO_URL=https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}
      - RUNNER_NAME=docker-runner-01
      - RUNNER_WORKDIR=/work
      - LABELS=docker,linux,x64,self-hosted
      - EPHEMERAL=true
      - START_DOCKER_SERVICE=true
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "pgrep", "Runner.Listener"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
  ```
- [ ] Add named volumes:
  ```yaml
  volumes:
    runner-work:
      name: runner-work
    runner-cache:
      name: runner-cache
  ```
- [ ] Update devcontainer.env with GitHub runner variables:
  ```env
  GITHUB_REPO_OWNER=DeanLuus22021994
  GITHUB_REPO_NAME=react-scuba
  ```

### 6.4 Add TBC Monitoring Stack

**Checklist**:
- [ ] Add nginx service:
  ```yaml
  nginx:
    image: nginx:alpine
    container_name: tbc-nginx
    hostname: nginx
    ports:
      - "80:80"
      - "443:443"
    networks:
      mcp-cluster:
        ipv4_address: 172.20.0.70
    volumes:
      - ./containers/TBC/config/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./containers/TBC/config/ssl:/etc/nginx/ssl:ro
    env_file:
      - .devcontainer/devcontainer.env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
  ```
- [ ] Add prometheus service:
  ```yaml
  prometheus:
    image: prom/prometheus:latest
    container_name: tbc-prometheus
    hostname: prometheus
    ports:
      - "9090:9090"
    networks:
      mcp-cluster:
        ipv4_address: 172.20.0.71
    volumes:
      - ./containers/TBC/config/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    env_file:
      - .devcontainer/devcontainer.env
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=15d'
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:9090/-/healthy"]
      interval: 30s
      timeout: 10s
      retries: 3
  ```
- [ ] Add grafana service:
  ```yaml
  grafana:
    image: grafana/grafana:latest
    container_name: tbc-grafana
    hostname: grafana
    ports:
      - "3000:3000"
    networks:
      mcp-cluster:
        ipv4_address: 172.20.0.72
    volumes:
      - grafana-data:/var/lib/grafana
      - ./containers/TBC/config/grafana:/etc/grafana/provisioning:ro
    env_file:
      - .devcontainer/devcontainer.env
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD:-admin}
      - GF_INSTALL_PLUGINS=grafana-clock-panel
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
  ```
- [ ] Add named volumes:
  ```yaml
  volumes:
    prometheus-data:
      name: prometheus-data
    grafana-data:
      name: grafana-data
  ```
- [ ] Update devcontainer.env:
  ```env
  GRAFANA_ADMIN_PASSWORD=admin
  NGINX_IP=172.20.0.70
  PROMETHEUS_IP=172.20.0.71
  GRAFANA_IP=172.20.0.72
  ```

### 6.5 Configure k8s-plugin GPU Passthrough

**Checklist**:
- [ ] Update k8s-plugin service with GPU configuration:
  ```yaml
  k8s-plugin:
    build:
      context: ./containers/k8s-plugin
      dockerfile: Dockerfile
    image: mcp-k8s-plugin:latest
    container_name: k8s-plugin
    hostname: k8s-plugin
    networks:
      mcp-cluster:
        ipv4_address: 172.20.0.50
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=compute,utility
    volumes:
      - k8s-config:/root/.kube
      - k8s-cache:/cache/k8s
    env_file:
      - .devcontainer/devcontainer.env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "nvidia-smi"]
      interval: 30s
      timeout: 10s
      retries: 3
  ```
- [ ] Update devcontainer.env:
  ```env
  K8S_PLUGIN_IP=172.20.0.50
  ```
- [ ] Update k8s-plugin README.md with GPU passthrough documentation

### 6.6 Update Network Static IPs

**Checklist**:
- [ ] Update devcontainer.env with new IP assignments:
  ```env
  # Static IP Assignments
  POSTGRES_DB_IP=172.20.0.20
  MARIADB_IP=172.20.0.21
  POSTGRES_MCP_IP=172.20.0.31
  MARIADB_MCP_IP=172.20.0.32
  PYTHON_EXPERIMENTAL_IP=172.20.0.40
  K8S_PLUGIN_IP=172.20.0.50
  BUILDKIT_IP=172.20.0.55
  RUNNER_IP=172.20.0.56
  DEVCONTAINER_IP=172.20.0.60
  NGINX_IP=172.20.0.70
  PROMETHEUS_IP=172.20.0.71
  GRAFANA_IP=172.20.0.72
  ```
- [ ] Remove old MCP server IPs:
  ```env
  # REMOVE (now stdio-based):
  # GITHUB_MCP_IP=172.20.0.10
  # FILESYSTEM_MCP_IP=172.20.0.30
  # MEMORY_MCP_IP=172.20.0.33
  # GIT_MCP_IP=172.20.0.34
  # FETCH_MCP_IP=172.20.0.35
  ```

### 6.7 Update Volume Definitions

**Checklist**:
- [ ] Remove volumes for stdio MCP servers:
  ```yaml
  # REMOVE (now in devcontainer.json stdio):
  # filesystem-node-cache:
  # memory-data:
  # memory-node-cache:
  # memory-cache:
  # git-cache:
  # git-pip-cache:
  # git-python-cache:
  # fetch-cache:
  # fetch-pip-cache:
  # fetch-python-cache:
  # fetch-http-cache:
  # github-mcp-cache:
  # github-mcp-data:
  ```
- [ ] Keep volumes referenced in devcontainer.json (mounted via docker run -v)
- [ ] Add new container volumes:
  ```yaml
  buildkit-cache:
    name: buildkit-cache
  buildkit-tmp:
    name: buildkit-tmp
  runner-work:
    name: runner-work
  runner-cache:
    name: runner-cache
  prometheus-data:
    name: prometheus-data
  grafana-data:
    name: grafana-data
  ```

---

## Phase 7: Build Automation Script

### 7.1 Create build-mcp.ps1

**File**: `.devcontainer/scripts/build-mcp.ps1`

**Checklist**:
- [ ] Create PowerShell script with functions:
  - `Build-MCPServer` - Build MCP stdio server images
  - `Build-Container` - Build infrastructure container images
  - `Start-BuildKit` - Start BuildKit daemon
  - `Register-Runner` - Register GitHub Actions runner
  - `Deploy-Monitoring` - Deploy TBC monitoring stack
- [ ] Support parameters:
  - `-ServerName <name>` - Build specific server
  - `-ContainerName <name>` - Build specific container
  - `-All` - Build everything
  - `-NoCacheParam` - Force rebuild
  - `-Parallel` - Parallel builds
  - `-PullBase` - Pull base images first
- [ ] Add color output functions (Write-Success, Write-Info, Write-Warning, Write-Error)
- [ ] Add build summary reporting
- [ ] Add BuildKit cache management commands
- [ ] Add health check verification
- [ ] Add volume inspection commands

### 7.2 Script Implementation Details

**Checklist**:
- [ ] Check Docker daemon running
- [ ] Enable Docker BuildKit: `$env:DOCKER_BUILDKIT = "1"`
- [ ] Build MCP stdio servers (filesystem, git, fetch, memory) with tags
- [ ] Pull official GitHub server: `docker pull ghcr.io/github/github-mcp-server:latest`
- [ ] Build containers (k8s-plugin, mariadb, postgres, python-experimental, buildx, runner)
- [ ] Start BuildKit daemon if not running
- [ ] Register GitHub runner with `${GITHUB_TOKEN}` and `${REPO_URL}`
- [ ] Deploy TBC stack with docker-compose
- [ ] Create prometheus/grafana config files
- [ ] Verify all services healthy
- [ ] Display connection information (ports, IPs, endpoints)

---

## Phase 8: Documentation Updates

### 8.1 Architecture Documentation

**Files**: `.devcontainer/docs/architecture/*.md`

**Checklist**:
- [ ] Create `mcp-stdio.md` (<100 lines):
  - VS Code MCP server configuration pattern
  - stdio transport vs docker-compose services
  - Command/args structure
  - Volume mounting strategy
  - Environment variable passing
  - Trust prompts and security
- [ ] Create `gpu-passthrough.md` (<100 lines):
  - k8s-plugin GPU configuration
  - deploy.resources.reservations.devices syntax
  - NVIDIA runtime environment variables
  - Health check with nvidia-smi
  - Why only k8s-plugin gets GPU
  - Prerequisites (nvidia-docker2, NVIDIA Container Toolkit)
- [ ] Create `orchestration.md` (<100 lines):
  - Docker compose cluster architecture
  - 4-tier dependency chain
  - Static IP networking (172.20.0.0/16)
  - Named volume persistence
  - Health check strategy
  - Service restart policies
- [ ] Create `python-freethreading.md` (<100 lines):
  - Python 3.14.0 free-threaded overview
  - PEP 703 GIL-disabled benefits
  - PYTHON_GIL=0 environment variable
  - Verification: `sys._is_gil_enabled()`
  - Performance considerations
  - Compatibility notes

### 8.2 Services Documentation

**Files**: `.devcontainer/docs/services/*.md`

**Checklist**:
- [ ] Create `monitoring.md` (<100 lines):
  - TBC monitoring stack overview
  - Sidecar pattern architecture
  - nginx reverse proxy configuration
  - Prometheus scrape configs for all services
  - Grafana dashboards
  - Ports: 80/443 (nginx), 9090 (prometheus), 3000 (grafana)
  - IPs: 172.20.0.70-72
  - Total footprint: ~625MB images + data
- [ ] Create `containers-reference.md` (<100 lines):
  - buildx: BuildKit daemon (port 1234, privileged)
  - runner: GitHub Actions runner (ephemeral, Docker-in-Docker)
  - k8s-plugin: Kubernetes plugin with GPU passthrough
  - mariadb: MySQL-compatible database
  - postgres: PostgreSQL database
  - python-experimental: Python 3.15.0a1 free-threaded R&D
  - All with IPs, ports, volumes, health checks
- [ ] Create `mcp-servers-reference.md` (<100 lines):
  - filesystem: File operations (read-only workspace)
  - git: Git operations (clone, commit, push, pull, diff)
  - fetch: Web content fetching (HTTP/2, robots.txt compliance)
  - github: GitHub API operations (repos, issues, PRs, actions)
  - memory: Knowledge graph storage (4GB heap, NVMe-optimized)
  - All configured in devcontainer.json with stdio transport
- [ ] Update `services-reference.md`:
  - Split existing content into separate files
  - Keep under 100 lines (summary only)
  - Link to detailed docs in architecture/ and services/

### 8.3 Setup Documentation

**Files**: `.devcontainer/docs/setup/*.md`

**Checklist**:
- [ ] Create `mcp-configuration.md` (<100 lines):
  - Step-by-step devcontainer.json MCP configuration
  - GitHub token setup (PAT with scopes: repo, read:org, read:user)
  - VS Code trust prompts
  - Testing MCP servers in Copilot Chat
  - Troubleshooting stdio connection issues
- [ ] Create `gpu-setup.md` (<100 lines):
  - NVIDIA Driver installation
  - nvidia-docker2 installation
  - NVIDIA Container Toolkit setup
  - Verification: `docker run --rm --gpus all nvidia/cuda:12.9.0-base nvidia-smi`
  - k8s-plugin specific configuration
- [ ] Create `build-process.md` (<100 lines):
  - Running build-mcp.ps1 script
  - Build options (-All, -Parallel, -NoCacheParam)
  - First build: ~5 minutes
  - Subsequent builds: ~10 seconds (BuildKit cache)
  - Troubleshooting build failures
- [ ] Create `quick-start.md` (<100 lines):
  - Prerequisites checklist
  - One-command setup: `.devcontainer/scripts/build-mcp.ps1 -All`
  - Verify services: `docker-compose ps`
  - Test MCP servers in Copilot Chat
  - Access monitoring: http://localhost (nginx), http://localhost:9090 (prometheus), http://localhost:3000 (grafana)

### 8.4 Update Main README

**File**: `.devcontainer/docs/README.md`

**Checklist**:
- [ ] Update with new folder structure
- [ ] Link to architecture docs
- [ ] Link to services reference
- [ ] Link to setup guides
- [ ] Update quick start section
- [ ] Update troubleshooting section
- [ ] Add GPU passthrough notes
- [ ] Add monitoring stack overview
- [ ] Keep under 100 lines (summary only)

---

## Phase 9: Environment Variables

### 9.1 Update devcontainer.env

**File**: `.devcontainer/devcontainer.env`

**Checklist**:
- [ ] Add BuildKit variables:
  ```env
  # BUILDKIT CONFIGURATION
  BUILDKIT_HOST=tcp://buildkit:1234
  BUILDKIT_STEP_LOG_MAX_SIZE=10485760
  BUILDKIT_IP=172.20.0.55
  ```
- [ ] Add GitHub Runner variables:
  ```env
  # GITHUB ACTIONS RUNNER
  GITHUB_REPO_OWNER=DeanLuus22021994
  GITHUB_REPO_NAME=react-scuba
  RUNNER_NAME=docker-runner-01
  RUNNER_WORKDIR=/work
  RUNNER_LABELS=docker,linux,x64,self-hosted
  EPHEMERAL=true
  RUNNER_IP=172.20.0.56
  ```
- [ ] Add TBC Monitoring variables:
  ```env
  # TBC MONITORING STACK
  GRAFANA_ADMIN_PASSWORD=admin
  NGINX_IP=172.20.0.70
  PROMETHEUS_IP=172.20.0.71
  GRAFANA_IP=172.20.0.72
  PROMETHEUS_RETENTION=15d
  ```
- [ ] Add GPU variables:
  ```env
  # NVIDIA GPU CONFIGURATION (k8s-plugin only)
  NVIDIA_VISIBLE_DEVICES=all
  NVIDIA_DRIVER_CAPABILITIES=compute,utility
  ```
- [ ] Update Python experimental variables:
  ```env
  # PYTHON EXPERIMENTAL (3.15.0a1 free-threaded)
  PYTHON_VERSION=3.15.0a1
  PYTHON_GIL=0
  PYTHONPROFILEIMPORTTIME=1
  PYTHON_EXPERIMENTAL_IP=172.20.0.40
  ```
- [ ] Remove stdio MCP server IPs:
  ```env
  # REMOVE (now stdio-based in devcontainer.json):
  # GITHUB_MCP_IP=172.20.0.10
  # FILESYSTEM_MCP_IP=172.20.0.30
  # MEMORY_MCP_IP=172.20.0.33
  # GIT_MCP_IP=172.20.0.34
  # FETCH_MCP_IP=172.20.0.35
  ```

---

## Phase 10: Testing & Verification

### 10.1 Build Verification

**Checklist**:
- [ ] Run build script: `.devcontainer/scripts/build-mcp.ps1 -All`
- [ ] Verify all images built successfully:
  ```powershell
  docker images | Select-String "mcp-"
  docker images | Select-String "tbc-"
  ```
- [ ] Check BuildKit cache usage: `docker buildx du`
- [ ] Verify no build errors in logs

### 10.2 Service Health Checks

**Checklist**:
- [ ] Start all services: `docker-compose -f .devcontainer/docker-compose.mcp.yml up -d`
- [ ] Verify all services healthy:
  ```powershell
  docker-compose -f .devcontainer/docker-compose.mcp.yml ps
  ```
- [ ] Check individual health:
  - [ ] postgres-db: `docker exec postgres-db pg_isready`
  - [ ] mariadb: `docker exec mariadb mysqladmin ping`
  - [ ] buildkit: `docker exec buildkit-daemon buildctl debug info`
  - [ ] runner: `docker exec github-actions-runner pgrep Runner.Listener`
  - [ ] k8s-plugin: `docker exec k8s-plugin nvidia-smi`
  - [ ] nginx: `curl http://localhost/health`
  - [ ] prometheus: `curl http://localhost:9090/-/healthy`
  - [ ] grafana: `curl http://localhost:3000/api/health`

### 10.3 MCP Server stdio Verification

**Checklist**:
- [ ] Open VS Code in devcontainer
- [ ] Check Copilot Chat MCP servers connected
- [ ] Test filesystem server: `@workspace List files in src/`
- [ ] Test git server: `@workspace Show git log`
- [ ] Test fetch server: `@workspace Fetch https://example.com`
- [ ] Test github server: `@workspace Show my GitHub repos` (requires GITHUB_TOKEN)
- [ ] Test memory server: `@workspace Store knowledge: test data`
- [ ] Verify no stdio connection errors in VS Code output

### 10.4 Network Connectivity

**Checklist**:
- [ ] Verify mcp-cluster network exists: `docker network inspect mcp-cluster`
- [ ] Check static IP assignments:
  ```powershell
  docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -q)
  ```
- [ ] Test service-to-service communication:
  - [ ] DevContainer → postgres: `psql -h 172.20.0.20 -U postgres`
  - [ ] DevContainer → mariadb: `mysql -h 172.20.0.21 -u root`
  - [ ] DevContainer → prometheus: `curl http://172.20.0.71:9090/-/healthy`
  - [ ] DevContainer → buildkit: `buildctl --addr tcp://172.20.0.55:1234 debug info`

### 10.5 Volume Persistence

**Checklist**:
- [ ] Check named volumes exist:
  ```powershell
  docker volume ls | Select-String "mcp|buildkit|runner|prometheus|grafana"
  ```
- [ ] Verify volume sizes:
  ```powershell
  docker system df -v | Select-String "mcp|buildkit|runner|prometheus|grafana"
  ```
- [ ] Test data persistence:
  - [ ] Create test data in postgres
  - [ ] Restart container: `docker-compose restart postgres-db`
  - [ ] Verify data persists

### 10.6 GPU Passthrough Verification

**Checklist**:
- [ ] Check NVIDIA runtime: `docker run --rm --gpus all nvidia/cuda:12.9.0-base nvidia-smi`
- [ ] Verify k8s-plugin GPU access: `docker exec k8s-plugin nvidia-smi`
- [ ] Verify other containers NO GPU access:
  ```powershell
  docker exec devcontainer nvidia-smi  # Should fail
  docker exec postgres-db nvidia-smi  # Should fail
  ```
- [ ] Check GPU memory allocation in k8s-plugin

### 10.7 Monitoring Stack Verification

**Checklist**:
- [ ] Access nginx: http://localhost
- [ ] Access prometheus: http://localhost:9090
  - [ ] Check targets: http://localhost:9090/targets
  - [ ] Verify all services scraped
- [ ] Access grafana: http://localhost:3000
  - [ ] Login: admin / ${GRAFANA_ADMIN_PASSWORD}
  - [ ] Add Prometheus datasource
  - [ ] Import Docker dashboard
- [ ] Check nginx reverse proxy routes to prometheus/grafana

### 10.8 Python Free-Threading Verification

**Checklist**:
- [ ] Open devcontainer terminal
- [ ] Run verification:
  ```python
  python3 -c "import sys; print(f'Python {sys.version}'); print(f'GIL Enabled: {sys._is_gil_enabled()}')"
  ```
- [ ] Expected output:
  ```
  Python 3.14.0 (main, ...)
  GIL Enabled: False
  ```
- [ ] Check environment: `echo $PYTHON_GIL` (should be `0`)
- [ ] Test multi-threading performance

### 10.9 Integration Testing

**Checklist**:
- [ ] Full workflow test:
  1. [ ] Open VS Code in devcontainer
  2. [ ] Build project: `npm install && npm run build`
  3. [ ] Run tests: `npm test`
  4. [ ] Use MCP servers in Copilot Chat
  5. [ ] Commit changes (test git MCP server)
  6. [ ] Push to GitHub (test GitHub runner)
  7. [ ] Check monitoring dashboards
  8. [ ] Verify GPU usage in k8s-plugin
- [ ] Stress test:
  - [ ] Multiple parallel MCP server requests
  - [ ] Heavy database queries
  - [ ] BuildKit parallel builds
  - [ ] GitHub runner multiple jobs
  - [ ] Monitor resource usage

---

## Phase 11: Cleanup & Documentation

### 11.1 Remove Old Files

**Checklist**:
- [ ] Verify all files moved from .github/services/
- [ ] Delete .github/services/ folder (if empty)
- [ ] Delete old .devcontainer/devcontainer.dockerfile.backup
- [ ] Delete old .devcontainer/devcontainer.minimal.dockerfile
- [ ] Clean up temporary build files
- [ ] Remove unused Docker images: `docker image prune -a`
- [ ] Remove unused volumes: `docker volume prune`

### 11.2 Final Documentation Review

**Checklist**:
- [ ] Verify all README.md files under 100 lines
- [ ] Check all documentation links work
- [ ] Verify code examples are correct
- [ ] Update changelog with all changes
- [ ] Add screenshots to monitoring.md
- [ ] Add architecture diagrams

### 11.3 Git Commit Strategy

**Checklist**:
- [ ] Commit Phase 1: Folder reorganization
  - `git add .devcontainer/mcp/ .devcontainer/containers/`
  - `git commit -m "refactor: reorganize MCP servers and containers into .devcontainer structure"`
- [ ] Commit Phase 2: Python 3.14 base image
  - `git add .devcontainer/Dockerfile .devcontainer/devcontainer.json`
  - `git commit -m "feat: upgrade to Python 3.14.0 free-threaded base image"`
- [ ] Commit Phase 3: MCP stdio configuration
  - `git add .devcontainer/devcontainer.json`
  - `git commit -m "feat: configure MCP servers with stdio transport in devcontainer.json"`
- [ ] Commit Phase 4: Docker compose refactoring
  - `git add .devcontainer/docker-compose.mcp.yml .devcontainer/devcontainer.env`
  - `git commit -m "refactor: update docker-compose for infrastructure services only"`
- [ ] Commit Phase 5: New containers (buildx, runner, TBC)
  - `git add .devcontainer/containers/buildx/ .devcontainer/containers/runner/ .devcontainer/containers/TBC/`
  - `git commit -m "feat: add BuildKit daemon, GitHub runner, and TBC monitoring stack"`
- [ ] Commit Phase 6: GPU passthrough
  - `git add .devcontainer/docker-compose.mcp.yml .devcontainer/containers/k8s-plugin/`
  - `git commit -m "feat: configure NVIDIA GPU passthrough for k8s-plugin"`
- [ ] Commit Phase 7: Build automation
  - `git add .devcontainer/scripts/build-mcp.ps1`
  - `git commit -m "feat: add build automation script for MCP cluster"`
- [ ] Commit Phase 8: Documentation updates
  - `git add .devcontainer/docs/`
  - `git commit -m "docs: update architecture and services documentation"`
- [ ] Commit Phase 9: Cleanup
  - `git rm -r .github/services/`
  - `git commit -m "chore: remove old MCP server files from .github"`

---

## Phase 12: Performance Validation

### 12.1 Build Performance

**Checklist**:
- [ ] Measure first build time (cold start):
  - [ ] Record: `______` minutes
  - [ ] Expected: ~5 minutes
- [ ] Measure subsequent build time (BuildKit cache):
  - [ ] Record: `______` seconds
  - [ ] Expected: ~10 seconds
- [ ] Measure parallel build time:
  - [ ] Record: `______` seconds
  - [ ] Expected: ~90 seconds
- [ ] Check BuildKit cache hit rate: `docker buildx du`

### 12.2 Runtime Performance

**Checklist**:
- [ ] Measure container startup times:
  - [ ] postgres-db: `______` seconds
  - [ ] mariadb: `______` seconds
  - [ ] buildkit: `______` seconds
  - [ ] k8s-plugin: `______` seconds (with GPU)
  - [ ] TBC stack: `______` seconds
- [ ] Measure MCP server stdio response times:
  - [ ] filesystem: `______` ms
  - [ ] git: `______` ms
  - [ ] fetch: `______` ms
  - [ ] github: `______` ms
  - [ ] memory: `______` ms
- [ ] Check resource usage:
  - [ ] Total CPU: `______`%
  - [ ] Total RAM: `______` MB
  - [ ] Total disk: `______` GB

### 12.3 Network Performance

**Checklist**:
- [ ] Measure service-to-service latency:
  - [ ] DevContainer → postgres: `______` ms
  - [ ] DevContainer → mariadb: `______` ms
  - [ ] DevContainer → prometheus: `______` ms
- [ ] Test HTTP/2 fetch server performance:
  - [ ] Single request: `______` ms
  - [ ] 10 parallel requests: `______` ms
- [ ] Check nginx reverse proxy overhead

---

## Success Criteria

### Overall Completion Checklist

- [ ] All MCP servers (filesystem, git, fetch, github, memory) configured with stdio transport in devcontainer.json
- [ ] All infrastructure containers (k8s-plugin, mariadb, postgres, python-experimental, buildx, runner, TBC) in docker-compose
- [ ] Python 3.14.0 free-threaded base devcontainer verified with `sys._is_gil_enabled() == False`
- [ ] NVIDIA GPU passthrough working for k8s-plugin only (verified with `nvidia-smi`)
- [ ] TBC monitoring stack (nginx + prometheus + grafana) operational and accessible
- [ ] BuildKit daemon operational with client connection working
- [ ] GitHub Actions runner registered and ephemeral mode working
- [ ] All services healthy and passing health checks
- [ ] MCP servers responding via stdio in VS Code Copilot Chat
- [ ] Static IP networking (172.20.0.0/16) configured correctly
- [ ] Named volumes persisting data across container restarts
- [ ] Build automation script (build-mcp.ps1) functional
- [ ] Documentation updated and under 100 lines per file
- [ ] First build ~5 minutes, subsequent builds ~10 seconds (BuildKit cache)
- [ ] No errors in docker-compose logs
- [ ] All old files cleaned up from .github/

### Performance Targets

- [ ] Build time (cold): ≤ 5 minutes
- [ ] Build time (cached): ≤ 10 seconds
- [ ] MCP stdio response time: ≤ 500ms
- [ ] Service startup time: ≤ 30 seconds
- [ ] Total memory usage: ≤ 8GB
- [ ] GPU accessible only in k8s-plugin

### Quality Targets

- [ ] All README.md files ≤ 100 lines (SRP)
- [ ] All Dockerfiles use BuildKit cache mounts
- [ ] All services have health checks
- [ ] All volumes have proper permissions
- [ ] All environment variables in devcontainer.env
- [ ] No hardcoded secrets in Dockerfiles
- [ ] All services use restart: unless-stopped

---

## Risk Assessment & Mitigation

### High-Risk Items

1. **Python 3.14 Free-Threading Compatibility**
   - Risk: Third-party packages may not support GIL-disabled mode
   - Mitigation: Test critical dependencies, maintain fallback to Python 3.14 with GIL
   - Validation: Run test suite in free-threaded mode

2. **GPU Passthrough Configuration**
   - Risk: NVIDIA runtime not configured correctly, other containers gain GPU access
   - Mitigation: Verify `deploy.resources.reservations.devices` syntax, test GPU isolation
   - Validation: Run `nvidia-smi` in each container

3. **MCP stdio Transport Reliability**
   - Risk: stdio connection failures, timeout issues
   - Mitigation: Implement retry logic, proper error handling
   - Validation: Stress test with multiple parallel requests

4. **Volume Persistence Across Architecture Change**
   - Risk: Data loss when moving from docker-compose services to stdio
   - Mitigation: Backup volumes before migration, verify data after
   - Validation: Test data persistence with container restarts

### Medium-Risk Items

1. **BuildKit Privileged Mode Security**
   - Risk: Security exposure from privileged container
   - Mitigation: Restrict BuildKit to internal network, monitor access logs
   - Validation: Review Docker security best practices

2. **GitHub Runner Ephemeral Token Management**
   - Risk: Token expiration, registration failures
   - Mitigation: Use GitHub App authentication instead of PAT
   - Validation: Monitor runner registration logs

3. **Monitoring Stack Resource Usage**
   - Risk: Prometheus/Grafana consuming excessive resources
   - Mitigation: Set retention policies, implement resource limits
   - Validation: Monitor resource usage over time

### Low-Risk Items

1. **Documentation Completeness**
   - Risk: Missing details in split documentation
   - Mitigation: Regular documentation review, user feedback
   - Validation: Documentation testing by fresh users

2. **Network IP Conflicts**
   - Risk: Static IP conflicts with existing services
   - Mitigation: Use isolated subnet (172.20.0.0/16)
   - Validation: Network inspection after deployment

---

## Next Steps After Completion

1. **Performance Optimization**
   - [ ] Profile Python free-threading performance gains
   - [ ] Optimize BuildKit cache strategies
   - [ ] Tune monitoring stack resource usage
   - [ ] Implement lazy loading for MCP servers

2. **Feature Enhancements**
   - [ ] Add more MCP servers (database MCP servers, custom tooling)
   - [ ] Implement MCP server health monitoring in prometheus
   - [ ] Add custom Grafana dashboards for MCP metrics
   - [ ] Implement automatic GitHub runner scaling

3. **Security Hardening**
   - [ ] Implement Docker secrets for sensitive data
   - [ ] Add network policies for service isolation
   - [ ] Implement MCP server authentication
   - [ ] Add audit logging for privileged containers

4. **Documentation Expansion**
   - [ ] Add video tutorials
   - [ ] Create troubleshooting decision trees
   - [ ] Add architecture diagrams (Mermaid)
   - [ ] Write blog post on Python free-threading benefits

---

**Last Updated**: October 27, 2025  
**Status**: Ready for Implementation - Awaiting User Approval  
**Estimated Completion**: 2-3 days for full implementation and testing  
**Maintainer**: React Scuba Team

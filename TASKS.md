# React Scuba - Infrastructure Tasks

> **Next Iteration Focus**: Docker Compose MCP Cluster Infrastructure Stabilization
> **Target**: Enterprise-ready cluster deployment for multi-tenant platform
> **Date**: October 28, 2025

## 🚨 Critical Issues (Blocking Cluster Startup)

### Port Binding Conflicts

- [ ] **PORT-001**: Fix port 8081 double-bind conflict

  - **Issue**: `cadvisor` service (line 268) and `nginx-slave-1` (line 754) both bind to host port 8081
  - **Impact**: Docker Compose fails with "bind: Only one usage of each socket address" error
  - **Resolution**: Remap nginx-slave-1 to port 8101, update load balancer configuration
  - **Files**: `docker-compose.yml`, `.devcontainer/containers/gateway/config/nginx.conf`

- [ ] **NET-001**: Resolve static IP address collisions in mcp-cluster network
  - **Issue**: Multiple services assigned 172.28.0.70-72 (prometheus/nginx-slave-1: .71, grafana/nginx-slave-2: .72)
  - **Impact**: Network layer conflicts preventing service discovery
  - **Resolution**: Implement tier-based IP allocation strategy
  - **Files**: `docker-compose.yml` network configuration

## 🔧 Architecture Conflicts

### Dual Service Implementations

- [ ] **ARCH-001**: Resolve competing nginx architectures

  - **Legacy**: `tbc-nginx` (172.28.0.70, ports 80/443)
  - **New**: `nginx-master` (172.28.0.70, ports 80/8080) + slaves
  - **Decision Required**: Remove legacy or implement port segregation
  - **Dependencies**: Monitoring stack (Prometheus/Grafana) integration

- [ ] **ARCH-002**: Consolidate monitoring stack deployment
  - **Current**: Standalone Prometheus (9090) + Grafana (3000) + exporters
  - **Target**: Integrated with nginx load balancer tier
  - **Impact**: Service discovery and metrics collection consistency

## 📋 Infrastructure Optimization

### Port Strategy Reorganization

- [ ] **PORT-002**: Implement tier-based port allocation

  ```text
  Tier 1 - Databases:        5432 (postgres), 3306 (mariadb)
  Tier 2 - MCP Services:     7000-7099 range
  Tier 3 - GPU/AI:           9400-9499 range
  Tier 4 - Monitoring:       9000-9199 range
  Tier 5 - Network Layer:    8000-8099 range (nginx-master: 8080)
  Tier 6 - Network Slaves:   8100-8199 range (slave-1: 8101, slave-2: 8102)
  Tier 7 - Object Storage:   5540 (redisinsight), 11211 (memcached)
  Tier 8 - Bootstrap:        5174 (node-bootstrap)
  ```

### Service Dependencies

- [ ] **DEP-001**: Validate 8-tier startup sequence

  - **Current Issue**: Some services start before dependencies are healthy
  - **Required**: Proper `depends_on` with `condition: service_healthy`
  - **Critical Path**: postgres-db → postgres-mcp → nvidia-device-plugin → ollama-llm

- [ ] **DEP-002**: Review commented services activation strategy

  ```yaml
  # Commented Services Requiring Decision:
  - python-experimental (3.15.0a1)
  - k8s-plugin (GPU-dependent)
  - react-app-dev (development container)
  - devcontainer (main development environment)
  ```

## 🔬 GPU & AI Services

### NVIDIA Runtime Configuration

- [ ] **GPU-001**: Validate NVIDIA device plugin configuration

  - **Current**: nvidia-device-plugin service enabled (port 9400)
  - **Issue**: GPU allocation for ollama-llm service dependency
  - **Testing**: Verify RTX 3050 6GB VRAM detection and allocation

- [ ] **GPU-002**: Optimize LLM service resource limits
  - **Models**: smollm2:latest (1.7GB), codegeex4:9b-all-q3_K_M (5.1GB)
  - **Constraint**: Must fit in 6GB VRAM to avoid CPU/RAM offload
  - **Health Check**: Validate model loading within start_period: 120s

## 🛡️ Security & Network Isolation

### Network Segmentation

- [ ] **SEC-001**: Validate mcp-cluster network security
  - **Current**: Bridge network with static IPs (172.28.0.0/16)
  - **Review**: Service-to-service communication restrictions
  - **External**: Only required services expose host ports

### Service Hardening

- [ ] **SEC-002**: Review privileged container requirements
  - **cadvisor**: privileged: true (container metrics)
  - **buildkit**: privileged: true (Docker socket access)
  - **nvidia-device-plugin**: privileged: true (GPU access)

## 📊 Monitoring & Observability

### Metrics Collection

- [ ] **MON-001**: Integrate exporters with Prometheus discovery
  - **Services**: cadvisor (8081→8082), node-exporter (9100), postgres-exporter (9187), mysql-exporter (9104)
  - **Config**: Update Prometheus scrape targets after port remapping

### Health Checks Optimization

- [ ] **MON-002**: Review health check intervals and timeouts
  - **Issue**: Some services have aggressive 5s intervals
  - **Optimization**: Tier-based health check strategies (DB: 10s, MCP: 15s, GPU: 30s)

## ✅ Validation Checklist

### Pre-Deployment Tests

- [ ] **TEST-001**: Port availability scan (netstat validation)
- [ ] **TEST-002**: Static IP allocation verification
- [ ] **TEST-003**: Service dependency tree validation
- [ ] **TEST-004**: GPU device accessibility test
- [ ] **TEST-005**: Full cluster startup sequence (25+ services)

### Success Criteria

- [ ] All services start without port/network conflicts
- [ ] Health checks pass for all enabled services
- [ ] Service discovery working between tiers
- [ ] GPU allocation functional for AI services
- [ ] Monitoring stack collecting metrics from all exporters

## 📋 Implementation Order

1. **Phase 1**: Critical port conflicts (PORT-001, NET-001)
2. **Phase 2**: Architecture decisions (ARCH-001, ARCH-002)
3. **Phase 3**: Port strategy implementation (PORT-002)
4. **Phase 4**: Service dependencies (DEP-001, DEP-002)
5. **Phase 5**: GPU services validation (GPU-001, GPU-002)
6. **Phase 6**: Security review (SEC-001, SEC-002)
7. **Phase 7**: Monitoring integration (MON-001, MON-002)
8. **Phase 8**: Full validation testing (TEST-001 through TEST-005)

---

## 📈 Previous Iterations Completed

### ✅ Spec-Driven Documentation Framework

- [x] JSON schema validation system (`specs/` directory)
- [x] Architecture, multi-tenant, and bleeding-edge specifications
- [x] Automated validation via `specs/validators/validate.js`
- [x] npm workspace scripts for CI/CD automation

### ✅ Development Environment Optimization

- [x] VS Code Biome LSP configuration fixes (absolute binary path)
- [x] Extension conflicts resolution (removed duplicates)
- [x] Terminal environment post-reload validation
- [x] DevContainer infrastructure setup (`.devcontainer/` with k8s manifests)

### ✅ Platform Modernization

- [x] React 19.2.0 + Vite 7.1.12 + JavaScript ES2020+ modern stack
- [x] npm workspaces monorepo with 7 workspace packages
- [x] Biome 2.3.1 Rust-based linting and formatting
- [x] Multi-tenant architecture with clean documentation naming

---

**Status**: Ready for infrastructure stabilization iteration
**Next Sprint Goal**: Fully operational Docker Compose MCP cluster for enterprise deployment

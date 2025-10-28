# TODO - Modern Data Platform Implementation

**Created:** October 28, 2025
**Status:** Infrastructure & Monitoring Implementation Phase
**Architecture:** Layer-Based with Unified Monitoring
**Frontend:** ✅ Bleeding-Edge React Platform Complete (Archived Documentation Available)
**Current Success Rate:** 15/19 services (78%)

## ✅ **COMPLETED MODERNIZATION (See Archive for Details)**

**React Frontend Modernization**: ✅ **COMPLETE** - All bleeding-edge updates implemented

- React 19.2.0, Vite 7.1.12, TypeScript 5.9.4 deployed successfully
- Build performance: 16.80s fresh / 427ms cached builds (FULL TURBO)
- Zero TypeScript errors/warnings, modern module resolution
- Auto-accept VS Code workflow, 32GB TypeScript language server
- Multi-tenant SaaS architecture production-ready
- **Documentation**: See `BLEEDING_EDGE_MODERNIZATION_COMPLETE.md` and `docs/archive/modernization/`

**Focus**: TODO.md now contains ONLY outstanding infrastructure and Docker deployment tasks

---

## 🎯 **OUTSTANDING INFRASTRUCTURE TASKS**

> **Note**: Frontend React modernization is 100% complete. All tasks below focus on Docker infrastructure, monitoring, and production deployment setup.

## 🎯 MODERN DATA PLATFORM - PRIORITY IMPLEMENTATION

### Phase 1: Enable All Exporters (CRITICAL - 2 hours) ✅ 75% COMPLETE

**Goal:** Activate comprehensive metrics collection across all 9 layers

**Actions:**

- [x] **Uncomment cadvisor** in docker-compose.yml (line ~255-290) ✅ WORKING - port 8081
- [x] **Uncomment node-exporter** in docker-compose.yml (line ~292-327) ✅ WORKING - port 9100
- [x] **Uncomment postgres-exporter** in docker-compose.yml (line ~329-360) ✅ WORKING - port 9187
- [ ] **Fix mysql-exporter** configuration issue (DATA_SOURCE_NAME parsing error)
- [ ] **Create memcached-exporter** Dockerfile and service
- [ ] **Create dcgm-exporter** for GPU metrics (NVIDIA DCGM)
- [ ] **Add nginx-prometheus-exporter** to nginx-master Dockerfile

**Status:** 3/4 existing exporters enabled and responding. Services running: 17/19 (89%)

**Verification:**

```powershell
# Check all exporters are running ✅ DONE
docker compose ps | Select-String "exporter"
# Result: cadvisor (8081), node-exporter (9100), postgres-exporter (9187), mysql-exporter (crash loop - needs fix)

# Test exporter endpoints ✅ DONE
curl http://localhost:8081/metrics  # ✅ 253KB response
curl http://localhost:9100/metrics  # ✅ 138KB response
curl http://localhost:9187/metrics  # ✅ 80KB response
curl http://localhost:9104/metrics  # ❌ Connection refused (mysql-exporter config issue)

# Verify Prometheus can scrape all targets
curl http://localhost:9090/api/v1/targets
# TODO: Wait for Prometheus to stabilize and verify scrape config
```

---

### Phase 2: Create 9 Layer-Specific Grafana Dashboards (HIGH - 6 hours)

**Goal:** Build comprehensive monitoring dashboards organized by functional layer

**Dashboard Specifications:**

1. **Frontend Build & Deploy Health** (Overview folder)

   - Build success rate, duration, cache hits
   - npm install times, runner status
   - Recent build logs

2. **Database Health & Query Metrics** (Database Layer folder)

   - Connection pools (PG + MariaDB)
   - Query rates, slow queries, cache hit ratio
   - Replication lag, table sizes

3. **Node & Container Metrics** (Service Layer folder)

   - CPU/Memory usage per container (cAdvisor)
   - Host metrics (node_exporter)
   - Network throughput, disk I/O

4. **Pipeline Throughput & Processing Health** (MCP Layer folder)

   - Document processing rate
   - Transformation success/failure ratio
   - Pipeline lag, queue depth

5. **Network & API Gateway Metrics** (Network Layer folder)

   - Request rate, latency (p50, p95, p99)
   - Error rates (4xx, 5xx)
   - Upstream health (nginx slaves)

6. **Service Performance & Compute** (Service Layer folder)

   - Ollama inference latency, tokens/sec
   - OTEL traces, error rates
   - BuildKit cache efficiency

7. **Cache & Object Storage Overview** (Object Layer folder)

   - Memcached hit/miss rate
   - Redis memory usage
   - MinIO storage usage per bucket

8. **GPU Health & Utilization** (GPU Layer folder)

   - GPU utilization %, memory usage
   - Temperature, power consumption
   - Ollama inference correlation

9. **Cluster Overview** (Overview folder)
   - Cluster health score
   - Services up by layer
   - Total request rate, error rate
   - Recent alerts

**Actions:**

- [ ] Create dashboard JSON templates for all 9 dashboards
- [ ] Place JSON files in `/var/lib/grafana/dashboards/<folder>/`
- [ ] Configure dashboard provisioning in Grafana
- [ ] Restart Grafana: `docker compose restart grafana`
- [ ] Verify all dashboards load without errors

---

### Phase 3: Implement React Frontend Integration (HIGH - 12 hours)

**Goal:** Build dynamic monitoring UI with real-time Prometheus/Grafana integration

**React Components to Build:**

```typescript
// Core monitoring components
server/apps/web/src/components/dashboards/
├── BuildHealthDashboard.tsx      // CI/CD metrics
├── DatabaseMetrics.tsx           // DB connections, queries
├── PipelineMetrics.tsx           // MCP processing
├── NetworkMetrics.tsx            // Nginx request rates
├── ServiceMetrics.tsx            // OTEL traces, uptime
├── CacheMetrics.tsx              // Memcached/Redis stats
├── GPUMetrics.tsx                // GPU utilization
└── ClusterOverview.tsx           // Unified health view
```

**Hooks to Implement:**

```typescript
// server/apps/web/src/hooks/
├── usePrometheus.ts              // Query Prometheus API
├── useGrafana.ts                 // Embed Grafana dashboards
└── useMetrics.ts                 // Real-time metric streaming
```

**Actions:**

- [ ] Set up Prometheus API service layer
- [ ] Implement `usePrometheus` hook with query caching
- [ ] Create reusable chart components (LineChart, Gauge, Heatmap)
- [ ] Build all 8 dashboard page components
- [ ] Add routing for dashboard navigation
- [ ] Test real-time data updates (15s refresh)

---

### Phase 4: Create Vanilla JS Static Status Pages (MEDIUM - 2 hours)

**Goal:** Lightweight monitoring pages with zero build dependencies

**Pages to Create:**

```text
server/apps/web/public/static/
├── index.html              # Main status grid
├── build-status.html       # CI/CD health
├── service-health.html     # Service up/down
├── cache-stats.html        # Cache hit rates
└── js/
    └── metrics.js          # Shared Prometheus fetch utilities
```

**Actions:**

- [ ] Create HTML pages with inline CSS
- [ ] Implement `metrics.js` with Prometheus query functions
- [ ] Add auto-refresh (5-10 second intervals)
- [ ] Test pages load in <100ms
- [ ] Verify metrics display correctly

---

### Phase 5: Add OpenTelemetry to Services (MEDIUM - 4 hours)

**Goal:** Distributed tracing for Node.js, Python, and Ollama services

**Services to Instrument:**

- [ ] **Node.js services**: Add OTEL SDK with Prometheus exporter (port 9464)
- [ ] **Python services**: Add OTEL Python SDK
- [ ] **Ollama**: Configure inference metrics export
- [ ] **MCP pipelines**: Add custom metrics (throughput, lag)

**Example OTEL Setup (Node.js):**

```javascript
// server/apps/web/otel-config.js
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { PrometheusExporter } = require("@opentelemetry/exporter-prometheus");

const sdk = new NodeSDK({
  metricReader: new PrometheusExporter({ port: 9464 }),
});

sdk.start();
```

**Actions:**

- [ ] Install OTEL packages in all service Dockerfiles
- [ ] Add metrics endpoints (port 9464 for Node, 9200 for Python)
- [ ] Update Prometheus scrape config with OTEL targets
- [ ] Test metrics collection: `curl http://localhost:9464/metrics`

---

## 🚨 ORIGINAL CRITICAL TASKS (Must Complete ASAP)

### 1. Resolve Port Conflicts

**Priority:** P0 - Blocking 3 critical services
**Issue:** Legacy `nginx` service (container: `tbc-nginx`) occupies ports 80, 443
**Impact:** Prevents `nginx-master`, `prometheus`, `grafana` from starting

**Actions:**

- [ ] Remove legacy nginx service from docker-compose.yml (search for `container_name: tbc-nginx`)
- [ ] OR rename legacy service to different ports if still needed
- [ ] Restart cluster: `docker compose down && docker compose up -d`
- [ ] Verify nginx-master starts successfully on ports 80, 443, 8080
- [ ] Verify prometheus starts on port 9090
- [ ] Verify grafana starts on port 3000

**Verification:**

```powershell
docker compose ps | Select-String "nginx-master|prometheus|grafana"
curl http://localhost
curl http://localhost:9090
curl http://localhost:3000
```

---

### 2. Complete Gateway Layer Deployment

**Priority:** P0 - Monitoring infrastructure missing
**Dependencies:** Requires #1 (port conflicts) resolved first

**Actions:**

- [ ] Verify Prometheus config has all layer-grouped scrape targets
- [ ] Verify Grafana dashboards organized into 6 folders (overview, service-layer, object-layer, database-layer, network-layer, gpu-layer)
- [ ] Test Prometheus scraping all 15+ targets
- [ ] Import/verify Grafana cluster overview dashboard
- [ ] Configure data retention: Prometheus (15 days), Grafana (persistent)

**Verification:**

```powershell
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets | ConvertFrom-Json | Select-Object -ExpandProperty data | Select-Object -ExpandProperty activeTargets | Measure-Object

# Check Grafana health
curl http://localhost:3000/api/health
```

---

### 3. Fix Memcached Health Check

**Priority:** P1 - Service reports unhealthy but may be functional
**Current Status:** Container running, health check failing

**Actions:**

- [ ] Test health check command manually: `docker exec memcached sh -c "echo stats | nc localhost 11211"`
- [ ] If command fails, update dockerfile.object.memcached health check
- [ ] Alternative health check: `CMD memcached -h || exit 1`
- [ ] Rebuild and redeploy: `docker compose up -d --build memcached`
- [ ] Monitor for 60 seconds, verify healthy status

**Verification:**

```powershell
docker compose ps memcached
docker exec memcached sh -c "echo stats | nc localhost 11211 | head -5"
```

---

## 🔧 HIGH PRIORITY (Complete This Week)

### 4. Add Missing Exporters

**Priority:** P1 - Required for complete monitoring coverage

**Actions:**

- [ ] Create `dockerfile.exporter.postgres` (if not exists, verify naming)
- [ ] Create `dockerfile.exporter.mysql` (if not exists, verify naming)
- [ ] Add services to docker-compose.yml:
  - `postgres-exporter` (port 9187)
  - `mysql-exporter` (port 9104)
- [ ] Update Prometheus scrape config to include new exporters
- [ ] Deploy: `docker compose up -d postgres-exporter mysql-exporter`
- [ ] Verify metrics: `curl http://localhost:9187/metrics` and `curl http://localhost:9104/metrics`

---

### 5. Deploy cAdvisor for Container Metrics

**Priority:** P1 - Essential for resource monitoring

**Actions:**

- [ ] Verify `dockerfile.exporter.cadvisor` exists
- [ ] Add cadvisor service to docker-compose.yml (port 8080 or 9338)
- [ ] Configure volume mounts: `/`, `/var/run/docker.sock`, `/sys`, `/var/lib/docker`
- [ ] Add to Prometheus scrape config (service layer)
- [ ] Deploy: `docker compose up -d cadvisor`
- [ ] Create Grafana dashboard for container metrics

---

### 6. Implement Nginx Load Balancer Testing

**Priority:** P1 - Validate new architecture

**Actions:**

- [ ] Test round-robin: Send 10 requests to nginx-master, verify distribution

  ```powershell
  1..10 | ForEach-Object { curl http://localhost/ }
  ```

- [ ] Check nginx-master logs: `docker logs nginx-master | Select-String "backend_slaves"`
- [ ] Test failover: Stop slave-1, verify traffic routes to slave-2

  ```powershell
  docker stop nginx-slave-1
  curl http://localhost/  # Should still work
  docker start nginx-slave-1
  ```

- [ ] Benchmark throughput: Use `ab` or `wrk` to test concurrent requests
- [ ] Document load balancer behavior in `docs/deployment/load-balancing.md`

---

### 7. Configure Log Rotation

**Priority:** P1 - Prevent disk space exhaustion

**Actions:**

- [ ] Create logrotate config for nginx volumes:
  - `react_scuba_nginx-logs`
  - `react_scuba_nginx-slave1-logs`
  - `react_scuba_nginx-slave2-logs`
- [ ] Set rotation policy: Daily, keep 7 days, compress old logs
- [ ] Add size limit: 100MB per log file
- [ ] Test rotation: `docker exec nginx-master logrotate -f /etc/logrotate.conf`
- [ ] Add cron job or systemd timer for automatic rotation

**Example logrotate config:**

```text
/var/log/nginx/*.log {
    daily
    rotate 7
    size 100M
    compress
    delaycompress
    missingok
    notifempty
}
```

---

## 📊 MEDIUM PRIORITY (Complete This Month)

### 8. Implement Layer-Based Grafana Dashboards

**Priority:** P2 - Enhance observability

**Actions:**

- [ ] Create 6 dashboard JSON templates (one per layer)
- [ ] **Overview Dashboard:**
  - Cluster health score
  - Services up/down by layer
  - Total CPU/memory usage
  - Network throughput
- [ ] **Database Layer Dashboard:**
  - Connection pools (PG, MariaDB)
  - Query rates, slow queries
  - Replication lag (if configured)
- [ ] **Object Layer Dashboard:**
  - Memcached hit/miss rates
  - Cache evictions
  - Redis (if added) memory usage
  - MinIO storage capacity
- [ ] **Service Layer Dashboard:**
  - Container CPU/memory (cAdvisor)
  - Ollama LLM inference latency
  - Node builder npm install times
- [ ] **Network Layer Dashboard:**
  - Nginx requests/sec by slave
  - Upstream health status
  - Error rates (4xx, 5xx)
  - Load balancer response times
- [ ] **GPU Layer Dashboard:**
  - GPU utilization %
  - GPU memory used/total
  - Temperature
  - Ollama model inference metrics

**Implementation:**

```powershell
# Copy dashboard templates
cp .devcontainer/containers/grafana-dashboards/*.json /path/to/grafana/provisioning/dashboards/

# Restart Grafana to load new dashboards
docker compose restart grafana
```

---

### 9. Optimize Volume Usage

**Priority:** P2 - Reduce disk space waste

**Current State:** 23 named volumes + 1 bind mount

**Actions:**

- [ ] **Consolidate redundant caches:**
  - Merge `postgres-cache` + `postgres-node-cache` → `postgres-mcp-cache`
  - Merge `mariadb-cache` + `mariadb-node-cache` → `mariadb-mcp-cache`
- [ ] **Review low-utilization volumes:**
  - `markitdown-cache`: Monitor usage for 1 week, remove if <10MB
  - `node-bootstrap-cache`: Verify no overlap with `node-builder-npm`
- [ ] **Implement volume size monitoring:**
  - Weekly cron: `docker system df -v > /var/log/docker-volumes.log`
  - Alert if any volume >80% of expected max size
- [ ] **Add volume size limits** (if supported by driver):
  - nginx logs: 500MB max
  - prometheus data: 10GB max
  - grafana data: 1GB max

---

### 10. Resource Limits Refinement

**Priority:** P2 - Prevent resource contention

**Actions:**

- [ ] Add memory limits to ollama-llm: 2GB (currently unlimited)
- [ ] Add CPU limits to buildkit-daemon: 0.5 cores
- [ ] Review github-runner: May need 1GB memory for large repos
- [ ] Test under load: Run benchmark, verify no OOM kills
- [ ] Document resource allocation in `INFRASTRUCTURE_METRICS.md`

**Update docker-compose.yml:**

```yaml
ollama-llm:
  deploy:
    resources:
      limits:
        cpus: "2.0"
        memory: 2048M
      reservations:
        memory: 1024M
```

---

### 11. Health Check Optimization

**Priority:** P2 - Reduce false positives

**Actions:**

- [ ] Increase `start_period` for ollama-llm to 60s (model loading)
- [ ] Add `retries: 5` to redisinsight health check
- [ ] Implement exponential backoff for dependent services
- [ ] Add health check to markitdown-mcp: `CMD python3 -c "import markitdown"`
- [ ] Test health checks under simulated failures

---

### 12. Security Hardening

**Priority:** P2 - Production readiness

**Actions:**

- [ ] **Secrets Management:**
  - Move database passwords to Docker secrets
  - Rotate all default passwords
  - Use environment-specific .env files (dev, staging, prod)
- [ ] **Network Security:**
  - Enable internal-only network for database layer
  - Expose only necessary ports to host
  - Consider Traefik reverse proxy with Let's Encrypt
- [ ] **Image Scanning:**
  - Run Trivy on all custom images: `trivy image react-scuba-node:latest`
  - Fix HIGH/CRITICAL vulnerabilities
  - Automate scanning in CI/CD pipeline
- [ ] **Container Security:**
  - Run all services as non-root users (verify)
  - Add security-opt: `no-new-privileges:true`
  - Enable AppArmor/SELinux profiles

---

## 🎯 LONG-TERM (Next Quarter)

### 13. High Availability Implementation

**Priority:** P3 - Production-grade reliability

**Actions:**

- [ ] Implement keepalived for nginx-master failover
- [ ] Add 3rd nginx slave for better redundancy
- [ ] Configure Prometheus clustering (Thanos or Cortex)
- [ ] Add database replication (PostgreSQL streaming, MariaDB Galera)
- [ ] Test disaster recovery: Simulate node failures

---

### 14. Distributed Tracing

**Priority:** P3 - Advanced observability

**Actions:**

- [ ] Deploy Jaeger or Tempo
- [ ] Instrument Node.js services with OpenTelemetry
- [ ] Add trace IDs to logs for correlation
- [ ] Create service dependency map in Grafana

---

### 15. CI/CD Pipeline Enhancement

**Priority:** P3 - Automation

**Actions:**

- [ ] Create GitHub Actions workflow for automated testing
- [ ] Add Dockerfile linting (hadolint)
- [ ] Implement automated image scanning
- [ ] Add smoke tests after deployment
- [ ] Configure auto-rollback on health check failures

---

## 📝 DOCUMENTATION (Ongoing)

### 16. Architecture Documentation

- [ ] Create architecture diagram (all layers with data flow)
- [ ] Document port allocation strategy
- [ ] Write runbooks for common operations:
  - Adding new services
  - Scaling nginx slaves
  - Database backup/restore
  - GPU troubleshooting
- [ ] Create troubleshooting guide with common errors

---

### 17. Performance Baselines

- [ ] Benchmark Ollama inference time (tokens/sec)
- [ ] Measure npm install time with/without cache
- [ ] Test load balancer throughput (requests/sec)
- [ ] Document baseline metrics for regression testing

---

## ✅ COMPLETED

### **Infrastructure Tasks (Docker/Monitoring)**

- [x] Created 6 new Dockerfiles (markitdown, nginx-master, nginx-slave, memcached, redisinsight, node-bootstrap)
- [x] Renamed 4 Dockerfiles to layer-based naming convention
- [x] Enhanced Grafana with 6-layer folder structure
- [x] Enhanced Prometheus with layer-grouped scrape configs
- [x] Deployed 15 services successfully
- [x] Fixed CRLF issues in heredoc scripts
- [x] Resolved node-bootstrap user/build conflicts
- [x] Created INFRASTRUCTURE_METRICS.md report
- [x] Tested full stack down/up cycle

### **Frontend Modernization (Complete - See Archive)**

- [x] ✅ **React 19.2.0 + Vite 7.1.12 + TypeScript 5.9.4 bleeding-edge stack**
- [x] ✅ **Zero TypeScript compilation errors/warnings (ESNext target)**
- [x] ✅ **Build optimization: 16.80s fresh / 427ms cached (FULL TURBO)**
- [x] ✅ **Auto-accept VS Code workflow + 32GB TypeScript language server**
- [x] ✅ **Multi-tenant SaaS architecture with type-safe configuration**
- [x] ✅ **Bundle optimization: 70%+ compression with intelligent code splitting**
- [x] ✅ **Production deployment ready with modern toolchain**
- [x] ✅ **Complete documentation archive in `docs/archive/modernization/`**

---

## 🎓 INDUSTRY STANDARD RECOMMENDATIONS

Based on CNCF, DevOps, and SRE best practices:

1. **Observability (Three Pillars)**

   - ✅ Metrics: Prometheus implemented
   - ⚠️ Logs: Needs centralized aggregation (Loki)
   - ❌ Traces: Not implemented (add Jaeger/Tempo)

2. **Infrastructure as Code**

   - ✅ Dockerfiles follow multi-stage builds
   - ✅ docker-compose.yml for orchestration
   - ⏳ Consider Kubernetes for production scale
   - ⏳ Terraform for cloud infrastructure

3. **Security**

   - ✅ Non-root users in containers
   - ⚠️ Secrets in .env files (move to vault)
   - ❌ No image scanning pipeline
   - ❌ No mutual TLS between services

4. **Reliability**

   - ✅ Health checks on all services
   - ⚠️ No automatic restart policies tested
   - ❌ No chaos engineering/failure injection
   - ❌ No SLOs/SLIs defined

5. **Performance**

   - ✅ Volume caching for fast rebuilds
   - ✅ Resource limits defined
   - ⏳ Need load testing baseline
   - ⏳ Need performance budgets

6. **Maintainability**
   - ✅ Clear naming conventions
   - ✅ Layer-based organization
   - ⏳ Need comprehensive documentation
   - ⏳ Need automated testing

---

**Priority Legend:**

- **P0:** Blocking - must fix immediately
- **P1:** High - complete within 1 week
- **P2:** Medium - complete within 1 month
- **P3:** Low - complete within 3 months

**Status Legend:**

- ✅ Complete
- ⏳ In Progress
- ❌ Not Started
- ⚠️ Blocked/Issues

---

---

## 📚 **MODERNIZATION DOCUMENTATION REFERENCES**

### **Active Documentation (Current State)**

- `BLEEDING_EDGE_MODERNIZATION_COMPLETE.md` - Primary status and technical achievements
- `MULTI_TENANT_ARCHITECTURE.md` - Current multi-tenant SaaS architecture
- `MULTI_INDUSTRY_SUPPORT.md` - Platform capabilities and industry support
- `DEVELOPMENT.md` - Current development setup guide

### **Archived Documentation (Completed Tasks)**

- `docs/archive/modernization/ARCHIVE_INDEX.md` - Complete modernization timeline
- `docs/archive/modernization/status/` - Historical completion milestones
- `docs/archive/modernization/implementation/` - Multi-tenant implementation details
- `docs/archive/modernization/infrastructure/` - Infrastructure evolution and metrics

### **Context**

- **Frontend/TypeScript/Build**: 100% complete, fully documented in archive
- **Docker Infrastructure**: In progress, tracked in this TODO.md
- **Monitoring Platform**: High priority, requires Docker infrastructure completion first

---

**Last Updated:** October 28, 2025
**Next Review:** Weekly until P0/P1 complete, then monthly
**Modernization Status**: ✅ Frontend Complete | ⏳ Infrastructure In Progress

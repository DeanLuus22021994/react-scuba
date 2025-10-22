---
started: 2025-10-22
completed: 2025-10-22
author: AI Assistant
version: 1.0
status: active
description: Load-balanced cluster configuration with multiple nginx web servers
tags: [docker, compose, cluster, load-balancer, nginx]
---

# [CLUSTER-EXAMPLE-001](#cluster-example-001) Cluster Example

## [`UAT-2025-10-22T21:33:19Z`](#uat-2025-10-22t21-33-19z) User Acceptance Testing - 2025-10-22T21:33:19Z ✅ PASSED

### Test Results Summary

- **Configuration Validation**: ✅ PASSED - Docker Compose config validated successfully
- **Service Deployment**: ✅ PASSED - All 7 services deployed successfully (loadbalancer, db, node, python, web1, web2, web3)
- **Load Balancing**: ✅ PASSED - Nginx load balancer distributing traffic on port 8080
- **Health Checks**: ✅ PASSED - All services healthy with proper dependency management
- **API Endpoints**: ✅ PASSED - FastAPI server with correlation logging fully functional
- **Database Connectivity**: ✅ PASSED - PostgreSQL accepting connections on port 5432
- **React Application**: ✅ PASSED - Node.js development server running on port 3000
- **Web Servers**: ✅ PASSED - Three nginx web servers serving static content
- **Volume Management**: ✅ PASSED - Named volumes created and mounted correctly
- **Network Configuration**: ✅ PASSED - Cluster network bridge established successfully

### Service Status Details

| Service | Status | Health | Ports | Key Validation |
|---------|--------|--------|-------|----------------|
| **loadbalancer** | ✅ Running | Healthy | 8080 | Nginx proxy with upstream routing |
| **db** | ✅ Running | Healthy | 5432 | `pg_isready` connection confirmed |
| **node** | ✅ Running | Healthy | 3000 | React app development server |
| **python** | ✅ Running | Healthy | 8000 | FastAPI server with correlation logging |
| **web1** | ✅ Running | Healthy | 80 | Nginx serving static content |
| **web2** | ✅ Running | Healthy | 80 | Nginx serving static content |
| **web3** | ✅ Running | Healthy | 80 | Nginx serving static content |

### Load Balancing Validation

#### Traffic Distribution Confirmed
- **Load Balancer Endpoint:** <http://localhost:8080> ✅
- **Upstream Servers:** web1, web2, web3 all healthy and accessible
- **Algorithm:** Round-robin distribution configured in nginx
- **Health Monitoring:** All web servers passing nginx health checks

#### API Endpoints Validation

##### Python FastAPI Health (`/health`)
```json
{
  "status": "ready",
  "message": "API is fully operational",
  "packages_installed": true,
  "services_ready": true,
  "python_version": "3.14.0 (main, Oct 21 2025, 02:04:49) [GCC 14.2.0]",
  "features": {
    "version": [3, 14, 0, "final", 0],
    "version_string": "3.14.0 (main, Oct 21 2025, 02:04:49) [GCC 14.2.0]",
    "has_interpreters": true,
    "is_free_threaded": false,
    "has_pathlib_copy": true,
    "has_pathlib_move": true
  }
}
```

##### React Application
- **Status:** ✅ Running on port 3000
- **Framework:** React with Vite development server
- **Features:** Hot reload, SEO optimization, responsive design

### Configuration Fixes Applied

1. **Volume Reference:** Fixed `python_venv` to `react_scuba_python_venv` in loadbalancer service
2. **Profile Management:** Load balancer requires `--profile dev` flag for startup
3. **Port Conflicts:** Resolved by stopping basic-stack before deployment
4. **Dependency Timing:** Load balancer waits for all upstream services to be healthy

### Test Environment

- **Docker Engine**: Clean deployment environment
- **Build Time**: ~160 seconds for load balancer, ~90 seconds for other services
- **Test Duration**: ~10 minutes end-to-end deployment
- **Resource Usage**: Minimal - all services healthy and responsive
- **Load Balancing**: Round-robin distribution across 3 nginx web servers

### Issues Resolved

- Volume naming inconsistency in docker-compose.yml
- Load balancer profile requirement oversight
- Port conflicts with previous stack deployment
- Service dependency timing for proper startup order

### Architecture Overview

```
Internet → Load Balancer (nginx:8080)
                     ↓
          ┌─────────┼─────────┐
          │         │         │
        Web1      Web2      Web3
       (nginx)   (nginx)   (nginx)
                     ↓
                Shared Services
            ┌─────────┼─────────┐
            │         │         │
          Node     Python      DB
        (React)  (FastAPI)  (PostgreSQL)
```

**Load Balancing:** Round-robin distribution
**Health Checks:** All services monitored
**Dependencies:** Proper startup order maintained
**Networking:** Bridge network for inter-service communication

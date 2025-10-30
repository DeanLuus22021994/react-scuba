# cAdvisor Docker Desktop Windows Limitations

## Issue

cAdvisor v0.51.0 logs "Failed to create existing container" errors when running on Docker Desktop for Windows with WSL2 backend:

```
E1030 09:31:48.384523       1 manager.go:1116] Failed to create existing container: 
/docker/02c982a52b2eac5654b487d63610c4c83ec74666f9c4a3feca1f3cc500898655: failed to 
identify the read-write layer ID for container 
"02c982a52b2eac5654b487d63610c4c83ec74666f9c4a3feca1f3cc500898655". - open 
/var/lib/docker/image/overlayfs/layerdb/mounts/02c982a52b2eac5654b487d63610c4c83ec74666f9c4a3feca1f3cc500898655/mount-id: 
no such file or directory
```

## Root Cause

Docker Desktop Windows stores container layer metadata in an internal WSL2 distribution (`docker-desktop`) that is NOT accessible via standard filesystem mounts. cAdvisor requires access to `/var/lib/docker/image/overlay2/layerdb/mounts/` to identify container filesystem layers, but this path:

1. **Does not exist** in Docker Desktop's architecture
2. **Cannot be mounted** from Windows host filesystem
3. **Is not exposed** through WSL2 path `\\wsl$\docker-desktop-data\`

This is a **fundamental architectural limitation** of Docker Desktop Windows + cAdvisor combination.

## Impact

- **CRITICAL FAILURE**: cAdvisor exports only 2 CPU metrics and 48 memory metrics (vs 500+ expected)
- **No Network Metrics**: Zero `container_network_*` metrics exported
- **No Per-Container CPU**: Only 2 total CPU metrics vs dozens per container expected
- **Monitoring Broken**: Grafana dashboards will show empty/missing data
- **Error Logs**: 34+ errors logged at startup (one per container)
- **Root Cause**: Errors ARE fatal - without layer database access, cAdvisor cannot identify containers properly

## Metrics Verification

```powershell
# CPU metrics (expected: 100+, actual: 2)
curl -s http://localhost:8082/metrics | Select-String "^container_cpu" | Measure-Object -Line

# Memory metrics (expected: 200+, actual: 48)  
curl -s http://localhost:8082/metrics | Select-String "^container_memory" | Measure-Object -Line

# Network metrics (expected: 100+, actual: 0)
curl -s http://localhost:8082/metrics | Select-String "^container_network" | Measure-Object -Line
```

**Conclusion**: cAdvisor is NOT functional on Docker Desktop Windows despite running without crashes.

## Affected Configurations

- Docker Desktop for Windows 4.x+ (all versions)
- WSL2 backend (default since Docker Desktop 2.5+)
- cAdvisor v0.49.x, v0.50.x, v0.51.x (all recent versions)

## Attempted Solutions (All Failed)

### 1. Standard Volume Mount
```yaml
volumes:
  - /var/lib/docker/:/var/lib/docker:ro
```
**Result**: Mount shows empty/stale data after `docker system prune`

### 2. Explicit Docker Root Flag
```yaml
command:
  - "--docker_root=/var/lib/docker"
```
**Result**: No effect, cAdvisor still cannot find layer metadata

### 3. Docker Desktop Restart
Restarting Docker Desktop to refresh WSL2 backend and clear mount caches.
**Result**: No effect, /var/lib/docker mount remains empty

### 4. WSL2 Custom Mount
Mount `\\wsl$\docker-desktop-data\data\docker` to custom path in WSL.
**Result**: Path does not exist in modern Docker Desktop (distributions merged)

### 5. Minimal Configuration
Remove all filesystem mounts except Docker socket, rely on cgroup access only.
**Result**: Same errors, cAdvisor hardcoded to check layer database

## Why This Cannot Be Fixed

1. **cAdvisor Code**: Layer ID lookup is hardcoded in `manager.go:1116`, not configurable
2. **Docker Desktop Architecture**: Layer metadata is internal to WSL2 VM, not exposed
3. **WSL2 Limitations**: Cannot mount Docker Desktop's internal filesystem from host
4. **No Workarounds**: All documented solutions for Linux do not apply to Windows

## Upstream Issues

- [google/cadvisor#2648](https://github.com/google/cadvisor/issues/2648) - WSL2 + Docker Desktop compatibility (open since 2020)
- [vacp2p/wakurtosis#58](https://github.com/vacp2p/wakurtosis/issues/58) - Detailed Windows troubleshooting (no solution)

**Status**: No fix planned, Docker Desktop Windows is not a supported cAdvisor platform

## Current Configuration

Our configuration (in `compose/monitoring.yml`) uses **minimal mounts** to reduce unnecessary errors:

```yaml
volumes:
  - /var/run:/var/run:ro      # Docker socket (works)
  - /sys:/sys:ro               # System info (works)
  - /dev/disk/:/dev/disk:ro    # Disk info (works)
  # REMOVED: /var/lib/docker   (does not work on Windows)
  # REMOVED: /rootfs           (not needed without /var/lib/docker)
```

This configuration:
- ✅ Collects CPU, memory, network metrics via Docker API
- ✅ Collects cgroup statistics from `/sys`
- ❌ Cannot collect filesystem layer metadata (Docker Desktop limitation)
- ⚠️  Logs 34 errors at startup (one per container, non-fatal)

## Recommendations

### For Development (Windows)
**Accept the limitation** - cAdvisor provides useful metrics despite the errors:
- Container CPU usage (per core, throttling)
- Memory usage (RSS, cache, swap)
- Network I/O (bytes, packets, errors)
- cgroup limits and usage

Error logs can be safely ignored as they don't impact functionality.

### For Production (Linux)
Deploy on Linux with native Docker Engine where cAdvisor has full filesystem access:
- All volume mounts work correctly
- Zero errors
- Complete filesystem metrics available
- Full layer database access

### Alternative for Windows
Use **Prometheus Node Exporter + Docker API** instead of cAdvisor:
- node-exporter: Host system metrics ✅ (working, zero errors)
- Docker socket: Basic container stats via Docker API
- Trade-off: Less detailed per-container metrics

## Decision

**DISABLE cAdvisor on Windows** - it provides insufficient metrics and pollutes logs:
- Only 2 CPU metrics vs 100+ expected
- Zero network metrics
- Minimal memory metrics (48 vs 200+)
- 34+ error messages at startup
- Grafana dashboards will be incomplete/broken

**Production on Linux**: cAdvisor works correctly with full metrics
- All volume mounts work
- Zero errors
- Complete container monitoring
- Full filesystem layer access

**Windows Development Alternative**:
1. Use **node-exporter** for host metrics (working perfectly, zero errors)
2. Use **Docker Desktop GUI** for basic container resource monitoring
3. Accept that per-container Prometheus metrics require Linux deployment

## Configuration Change Required

Comment out cAdvisor service in `compose/monitoring.yml`:

```yaml
# # cAdvisor - DISABLED ON WINDOWS
# # Docker Desktop WSL2 architecture incompatible with cAdvisor
# # See: cadvisor/WINDOWS_LIMITATIONS.md
# cadvisor:
#   ...service definition...
```

Prometheus configuration should remove cAdvisor scrape target on Windows or configure it to fail gracefully.

## Verification

Confirm cAdvisor is working despite errors:

```powershell
# Check error count (expected: 34+)
docker logs cadvisor 2>&1 | Select-String "Failed to create existing container" | Measure-Object -Line

# Check metrics endpoint (should return data)
curl -s http://localhost:8082/metrics | Select-String "container_cpu_usage" | Select-Object -First 3

# Check Prometheus scraping (should see cadvisor target UP)
curl -s http://localhost:9090/api/v1/targets | ConvertFrom-Json | Select-Object -ExpandProperty data | Select-Object -ExpandProperty activeTargets | Where-Object job -eq "cadvisor"
```

Expected results:
- Error count: 34-40 errors (one per container + a few system containers)
- Metrics: CPU, memory, network metrics present
- Prometheus: cAdvisor target status `UP`

## Last Updated

2025-01-30 - After exhaustive troubleshooting of all documented solutions for Docker Desktop Windows + WSL2 + cAdvisor compatibility.

<!-- markdownlint-disable-file -->

# Research: Post-Implementation Issue Resolution

**Date**: 2025-10-29
**Status**: Research Complete
**Task**: Address remaining TypeScript language server and container health issues

## Executive Summary

Critical infrastructure implementation (20251029) delivered 15/17 tasks (88%), but post-implementation review reveals:

1. **TypeScript Language Server Error** - VS Code showing import.meta error despite correct NodeNext configuration (FALSE POSITIVE)
2. **Container Health Checks** - 2/24 containers unhealthy (buildkit-daemon, redisinsight) - architectural limitations
3. **DevContainer Volume Strategy** - Deferred items documented but not blocking current development

## Issue Analysis

### Issue #1: TypeScript Language Server False Positive

**Error Display**:
```
The 'import.meta' meta-property is only allowed when the '--module' 
option is 'es2020', 'es2022', 'esnext', 'system', 'node16', 'node18',
'node20', or 'nodenext'.
```

**Current Configuration** (`.vscode/scripts/tsconfig.json`):
```json
{
  "compilerOptions": {
    "module": "NodeNext",           // ✅ CORRECT
    "moduleResolution": "NodeNext", // ✅ CORRECT
    "target": "ES2022"              // ✅ SUPPORTS import.meta
  }
}
```

**Root Cause**:
- Configuration is CORRECT
- VS Code TypeScript language server using stale configuration
- Language server needs restart after tsconfig.json changes

**Solutions** (in order of preference):

**Option A: Restart TypeScript Language Server** (RECOMMENDED)
- Command Palette: "TypeScript: Restart TS Server"
- Forces VS Code to reload tsconfig.json
- Zero code changes required

**Option B: Reload VS Code Window**
- Command Palette: "Developer: Reload Window"  
- Complete VS Code reload
- Ensures all language servers restart

**Option C: Add VS Code Task for TS Server Restart**
- Create `.vscode/tasks.json` task
- Automate server restart after config changes

### Issue #2: buildkit-daemon Health Check Failure

**Current Health Check**:
```yaml
healthcheck:
  test: test -S /run/buildkit/buildkitd.sock
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 10s
```

**Problem**:
- BuildKit configured with TCP listener: `tcp://0.0.0.0:1234`
- Health check looks for Unix socket file
- No socket file exists (not an error - by design)

**Service Status**: ✅ FUNCTIONAL (builds work correctly)

**Solutions**:

**Option A: TCP-based Health Check** (RECOMMENDED)
```yaml
healthcheck:
  test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:1234/healthz || exit 1"]
  interval: 10s
  timeout: 5s
  retries: 3
```

**Option B: BuildKit Debug Info**
```yaml
healthcheck:
  test: ["CMD", "buildctl", "debug", "info"]
  interval: 10s
  timeout: 5s
  retries: 3
```

**Option C: Remove Health Check** (acceptable for local dev)
```yaml
# No healthcheck - service monitored via container status
```

### Issue #3: redisinsight Health Check Failure

**Current Health Check**:
```yaml
healthcheck:
  test: wget -q --spider http://localhost:5540
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**Problem**:
- RedisInsight stuck on startup: "Running docker-entry.sh"
- Port 5540 never becomes available
- Service initialization loop

**Root Cause** (needs investigation):
- Possible: Missing environment variables
- Possible: Volume mount permission issues
- Possible: Database initialization failure
- Possible: Incompatible Redis version

**Solutions**:

**Option A: Extended Startup Period**
```yaml
healthcheck:
  test: wget -q --spider http://localhost:5540
  interval: 30s
  timeout: 10s
  retries: 5           # Increased from 3
  start_period: 120s   # Increased from 40s
```

**Option B: Alternative Health Check**
```yaml
healthcheck:
  test: ["CMD-SHELL", "ps aux | grep node || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 3
```

**Option C: Disable RedisInsight** (if not needed)
```yaml
# Comment out or remove redisinsight service
```

**Option D: Investigate Logs** (RECOMMENDED before changes)
```powershell
docker logs redisinsight --tail 100
docker exec -it redisinsight sh
```

## Container Health Summary

**Current Status**: 22/24 healthy (92% success rate)

**Healthy Containers** (22):
- Databases: mariadb, postgres-db
- Nginx: nginx-master, nginx-slave-1, nginx-slave-2
- Build Tools: github-runner, node-bootstrap, node-builder
- AI/ML: ollama-llm
- Infrastructure: nvidia-device-plugin
- Monitoring: prometheus, grafana, cadvisor, node-exporter, postgres-exporter, mysql-exporter
- Caching: memcached
- MCP Services: markitdown-mcp, postgres-mcp, mariadb-mcp

**Unhealthy Containers** (2):
- buildkit-daemon - Architectural limitation (TCP service, socket health check)
- redisinsight - Startup failure (needs investigation)

**No Health Check** (1):
- tbc-nginx - Intentionally no health check

## DevContainer Volume Strategy (Deferred)

**Current Status**: Deferred (service not active)

**Future Implementation Requirements**:

1. **Re-enable DevContainer service** in docker-compose.yml
2. **Add volume mounts** to `.devcontainer/devcontainer.json`:
   ```json
   "mounts": [
     "source=${localWorkspaceFolder},target=/workspaces,type=bind,consistency=cached",
     "source=react_scuba_root_node_modules,target=/workspaces/server/node_modules,type=volume",
     "source=react_scuba_web_node_modules,target=/workspaces/server/apps/web/node_modules,type=volume",
     "source=react_scuba_api_node_modules,target=/workspaces/server/apps/api/node_modules,type=volume",
     "source=react_scuba_content_node_modules,target=/workspaces/server/apps/content/node_modules,type=volume",
     "source=react_scuba_types_node_modules,target=/workspaces/server/packages/types/node_modules,type=volume",
     "source=react_scuba_ui_node_modules,target=/workspaces/server/packages/ui/node_modules,type=volume",
     "source=react_scuba_utils_node_modules,target=/workspaces/server/packages/utils/node_modules,type=volume",
     "source=react_scuba_config_node_modules,target=/workspaces/server/packages/config/node_modules,type=volume"
   ]
   ```

3. **Verification commands**:
   ```powershell
   docker volume ls | Select-String "react_scuba"
   docker exec -it <devcontainer-id> ls -la /workspaces/server/node_modules
   ```

**Decision Criteria**: Re-evaluate when:
- Team adopts container-based development
- CI/CD requires environment parity
- Build performance becomes bottleneck

## Recommended Actions

### Priority 1: Fix TypeScript Language Server (1 minute)
1. Open Command Palette (Ctrl+Shift+P)
2. Run: "TypeScript: Restart TS Server"
3. Verify error cleared in Problems panel

**Alternative**: Reload VS Code window

### Priority 2: Fix buildkit-daemon Health Check (5 minutes)
1. Update `docker-compose.yml` with TCP-based health check
2. Restart service: `docker-compose restart buildkit-daemon`
3. Verify: `docker ps` shows healthy status

### Priority 3: Investigate redisinsight Startup (15 minutes)
1. Check logs: `docker logs redisinsight --tail 100`
2. Identify startup failure cause
3. Either fix configuration or disable service if not needed

### Priority 4: DevContainer Volume Strategy (OPTIONAL)
- Document decision to defer until team needs it
- Keep current native development workflow
- Re-evaluate in Q1 2026

## Success Criteria

**Must Fix**:
- ✅ TypeScript language server error cleared
- ✅ buildkit-daemon health check fixed (23/24 healthy)

**Should Investigate**:
- ⚠️ redisinsight startup issue (logs reviewed, root cause identified)

**Can Defer**:
- ⏸️ DevContainer volume mounts (not blocking current development)

## Implementation Time

- **Priority 1**: 1 minute (TS server restart)
- **Priority 2**: 5 minutes (buildkit health check)
- **Priority 3**: 15 minutes (redisinsight investigation)
- **Total**: 21 minutes

---

**Research Completed**: 2025-10-29 22:00 UTC
**Next Step**: Create minimal plan for Priority 1 & 2 fixes

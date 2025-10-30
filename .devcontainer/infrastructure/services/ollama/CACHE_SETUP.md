# Ollama Centralized Cache Configuration

## Overview

Ollama LLM models are stored in a **centralized host directory** to:
- Enable cross-project model sharing
- Avoid repository pollution
- Reduce disk usage (models downloaded once)
- Improve rebuild speed (no re-downloads)

## Cache Location

```
C:\shared_memory\ollama-cache
```

This directory is:
- **Outside the repository** (no git pollution)
- **Persistent across container rebuilds** (bind mount)
- **Shared between projects** (centralized cache)

## Configuration

### Docker Compose (gpu.yml)
```yaml
volumes:
  - C:/shared_memory/ollama-cache:/root/.ollama/models
```

### Environment Variables
```yaml
environment:
  - OLLAMA_MODELS=/root/.ollama/models
  - OLLAMA_DEBUG=0  # Suppress verbose download logs
```

## Log Output Optimization

### Model Download Logs
- **Suppressed**: Verbose progress bars and chunk downloads
- **Visible**: Errors, failures, and completion messages
- **Implementation**: `grep -E '(error|Error|failed|Failed|success|complete)'`

### Startup Logs
```
[2025-10-30 12:34:56] Ollama service is ready.
[2025-10-30 12:34:56] Model storage: /root/.ollama/models
[2025-10-30 12:34:56] GPU mode: Required (OLLAMA_NUM_GPU=999)
[2025-10-30 12:34:56] Checking for smollm2:latest model...
[2025-10-30 12:34:56] Model already cached. Storage: C:/shared_memory/ollama-cache
[2025-10-30 12:34:56] Cache size: 1.7G (C:/shared_memory/ollama-cache)
[2025-10-30 12:34:56] Model initialization complete. Ollama ready for GPU inference.
```

## Model Storage

### Supported Models
- `smollm2:latest` (1.7GB, 100% GPU)
- `codegeex4:9b-all-q3_K_M` (5.1GB, 100% GPU)
- `mistral:latest` (7.3GB, quantized)

### Directory Structure
```
C:\shared_memory\ollama-cache\
├── blobs/
│   ├── sha256-abc123...
│   ├── sha256-def456...
│   └── ...
└── manifests/
    └── registry.ollama.ai/
        └── library/
            ├── smollm2/
            └── ...
```

## Benefits

### Before (Named Volume)
- ❌ Models stored in Docker volume
- ❌ Not accessible from host
- ❌ Separate per-project volumes
- ❌ Verbose download logs pollute startup

### After (Centralized Host Cache)
- ✅ Models stored in `C:\shared_memory\ollama-cache`
- ✅ Accessible from host filesystem
- ✅ Single shared cache for all projects
- ✅ Clean startup logs (errors still visible)

## Verification

### Check Cache Contents
```powershell
# View cache directory size
Get-ChildItem "C:\shared_memory\ollama-cache" -Recurse | Measure-Object -Property Length -Sum

# List cached models
docker exec ollama-llm ollama list
```

### Check Logs
```powershell
# View clean startup logs
docker logs ollama-llm --tail 20

# Check for errors only
docker logs ollama-llm 2>&1 | Select-String 'error|Error|failed|Failed'
```

## Maintenance

### Clear Cache (if needed)
```powershell
# WARNING: This will delete all downloaded models
Remove-Item "C:\shared_memory\ollama-cache\*" -Recurse -Force

# Or use Docker volume prune (if reverting to named volumes)
# docker volume rm react_scuba_ollama-models
```

### Re-download Models
```powershell
# Start Ollama container
docker compose up -d ollama-llm

# Models will auto-download on first startup if cache is empty
docker logs -f ollama-llm
```

## Troubleshooting

### Issue: Models Not Found
**Cause**: Cache directory doesn't exist or has wrong permissions

**Solution**:
```powershell
# Create cache directory
New-Item -ItemType Directory -Path "C:\shared_memory\ollama-cache" -Force

# Restart Ollama
docker compose restart ollama-llm
```

### Issue: Verbose Download Logs Still Appearing
**Cause**: Dockerfile not rebuilt with new grep filter

**Solution**:
```powershell
# Rebuild Ollama image
docker compose build ollama-llm

# Restart container
docker compose up -d ollama-llm
```

### Issue: Permission Denied
**Cause**: Docker Desktop doesn't have access to `C:\shared_memory`

**Solution**:
1. Open Docker Desktop
2. Settings → Resources → File Sharing
3. Add `C:\shared_memory` to shared paths
4. Apply & Restart Docker Desktop

## Related Files

- `.devcontainer/infrastructure/compose/gpu.yml` - Ollama service config
- `.devcontainer/infrastructure/services/ollama/dockerfile` - Ollama image build
- `docker-compose.yml` - Removed obsolete named volume definition

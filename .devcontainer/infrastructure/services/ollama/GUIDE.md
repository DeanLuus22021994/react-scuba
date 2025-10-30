# Ollama GPU Configuration Guide

## Hardware Specs

- **GPU**: NVIDIA GeForce RTX 3050 6GB Laptop
- **VRAM**: 6GB total, ~5GB available after driver overhead
- **RAM**: 16GB system (WSL2 gets ~4GB allocation)
- **Architecture**: CUDA 8.6, Driver 12.9

## GPU Access Method

### Direct Host GPU via Docker Compose Device Requests

- ✅ No plugin mediation required
- ✅ Native Docker GPU support in WSL2
- ✅ `deploy.resources.reservations.devices` in docker-compose.yml
- ⚠️ nvidia-device-plugin is monitoring-only (not access control)

## Critical Rule: Models MUST Fit in VRAM

### ✅ SUPPORTED MODELS (100% GPU)

| Model                     | Quantization | Size (loaded) | VRAM Used | CPU/GPU Split | Speed      | Use Case            |
| ------------------------- | ------------ | ------------- | --------- | ------------- | ---------- | ------------------- |
| `smollm2:latest`          | Q8_0         | 2.9 GB        | ~3GB      | 100% GPU      | ~18 tok/s  | Dev/Testing         |
| `codegeex4:9b-all-q3_K_M` | Q3_K_M       | ~5.0 GB       | ~5GB      | 100% GPU      | ~4.5 tok/s | Production Code Gen |

### ❌ AVOID (Causes CPU/RAM Offload)

| Model                     | Quantization | Size (loaded) | VRAM Used | CPU/GPU Split     | Issues                       |
| ------------------------- | ------------ | ------------- | --------- | ----------------- | ---------------------------- |
| `codegeex4:9b-all-q4_K_M` | Q4_K_M       | 7.5 GB        | ~5GB      | 29% CPU / 71% GPU | 2GB in RAM, CPU spikes, slow |

## Optimization Flags (docker-compose.yml)

```yaml
environment:
  # GPU Configuration
  - NVIDIA_VISIBLE_DEVICES=0 # GPU device ID
  - NVIDIA_DRIVER_CAPABILITIES=compute,utility

  # Ollama GPU Settings (prevent CPU offload)
  - OLLAMA_NUM_GPU=999 # Force all layers to GPU
  - OLLAMA_GPU_LAYERS=999 # Max GPU layers
  - OLLAMA_GPU_OVERHEAD=0 # No reserved VRAM
  - OLLAMA_FLASH_ATTENTION=1 # Enable flash attention

  # Memory Optimization
  - OLLAMA_CONTEXT_LENGTH=2048 # Reduce from 4096 to save VRAM
  - OLLAMA_MAX_LOADED_MODELS=1 # Single model at a time

  # Performance Tuning
  - OLLAMA_NUM_PARALLEL=1 # Single request processing
  - OLLAMA_MAX_QUEUE=1 # No request queuing
  - OLLAMA_SCHED_SPREAD=false # Disable load spreading
```

## How to Check GPU Usage

### 1. Check Model GPU Allocation

```bash
docker exec ollama-llm ollama ps
```

**Expected Output (Good):**

```
NAME              PROCESSOR    CONTEXT
smollm2:latest    100% GPU     2048
```

**Bad Output (Offloading to CPU):**

```
NAME                         PROCESSOR          CONTEXT
codegeex4:9b-all-q4_K_M     29%/71% CPU/GPU    2048
```

### 2. Monitor Container RAM Usage

```powershell
docker stats ollama-llm --no-stream
```

- ✅ Good: 675 MB RAM (model on GPU)
- ❌ Bad: 2+ GB RAM (model partially in RAM)

### 3. Check Host System RAM

```powershell
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5
```

### 4. Test Inference Speed

```powershell
@{model="smollm2:latest";prompt="test";stream=$false} | ConvertTo-Json |
  Out-File test.json -Encoding utf8
curl.exe -X POST http://localhost:11434/api/generate --data-binary "@test.json"
```

## Symptoms of CPU/RAM Offload

**When model doesn't fit in VRAM:**

- ❌ High RAM usage (2-3GB in container)
- ❌ High system RAM usage (90%+)
- ❌ CPU spikes during inference
- ❌ Slow token generation (<5 tok/s)
- ❌ `ollama ps` shows CPU/GPU split (e.g., "29%/71%")

**When model fits in VRAM:**

- ✅ Low RAM usage (~675MB in container)
- ✅ Low CPU usage during inference
- ✅ Fast token generation (15-20 tok/s for smollm2)
- ✅ `ollama ps` shows "100% GPU"

## Troubleshooting

### Issue: Model still offloading to CPU

**Solutions:**

1. Use smaller model (smollm2 or Q3_K_M quantization)
2. Reduce context length: `OLLAMA_CONTEXT_LENGTH=1024`
3. Restart container to clear cache
4. Check available VRAM: `docker logs ollama-llm | grep "available"`

### Issue: RAM usage still high on host

**Solutions:**

1. Close VS Code tabs (largest consumer: 2+ GB)
2. Restart Docker Desktop to clear cache
3. Reduce WSL2 memory: edit `.wslconfig`
   ```ini
   [wsl2]
   memory=8GB
   ```

### Issue: Slow inference despite 100% GPU

**Causes:**

- Context window too large
- Model quantization too low
- GPU thermal throttling

**Solutions:**

1. Reduce context: `OLLAMA_CONTEXT_LENGTH=1024`
2. Use Q3_K_M instead of Q8_0
3. Check GPU temperature

## Volume Storage (No Local Pollution)

**Architecture:**

```
Docker Volume: react_scuba_ollama-models
  ↓
/var/lib/docker/volumes/react_scuba_ollama-models/_data
  ↓
Container: /root/.ollama/models
```

**Verification:**

```powershell
# Should only show .gitignore and .copilotignore
Get-ChildItem ./data/ollama-models -Recurse -File
```

**Result:** ✅ No model blobs pollute local filesystem

## Dependency Configuration

```yaml
depends_on:
  nvidia-device-plugin:
    condition: service_started # Non-blocking start
    required: false # Optional dependency
```

**Rationale:**

- nvidia-device-plugin is for monitoring only
- Ollama accesses GPU directly via device requests
- Service can start without plugin being healthy
- Plugin provides metrics endpoint on port 9400

## Model Download Commands

```bash
# Download models inside container
docker exec ollama-llm ollama pull smollm2:latest
docker exec ollama-llm ollama pull codegeex4:9b-all-q3_K_M

# List downloaded models
docker exec ollama-llm ollama list

# Remove unused models
docker exec ollama-llm ollama rm codegeex4:9b-all-q4_K_M
```

## Benchmark Results

**smollm2:latest (100% GPU):**

- Prompt eval: 253 tokens/s
- Generation: 17.9 tokens/s
- Load time: 51ms

**codegeex4:9b-all-q3_K_M (100% GPU):**

- Generation: 4.3 tokens/s average
- Load time: ~5s first prompt
- Complex refactoring: 1,234 tokens in 285s

**codegeex4:9b-all-q4_K_M (71% GPU / 29% CPU):**

- Generation: 4.5 tokens/s
- ❌ 2GB RAM offload
- ❌ CPU spikes
- ❌ High system RAM usage

## Future Upgrades

To run Q4_K_M and larger models at 100% GPU:

- RTX 4060 8GB: Supports Q4_K_M fully
- RTX 4070 12GB: Supports larger models
- RTX 4090 24GB: Supports 70B models

---

**Last Updated:** October 28, 2025

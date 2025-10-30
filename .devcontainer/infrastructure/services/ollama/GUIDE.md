# Ollama GPU Configuration

## Hardware

- **GPU**: NVIDIA GeForce RTX 3050 6GB Laptop (~5GB available)
- **Architecture**: CUDA 8.6, Driver 12.9

## Supported Models

| Model                     | Size | Speed      | Use Case    |
| ------------------------- | ---- | ---------- | ----------- |
| `smollm2:latest`          | 3GB  | ~18 tok/s  | Dev/Testing |
| `codegeex4:9b-all-q3_K_M` | 5GB  | ~4.5 tok/s | Code Gen    |

**Rule**: Models MUST fit in 5GB VRAM. Larger models cause CPU offload and performance degradation.

## Model Cache

- **Host cache**: `C:/shared_memory/ollama-cache` (read-only mount at `/host-cache`)
- **Runtime storage**: Named volume `react_scuba_ollama-models`
- **First startup**: Copies from host cache if available, otherwise downloads
- **Subsequent startups**: Uses volume (no copy/download)

## Verification

```bash
# Check GPU allocation
docker exec ollama-llm ollama ps
# Expected: "100% GPU"

# Monitor RAM usage
docker stats ollama-llm --no-stream
# Expected: <700MB (good), >2GB (bad - CPU offload)
```

## Troubleshooting

**High RAM / CPU offload:**
- Use smaller model (`smollm2` or `q3_K_M` quantization)
- Reduce context: `OLLAMA_CONTEXT_LENGTH=1024`
- Restart container

**Slow inference:**
- Check `docker exec ollama-llm ollama ps` shows "100% GPU"
- Reduce context window
- Verify GPU temperature

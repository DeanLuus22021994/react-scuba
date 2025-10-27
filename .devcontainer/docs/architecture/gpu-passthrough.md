# GPU Passthrough Architecture

## Overview

The k8s-plugin container supports NVIDIA GPU passthrough for accelerated Kubernetes workloads, ML model inference, and CUDA-based development. GPU access is optional and gracefully degrades when unavailable.

## Architecture Components

### Host Requirements

- **NVIDIA GPU**: GeForce, Quadro, Tesla, or Datacenter series
- **Driver**: NVIDIA driver version ≥535.0 (CUDA 12+ support)
- **Docker**: Docker Engine 20.10+ with nvidia-docker2 runtime
- **OS**: Linux (native support), Windows WSL2 (experimental), macOS (not supported)

### Container Configuration

**Service**: `k8s-plugin` in `docker-compose.mcp.yml`

```yaml
k8s-plugin:
  runtime: nvidia # Requires nvidia-docker2 runtime
  environment:
    NVIDIA_VISIBLE_DEVICES: all
    NVIDIA_DRIVER_CAPABILITIES: compute,utility
```

### GPU Device Access

- **Full Access**: `NVIDIA_VISIBLE_DEVICES=all` (all GPUs)
- **Selective**: `NVIDIA_VISIBLE_DEVICES=0,1` (GPU 0 and 1)
- **Disabled**: `NVIDIA_VISIBLE_DEVICES=void` (no GPU access)

## GPU Capabilities

### compute

- CUDA compute operations
- cuDNN deep learning primitives
- TensorRT inference
- Primary use case: ML model training/inference

### utility

- nvidia-smi monitoring
- GPU topology queries
- Device diagnostics
- Required for health checks

### graphics (Not Enabled)

- OpenGL rendering
- Not needed for headless compute

## Validation Flow

```
Container Start → nvidia-smi check → GPU Available?
                                        ├─ Yes: ✅ GPU enabled
                                        └─ No: ⚠️  CPU fallback
```

### Health Check Logic

```bash
if [ ! -z "$NVIDIA_VISIBLE_DEVICES" ]; then
  nvidia-smi > /dev/null 2>&1 || exit 1  # Fail if GPU expected but unavailable
else
  echo "GPU passthrough not enabled"     # Graceful degradation
fi
```

## Use Cases

### 1. Kubernetes ML Workloads

Deploy GPU-accelerated pods:

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: gpu-test
spec:
  containers:
  - name: cuda
    image: nvidia/cuda:12.2.0-runtime-ubuntu22.04
    resources:
      limits:
        nvidia.com/gpu: 1
EOF
```

### 2. CUDA Development

Test CUDA code in k8s-plugin container:

```bash
docker exec -it k8s-plugin bash
nvidia-smi  # Verify GPU visibility
nvcc --version  # Check CUDA toolkit
```

### 3. TensorRT Inference

Run optimized model inference:

```bash
docker exec k8s-plugin trtexec --onnx=model.onnx --saveEngine=model.trt
```

## Performance Considerations

### Memory

- **GPU Memory**: Shared across all containers with GPU access
- **System Memory**: 16GB+ recommended for GPU workloads
- **VRAM Monitoring**: Use nvidia-smi for real-time VRAM usage

### Compute

- **Concurrent Contexts**: Multiple containers can access GPU simultaneously
- **MPS (Multi-Process Service)**: For improved multi-container GPU utilization
- **Compute Mode**: Default (multiple processes allowed)

### Bandwidth

- **PCIe**: Gen 3/4/5 depending on GPU and motherboard
- **NVLink**: If supported, enables multi-GPU high-speed interconnect
- **Host-Device Transfer**: Minimize data transfer between host and GPU

## Troubleshooting

### GPU Not Detected

**Symptoms**: nvidia-smi fails, health check error
**Solutions**:

1. Verify driver: `nvidia-smi` on host
2. Check Docker runtime: `docker info | grep -i nvidia`
3. Install nvidia-docker2: `apt install nvidia-docker2`
4. Restart Docker: `systemctl restart docker`

### Permission Denied

**Symptoms**: `/dev/nvidia*` access denied
**Solutions**:

1. Add user to `video` group: `usermod -aG video $USER`
2. Verify device permissions: `ls -l /dev/nvidia*`
3. Reload udev rules: `udevadm trigger`

### Out of Memory

**Symptoms**: CUDA_ERROR_OUT_OF_MEMORY
**Solutions**:

1. Reduce batch size in ML workloads
2. Enable memory growth (TensorFlow/PyTorch)
3. Monitor VRAM: `nvidia-smi dmon`
4. Limit concurrent GPU containers

### Driver Mismatch

**Symptoms**: CUDA version mismatch error
**Solutions**:

1. Update host driver: Match CUDA version in container
2. Use compatible base image: `nvidia/cuda:<version>`
3. Check compatibility: https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/

## Security Implications

### Isolation

- **No Device Isolation**: All containers with GPU access share same GPU
- **Namespace Limitations**: GPU not fully namespace-isolated
- **Privileged Access**: GPU access requires privileged capabilities

### Recommendations

- Limit GPU access to trusted containers only
- Monitor GPU usage for unauthorized workloads
- Use resource limits to prevent GPU exhaustion
- Audit GPU-enabled containers regularly

## Monitoring

```bash
# Real-time GPU utilization
watch -n 1 nvidia-smi

# GPU metrics
nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu --format=csv

# Persistent monitoring
nvidia-smi dmon -s pucvmet  # Power, Utilization, Clock, Video, Memory, Encoder, Temp
```

## Disabling GPU Passthrough

Set in `.devcontainer/.env`:

```bash
NVIDIA_VISIBLE_DEVICES=void
```

Health check will skip GPU validation, container runs in CPU-only mode.

## Future Enhancements

- Multi-Instance GPU (MIG) support for A100/H100
- GPU Operator for Kubernetes GPU management
- GPU metrics exporter for Prometheus
- Automatic GPU workload balancing

## References

- NVIDIA Container Toolkit: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/
- Docker GPU Support: https://docs.docker.com/config/containers/resource_constraints/#gpu
- Kubernetes GPU Scheduling: https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/

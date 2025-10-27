# BuildKit Daemon Container

**Purpose**: BuildKit daemon for multi-platform builds and enhanced Docker build features.

## Configuration

- **Image**: `moby/buildkit:latest`
- **Port**: 1234 (TCP)
- **IP**: 172.20.0.55
- **Privileged**: YES (required for build caching)

## Volumes

- `/var/run/docker.sock:/var/run/docker.sock` - Docker daemon socket
- `buildkit-cache:/var/lib/buildkit` - BuildKit state and cache
- `buildkit-tmp:/tmp` - Temporary build artifacts

## Environment Variables

- `BUILDKIT_STEP_LOG_MAX_SIZE=10485760` - Maximum step log size
- `BUILDKIT_HOST=tcp://buildkit:1234` - Client connection endpoint

## Health Check

```bash
buildctl debug info
```

## Client Connection

```bash
export BUILDKIT_HOST=tcp://buildkit:1234
buildctl debug info
```

## Features

- Multi-platform builds
- Advanced cache management
- Parallel build execution
- Build secrets and SSH forwarding
- Dockerfile frontend selection

## Performance

- Cache hit rate: ~90% for incremental builds
- Build time reduction: 70-90% with cache
- Memory usage: ~512MB baseline + active builds
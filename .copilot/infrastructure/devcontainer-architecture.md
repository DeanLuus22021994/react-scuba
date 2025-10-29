---
title: DevContainer Architecture Overview
source: DEVCONTAINER.md
domain: infrastructure
tags: [devcontainer, architecture, mcp, persistence, docker]
ai_hints: [sidecar pattern, volume strategy, service discovery, enterprise development]
ai_optimized: true
code_free: true
updated: 2025-10-29
---

# DevContainer Architecture Overview

## Purpose

AI-optimized reference for understanding enterprise-grade persistent MCP development environment architecture.

## Core Architectural Patterns

### Persistent Sidecar Pattern

MCP services implemented as persistent sidecars:

**Independence**: Sidecar containers run independently of main development container
**Persistence**: Sidecar survives main container rebuilds and restarts
**Isolation**: Dedicated resources and lifecycle management
**Communication**: Internal networking for service-to-service communication
**State Management**: Named volumes preserve service state across rebuilds

Benefits:
- Main container rebuilds don't affect MCP services
- Service state persists during development iterations
- Independent scaling of main and sidecar resources
- Clear separation of concerns

### Hybrid Volume Strategy

Three-tier volume approach:

**Named Volumes**: Workspace-specific dependency isolation (node_modules per app/package)
**Bind Mounts**: Source code hot reload with instant change reflection
**Container-Local**: Transient build artifacts cleared per lifecycle

Volume Purposes:
- Named volumes eliminate source tree pollution
- Bind mounts enable real-time code updates
- Container-local storage for disposable artifacts
- Workspace-specific isolation prevents dependency conflicts

### Service Discovery Architecture

Automatic service registration and health monitoring:

**Label-Based Discovery**: Docker labels identify discoverable services
**Real-Time Streaming**: WebSocket broadcasts for health updates
**Protocol Validation**: Full MCP protocol compliance checking
**Registry Integration**: Centralized service registry with metadata

Discovery Components:
- Service discovery agent monitors Docker daemon
- Health checks validate service readiness
- WebSocket streaming provides real-time updates
- HTTP API exposes service registry

## Container Architecture

### VS Code Insiders Container

Development environment container:

**Base Image**: Microsoft Dev Containers TypeScript-Node:22
**VS Code**: Insiders build with user-controlled updates
**Runtimes**: Node.js 22 LTS, Python 3.12, Docker CLI
**Shell**: Oh My Zsh with developer plugins
**Extensions**: Auto-installed development tools

Update Control:
- Pinned version prevents automatic updates
- User-initiated update mechanism
- Rollback capability for problematic updates
- Version history maintained

### Python MCP Sidecar Container

Persistent MCP service container:

**Base Image**: Python 3.14t free-threading build
**Package Manager**: UV for fast dependency resolution
**Server Framework**: FastAPI with Uvicorn ASGI server
**Protocol**: Full MCP/1.0 implementation
**Health Checks**: Continuous protocol validation

Service Characteristics:
- Runs continuously independent of main container
- Exposes internal HTTP endpoint (unpublished port 9099)
- Validates MCP protocol compliance every 15 seconds
- Restarts automatically on failure

### Service Discovery Agent Container

Monitoring and registry container:

**Runtime**: Python 3.12 with Docker SDK
**Communication**: WebSocket server for real-time streaming
**Discovery**: Automatic service detection via Docker labels
**Monitoring**: Continuous health check execution

Agent Responsibilities:
- Scan Docker daemon for labeled services
- Execute health checks on discovered services
- Broadcast health updates via WebSocket
- Maintain service registry with metadata

## Network Architecture

### MCP Cluster Network

Dedicated bridge network for MCP services:

**Subnet**: 172.28.0.0/16 custom bridge network
**Static IPs**: Services assigned predictable addresses
**Isolation**: Separate from application networks
**DNS**: Internal service discovery via container names

Service IP Allocation:
- Python MCP Sidecar: 172.28.0.99
- Discovery Agent: 172.28.0.98
- Integration with existing monitoring: .71 (Prometheus), .72 (Grafana)
- Database services: .20 (PostgreSQL), .21 (MariaDB)

### Port Management Strategy

Internal and external port mapping:

**Internal Ports**: Service-to-service communication within Docker network
**Unpublished Ports**: Services accessible only within Docker network
**Published Ports**: Exposed to host for external access (discovery agent: 9097)
**Dynamic Assignment**: Ephemeral ports for temporary services

Port Allocation:
- MCP HTTP: 9099 (internal only)
- WebSocket Health: 9097 (published)
- Reserved range: 9000-9199 for monitoring services

## Volume Architecture

### Named Volume Strategy

Workspace-specific dependency isolation:

**Root Workspace**: react_scuba_root_node_modules
**Frontend App**: react_scuba_web_node_modules
**Backend API**: react_scuba_api_node_modules
**Content Provider**: react_scuba_content_node_modules
**Documentation**: react_scuba_docs_node_modules
**Shared Packages**: Individual volumes per package (config, types, ui, utils)

Benefits:
- Complete isolation prevents dependency conflicts
- Fast container startup (no npm install needed)
- Clean source tree (no node_modules pollution)
- Independent dependency management per workspace

### MCP Service Volumes

Persistent storage for MCP services:

**Python Packages**: react_scuba_python_mcp_packages
**Service State**: react_scuba_python_mcp_state
**Python Cache**: react_scuba_python_mcp_cache
**UV Cache**: react_scuba_python_mcp_uv_cache

Persistence Characteristics:
- Survives container rebuilds and restarts
- Eliminates package reinstallation on rebuild
- Preserves service state across sessions
- Improves startup performance significantly

### Bind Mount Strategy

Real-time source code synchronization:

**Source Code**: ./server mounted to /workspace (read-write)
**Python Utils**: ./docker-compose-examples/mcp/python_utils mounted to /app (read-only)

Hot Reload Benefits:
- Instant code change reflection
- No build step for interpreted languages
- Consistent file watching across platforms
- Native IDE integration

## Lifecycle Management

### Container Lifecycle

Orchestrated startup and shutdown:

**Startup Order**: Dependencies start first, then dependent services
**Health Checks**: Services considered ready after health validation
**Graceful Shutdown**: SIGTERM for clean service termination
**Restart Policy**: Automatic restart on failure (unless-stopped)

### Configuration Profiles

Optional service activation:

**Default Profile**: Core development services only
**MCP Profile**: Activates MCP sidecar and discovery agent
**Manual Activation**: npm scripts or docker compose --profile mcp
**Auto-Start Option**: Configurable via environment variable

Profile Benefits:
- Resource conservation when MCP not needed
- Explicit opt-in for additional services
- Flexible development configurations
- Supports various workflow preferences

### Update Management

Controlled update process:

**VS Code Insiders**: User-controlled via update-control script
**Container Images**: Manual rebuild triggers
**Python Dependencies**: Preserved in named volumes
**Node Dependencies**: Cached in workspace volumes

Update Safety:
- Rollback capability for all components
- Version pinning prevents surprises
- Update logs for troubleshooting
- Backup mechanism before updates

## Integration Architecture

### Monitoring Stack Integration

Connection to existing infrastructure:

**Prometheus**: Metrics collection from MCP services
**Grafana**: Visualization of MCP health metrics
**Existing Network**: Shares mcp-cluster network with monitoring services

Integration Points:
- MCP services expose Prometheus metrics endpoint
- Service discovery feeds monitoring targets
- Health data visualized in Grafana dashboards
- Alert manager integration for failures

### VS Code Extension Integration

Development tool integration:

**GitHub Copilot**: AI pair programming assistance
**Native Language Servers**: VS Code built-in TypeScript/JavaScript validation
**Python Tools**: Pylance, Ruff for Python development
**MCP Servers**: Configured for VS Code MCP protocol support

Extension Synchronization:
- Auto-installed on container creation
- Settings synchronized from host
- Extensions configured via devcontainer.json
- Workspace-specific extension recommendations

### CI/CD Integration

Development environment portability:

**GitHub Actions**: Compatible with GitHub-hosted runners
**Docker Compose**: Identical configuration for CI and local dev
**Environment Variables**: Consistent configuration mechanism
**Build Caching**: Docker layer caching for fast builds

CI/CD Benefits:
- Identical development and CI environments
- Reproducible builds across machines
- Fast CI execution with proper caching
- Easy debugging of CI failures locally

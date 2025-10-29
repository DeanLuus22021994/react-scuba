---
title: "MCP Service Configuration"
domain: infrastructure
category: devcontainer
audience: ai-copilot
ai_hints:
  - mcp-service-architecture
  - persistent-sidecar-pattern
  - service-discovery
  - health-monitoring
related:
  - devcontainer-architecture.md
  - devcontainer-volumes.md
last_updated: 2025-10-29
---

# MCP Service Configuration

## Persistent MCP Sidecar Pattern

The MCP (Model Context Protocol) service runs as a persistent sidecar container, surviving main container rebuilds. This pattern ensures service state continuity during development.

### Service Architecture

**Container Name**: `python-mcp-sidecar`
**Base Image**: Python 3.14t (free-threading build)
**Network Assignment**: 172.28.0.99 on mcp-cluster bridge network
**Port Strategy**: Internal HTTP on 9099 (unpublished externally)
**Activation**: Profile-based (`mcp` profile) for opt-in control
**Restart Policy**: `unless-stopped` ensures survival across container lifecycle events

### Persistent State Management

Four dedicated named volumes maintain service state:
- Package storage for Python dependencies
- Service state for runtime data persistence
- Python bytecode cache for performance
- UV package manager cache for dependency resolution

All volumes prefixed with `react_scuba_python_mcp_*` for workspace isolation.

### Health Validation

**Protocol**: Full MCP protocol compliance validation
**Interval**: 15-second health check cycles
**Validation Scope**: Service availability, protocol version compatibility, connection handling

## Service Discovery Agent

**Container Name**: `mcp-discovery-agent`
**Network Assignment**: 172.28.0.98 on mcp-cluster
**Port Strategy**: 9097 for WebSocket health streaming
**Activation**: Auto-starts with MCP profile

### Discovery Capabilities

**Automatic Service Registry**: Docker label-based service detection across entire infrastructure
**Real-Time Broadcasting**: WebSocket streams for health state changes
**Protocol Compliance**: Validates MCP protocol adherence for all discovered services
**Integration Points**: Connects with Prometheus (172.28.0.71) and Grafana (172.28.0.72)

### Monitoring Integration

The discovery agent integrates with existing monitoring infrastructure without requiring reconfiguration. Services are automatically registered when they join the mcp-cluster network with appropriate labels.

## Python MCP Utilities

**Location**: `docker-compose-examples/mcp/python_utils/`

### Package Structure

Core modules organized for MCP service implementation:
- FastAPI-based MCP server
- Health checker with protocol validation
- Structured logging with context
- WebSocket real-time communication

### API Endpoints

**Root Endpoint**: Server information and capabilities
**Health Endpoint**: Protocol validation with connection status
**Info Endpoint**: Service capabilities and version
**WebSocket Endpoint**: Real-time bidirectional communication

### Dependencies

Production dependencies focus on enterprise readiness:
- FastAPI 0.115+ for modern async HTTP
- Uvicorn 0.36+ for ASGI server
- WebSockets 15.0 for real-time features
- Pydantic 2.10+ for data validation
- httpx 0.29+ for async HTTP client
- structlog 25.1+ for structured logging

## VS Code Insiders Integration

**Update Control**: User-controlled mechanism prevents automatic updates
**Version Management**: Pin, update, rollback capabilities via CLI
**Settings Integration**: Status bar integration for version visibility

### Update Control Commands

Management commands available via `vscode-update-control` script:
- Check for available updates
- Perform controlled update
- Rollback to previous version
- Pin current version

## MCP Service Lifecycle

### Activation Strategies

**Manual Activation** (Default): Start MCP service explicitly when needed via npm scripts or Docker Compose profiles

**Auto-Start** (Optional): Configure environment variable `ENABLE_MCP=true` and add services to `devcontainer.json` runServices

### Management Integration

**NPM Scripts**: Workspace-level commands for start, stop, restart, logs, health checks
**VS Code Tasks**: Command palette integration for all management operations
**Health Monitoring**: Real-time WebSocket streams and HTTP endpoint polling

## Configuration Management

### Environment Variables

**MCP Configuration**: Service port, protocol version, discovery settings
**WebSocket Configuration**: Real-time notification ports and streaming
**VS Code Configuration**: Update mechanism and version pinning

### Profile-Based Activation

The `mcp` profile controls service startup, enabling developers to opt-in to MCP functionality without affecting default development workflows.

## Integration Architecture

### Existing Infrastructure Compatibility

**Network Integration**: Uses existing mcp-cluster bridge network (172.28.0.0/24)
**Monitoring Integration**: Connects to Prometheus and Grafana without reconfiguration
**Database Integration**: Shares network with PostgreSQL (172.28.0.20) and MariaDB (172.28.0.21)
**Build Service Integration**: Compatible with BuildKit (172.28.0.55) and GitHub Runner (172.28.0.56)

### Service Mesh Considerations

The MCP discovery agent provides service registry functionality suitable for future service mesh integration (Istio, Linkerd).

## Troubleshooting Patterns

### Service Startup Issues

**Profile Verification**: Ensure mcp profile is explicitly activated
**Network Validation**: Confirm mcp-cluster network exists with correct subnet
**Log Analysis**: Review container logs for startup errors

### Health Check Failures

**Protocol Compliance**: Verify MCP protocol version compatibility
**Network Accessibility**: Confirm service responds on internal port
**Connection State**: Check service connection handling capacity

### Volume Persistence Issues

**Permission Verification**: Ensure container user has volume write access
**Volume Recreation**: Clean and rebuild volumes if corruption detected
**State Migration**: Handle volume data during infrastructure updates

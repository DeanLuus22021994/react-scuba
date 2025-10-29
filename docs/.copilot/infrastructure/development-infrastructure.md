---
title: "Infrastructure Configuration"
domain: infrastructure
category: development
audience: ai-copilot
ai_hints:
  - docker-infrastructure
  - mcp-cluster-setup
  - service-orchestration
  - monitoring-integration
related:
  - development-workflow.md
  - devcontainer-mcp-services.md
last_updated: 2025-10-29
---

# Infrastructure Configuration

## Docker Compose Architecture

The infrastructure uses Docker Compose for service orchestration with profile-based activation patterns.

### Compose File Strategy

**Primary**: `docker-compose.yml` for core services
**MCP Extension**: `docker-compose.mcp-persistent.yml` for MCP cluster
**DevContainer Integration**: Both files referenced in devcontainer.json

### Service Orchestration Patterns

**Profile-Based Activation**: Services grouped by profile for opt-in control
**Network Segmentation**: Bridge networks for service isolation
**Port Management**: Strategic port allocation across tiers
**Health Checks**: Protocol-specific validation for all services

## MCP Cluster Configuration

### Network Architecture

**Cluster Network**: `mcp-cluster` bridge network with 172.28.0.0/24 subnet
**Static IP Assignment**: Predictable addresses for service discovery
**DNS Resolution**: Automatic DNS for container names
**Network Isolation**: Traffic segmentation for security

### Tier-Based IP Allocation

**Tier 1 - Databases**: 172.28.0.20-29 range
**Tier 2 - MCP Services**: 172.28.0.90-99 range
**Tier 3 - Monitoring**: 172.28.0.70-79 range
**Tier 4 - Build Services**: 172.28.0.50-59 range
**Tier 5 - Network Layer**: 172.28.0.60-69 range

### Service Discovery Integration

**Automatic Registration**: Docker label-based service detection
**Health Broadcasting**: WebSocket streams for real-time status
**Protocol Validation**: MCP compliance checks for registered services

## Python 3.14t Configuration

### Free-Threading Build

The MCP service uses Python 3.14t with experimental free-threading support:
- No Global Interpreter Lock limitations
- True parallel execution capability
- Enhanced performance for concurrent operations

### UV Package Manager

Modern Rust-based package manager for Python:
- Faster dependency resolution
- Better cache management
- Improved reproducibility
- Lockfile generation

### Package Management Strategy

**Production Dependencies**: Specified in pyproject.toml
**Cache Persistence**: Dedicated volume for UV cache
**Isolated Environment**: Virtual environment per service
**Version Pinning**: Exact versions for reproducibility

## Database Infrastructure

### PostgreSQL Configuration

**Version**: PostgreSQL 17
**Network Address**: 172.28.0.20
**Port**: 5432 (internal only)
**Purpose**: Primary database for multi-tenant platform

### MariaDB Configuration

**Version**: MariaDB 11
**Network Address**: 172.28.0.21
**Port**: 3306 (internal only)
**Purpose**: Legacy client support and compatibility

### Database Connectivity

**Connection Pooling**: Managed by application layer
**Health Checks**: Database-specific validation queries
**Backup Strategy**: Volume-based persistence
**Migration Management**: Application-controlled schema updates

## Monitoring Infrastructure

### Prometheus Configuration

**Network Address**: 172.28.0.71
**Port**: 9090 (metrics collection)
**Purpose**: Time-series metrics storage
**Integration**: Automatic service discovery via labels

### Grafana Configuration

**Network Address**: 172.28.0.72
**Port**: 3000 (dashboard access)
**Purpose**: Metrics visualization and alerting
**Data Source**: Pre-configured Prometheus connection

### Exporters

**Container Metrics**: cAdvisor for Docker stats
**Node Metrics**: node-exporter for system metrics
**Database Metrics**: postgres-exporter and mysql-exporter
**Custom Metrics**: Application-specific exporters

## Build Infrastructure

### BuildKit Configuration

**Network Address**: 172.28.0.55
**Purpose**: Advanced Docker image builds
**Features**: Multi-stage caching, parallel builds
**Integration**: Docker Compose build strategy

### GitHub Runner

**Network Address**: 172.28.0.56
**Purpose**: Self-hosted CI/CD execution
**Integration**: GitHub Actions workflow runner
**Isolation**: Separate network for build security

### Node Bootstrap Service

**Network Address**: 172.28.0.65
**Purpose**: npm workspace initialization
**Functionality**: Dependency installation and caching
**Performance**: Shared cache across builds

## Service Health Management

### Health Check Patterns

**HTTP-Based**: REST endpoints for service availability
**Protocol-Specific**: MCP protocol validation
**Database**: Connection pool status checks
**Custom Logic**: Application-specific health indicators

### Health Reporting

**Container Level**: Docker native health checks
**Application Level**: HTTP endpoint responses
**Discovery Level**: WebSocket health broadcasts
**Monitoring Level**: Prometheus scraping

## Port Allocation Strategy

### Reserved Port Ranges

**Development Services**: 3000-3099
**API Services**: 3100-3199
**Internal Services**: 7000-7099
**Monitoring**: 9000-9199
**GPU/AI Services**: 9400-9499

### Conflict Resolution

**Port Mapping**: Unique external ports per service
**Internal Communication**: Use service names not ports
**Documentation**: Central port registry in docker-compose.yml
**Validation**: Startup checks for port availability

## Volume Management

### Persistent Volumes

**Database Data**: PostgreSQL and MariaDB data directories
**Package Caches**: npm, Python, UV caches
**Service State**: MCP service persistent state
**Build Caches**: BuildKit and Docker layer caches

### Volume Naming Convention

All volumes prefixed with `react_scuba_` for workspace identification:
- Clear ownership and purpose
- Easy bulk operations
- Namespace collision prevention
- Workspace isolation

## Environment Configuration

### Environment Variable Strategy

**Service-Specific**: .env files per service
**Shared Configuration**: Compose environment inheritance
**Secret Management**: Separate from version control
**Override Patterns**: Local overrides via .env.local

### Configuration Hierarchy

**Defaults**: Defined in docker-compose.yml
**Environment**: Loaded from .env files
**Override**: Runtime environment variables
**Secret**: External secret store for production

## Service Dependencies

### Startup Ordering

**Database First**: Ensure databases ready before applications
**Discovery Second**: Service registry before dependent services
**Application Third**: Apps after infrastructure ready
**Monitoring Last**: Observability after services running

### Dependency Declaration

**depends_on**: Basic startup ordering
**Health-Based**: Wait for healthy state before starting
**Retry Logic**: Application-level connection retry
**Graceful Degradation**: Partial functionality if dependencies unavailable

## Infrastructure Scaling

### Horizontal Scaling

**Stateless Services**: Multiple instances behind load balancer
**Database Read Replicas**: Separate read and write workloads
**Cache Distribution**: Shared cache across instances
**Service Mesh**: Future consideration for advanced routing

### Vertical Scaling

**Resource Limits**: Container CPU and memory allocation
**Bursting**: Temporary resource limit increases
**Performance Monitoring**: Track resource utilization
**Optimization**: Right-size based on metrics

## Troubleshooting Infrastructure

### Service Startup Issues

**Symptom**: Container fails to start
**Resolution**: Check logs, verify dependencies, validate configuration
**Prevention**: Health checks and proper dependency ordering

### Network Issues

**Symptom**: Services cannot communicate
**Resolution**: Verify network configuration, check firewall rules
**Prevention**: Consistent network naming and IP allocation

### Volume Issues

**Symptom**: Data loss or permission errors
**Resolution**: Check volume mounts, verify permissions
**Prevention**: Proper volume lifecycle management

### Resource Exhaustion

**Symptom**: Slow performance or crashes
**Resolution**: Monitor resource usage, adjust limits
**Prevention**: Capacity planning and alerting

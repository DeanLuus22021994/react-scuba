# Custom Dockerfiles for Cluster Example

This directory contains optimized Dockerfiles for the cluster-example Docker Compose setup. These custom Dockerfiles provide load balancing, high availability, and performance optimizations for a clustered deployment.

## Benefits

### 🚀 **Performance Optimizations**

- **Multi-stage builds** for all services (Node.js, Python, PostgreSQL, Nginx)
- **Layer caching** for faster rebuilds
- **Named volume mounts** for persistent dependency caching
- **Optimized configurations** for cluster workloads

### 🔒 **Security Enhancements**

- **Non-root users** for all services
- **Minimal attack surfaces** with essential packages only
- **Security headers** in Nginx configuration
- **Rate limiting** and access controls

### 📦 **Load Balancing & High Availability**

- **Nginx load balancer** with upstream backend servers
- **Health checks** for all services
- **Automatic failover** between backend instances
- **Optimized PostgreSQL** for cluster workloads

### 🏥 **Reliability Improvements**

- **Integrated health monitoring** for all services
- **Proper error handling** and fallback mechanisms
- **Performance monitoring** with pg_stat_statements
- **Optimized resource allocation** for cluster deployment

## Services

### Nginx Load Balancer (`nginx.Dockerfile`)

- **Base image**: Nginx Alpine
- **Features**:
  - Load balancing across 3 backend web servers
  - Reverse proxy to Node.js and Python services
  - Gzip compression and caching
  - Security headers and rate limiting
  - Health check endpoint
  - Non-root user execution

### Node.js Service (`node.Dockerfile`)

- **Base image**: Node.js 20 Alpine
- **Multi-stage build**: base → deps → dev-deps → builder → runner
- **Features**:
  - Production and development dependency separation
  - Cluster-optimized configuration
  - Health check integration
  - Non-root user execution

### Python Service (`python.Dockerfile`)

- **Base image**: Python 3.14 slim
- **Multi-stage build**: base → deps → runner
- **Features**:
  - Virtual environment isolation
  - Cluster deployment configuration
  - Health check validation
  - Non-root user execution

### PostgreSQL Database (`postgres.Dockerfile`)

- **Base image**: PostgreSQL 13 Alpine
- **Features**:
  - Cluster-optimized configuration
  - Performance monitoring (pg_stat_statements)
  - Replication-ready settings
  - Health check integration

## Architecture

```text
Internet
    ↓
Nginx Load Balancer (Port 8080)
    ↓
├── Web Server 1 (web1)
├── Web Server 2 (web2)
└── Web Server 3 (web3)
    ↓
Node.js API (Port 3000)
    ↓
Python Service (Port 8000)
    ↓
PostgreSQL Database (Port 5432)
```

## Usage

The Docker Compose file automatically uses these custom Dockerfiles. To build and run:

```bash
# Build custom images
docker-compose build

# Start cluster
docker-compose up

# Or run in background
docker-compose up -d

# Scale web servers
docker-compose up -d --scale web1=2 --scale web2=2 --scale web3=2
```

## Development Workflow

### First Build

- Dependencies are installed during build
- May take longer due to multi-stage optimization
- Subsequent builds are significantly faster

### Load Balancing

- Requests are distributed across web1, web2, web3
- Automatic failover if a backend server fails
- Session persistence through load balancer

### Health Monitoring

- All services include health checks
- Nginx provides `/health` endpoint
- Automatic service discovery and routing

## Configuration

### Nginx Configuration

- **nginx.conf**: Main configuration with performance optimizations
- **default.conf**: Server configuration with load balancing rules
- **Upstream backend**: Round-robin load balancing to web servers
- **API routing**: Proxy to Node.js and Python services

### PostgreSQL Configuration

Custom configuration in `postgresql.conf` includes:

- Cluster-optimized memory settings
- Replication preparation
- Performance monitoring
- Connection pooling ready

### Environment Variables

All environment variables remain the same as the original configuration.

## Scaling

### Horizontal Scaling

```bash
# Scale web servers
docker-compose up -d --scale web1=3 --scale web2=3 --scale web3=3

# Add more Node.js instances
docker-compose up -d --scale node=2
```

### Resource Allocation

- PostgreSQL: Optimized for cluster workloads
- Node.js: Configured for production clustering
- Python: Virtual environment isolation
- Nginx: Lightweight load balancing

## Troubleshooting

### Load Balancing Issues

- Check Nginx logs: `docker-compose logs loadbalancer`
- Verify backend health: `docker-compose ps`
- Test individual services directly

### Database Connection Issues

- Check PostgreSQL logs: `docker-compose logs db`
- Verify connection string and credentials
- Test direct database connection

### Performance Issues

- Monitor resource usage: `docker stats`
- Check health endpoints
- Review Nginx access logs for bottlenecks

## Migration from Default Images

The custom Dockerfiles are drop-in replacements for the default images. No changes to docker-compose.yml are required beyond the build context updates. The cluster provides enhanced reliability and performance compared to the basic setup.

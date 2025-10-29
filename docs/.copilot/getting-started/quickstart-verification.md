---
title: "Quick Start Verification"
domain: getting-started
category: validation
audience: ai-copilot
ai_hints:
  - verification-procedures
  - health-checks
  - service-validation
  - troubleshooting
related:
  - quickstart-setup.md
  - ../infrastructure/development-workflow.md
last_updated: 2025-10-29
---

# Quick Start Verification

## Service Health Verification

### Container Status Check

Verify all expected containers running
Check health status indicators (healthy vs starting)
Confirm restart policies active
Review container uptime and resource usage

### Database Connectivity

PostgreSQL connection test from container
MariaDB connection test from container
Verify database schemas exist
Test query execution capability

### MCP Service Validation

MCP sidecar responds on port 9099
Discovery agent responds on port 9097
WebSocket health stream active
Protocol compliance validation passing

## Development Server Verification

### Frontend Server

Development server starts without errors
Hot module replacement functional
Browser access on configured port (default 3001)
Console shows no critical errors

### Backend API Server

API server starts and binds to port (default 3002)
Health endpoint responds successfully
Database connection pool established
Middleware chain loads correctly

### Service Communication

Frontend can reach backend API
Backend can query databases
MCP services discoverable by applications
No CORS errors in browser console

## Build Verification

### Development Build

Run development build command
Verify no TypeScript errors (if applicable)
Check for linting errors
Confirm source maps generated

### Production Build

Execute production build command
Verify bundle optimization occurs
Check compression ratios acceptable
Confirm output directory structure correct

## Testing Verification

### Unit Tests

Run unit test suite
Verify all tests pass
Check coverage meets targets
Review test execution time

### E2E Tests

Run E2E test suite (if applicable)
Verify browser automation works
Check test scenarios pass
Review test screenshots/videos if generated

## Extension Verification

### GitHub Copilot

Copilot icon shows authenticated status
Code suggestions appear while typing
Chat functionality accessible
No authentication errors

### Biome Linter

Biome extension loaded successfully
Linting errors display inline
Format on save working
Configuration detected correctly

### Python Extensions

Pylance language server active
Virtual environment detected
Python linting active (Ruff)
Debugging configuration available

## Network Verification

### Internal Network

Services resolve by container name
Static IP assignments correct
Network isolation functioning
DNS resolution working

### External Access

Published ports accessible from host
No unexpected port bindings
Firewall not blocking connections
Load balancer routing (if applicable)

## Volume Verification

### Named Volumes

Workspace volumes exist and mounted
MCP persistent volumes present
Database volumes persisting data
Cache volumes functioning

### Bind Mounts

Source code accessible in container
Changes reflect immediately
File permissions correct
Git operations work from container

## Performance Verification

### Build Performance

Development build under target time
Production build completes successfully
Hot module replacement under 100ms
Cache effectiveness verified

### Runtime Performance

Application load time acceptable
API response times reasonable
Database query performance adequate
No memory leaks detected

## Configuration Verification

### Environment Variables

Environment files loaded correctly
Service-specific variables set
Secrets not exposed in logs
Override hierarchy working

### Service Configuration

Database connection strings correct
API endpoints configured properly
Port assignments unique
Resource limits appropriate

## Monitoring Verification

### Prometheus

Prometheus accessible on configured port
Service discovery finding targets
Metrics collection active
No scraping errors

### Grafana

Grafana dashboard accessible
Data source connected to Prometheus
Default dashboards loading
No visualization errors

## Troubleshooting Verification Issues

### Service Not Healthy

Check container logs for errors
Verify dependencies started first
Review health check configuration
Increase startup timeout if needed

### Connection Refused

Confirm service actually listening
Check port mapping configuration
Verify firewall rules
Test with curl from container

### Build Failures

Review build logs for specific errors
Check dependency installation
Verify configuration files valid
Try clean build with cache cleared

### Test Failures

Isolate failing tests
Check test environment setup
Review mock configuration
Verify test data availability

## Verification Checklist

Complete verification includes:
- All containers running and healthy
- Databases accessible and queryable
- Development servers start successfully
- Hot reload functioning
- Tests passing
- Extensions loaded and active
- Network connectivity established
- Volumes mounted correctly
- Build process working
- Monitoring operational

## Post-Verification Steps

After successful verification:
- Save verification results
- Document any issues encountered
- Begin development workflow
- Reference troubleshooting docs as needed

## Continuous Verification

### Regular Health Checks

Run health checks periodically
Monitor resource usage trends
Check for service degradation
Review logs for warnings

### Automated Verification

CI/CD pipeline includes verification
Pre-commit hooks run checks
Automated tests execute on push
Health dashboards monitored

## Performance Benchmarking

### Baseline Metrics

Record initial build times
Document cold start times
Measure hot reload speed
Benchmark query performance

### Regression Detection

Compare current vs baseline metrics
Identify performance degradations
Investigate metric anomalies
Optimize before issues compound

## Security Verification

### Access Controls

Verify authentication working
Test authorization rules
Check secret management
Confirm HTTPS enforcement (if applicable)

### Vulnerability Scanning

Run dependency audit
Check for known vulnerabilities
Review security warnings
Update vulnerable packages

## Documentation Verification

### Setup Documentation

Verify documentation matches actual setup
Check for outdated information
Test documented commands
Update docs if discrepancies found

### Configuration Examples

Verify example configurations work
Check environment variable documentation
Test documented troubleshooting steps
Update examples if needed

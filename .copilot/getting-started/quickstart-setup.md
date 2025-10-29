---
title: "Quick Start Setup"
domain: getting-started
category: setup
audience: ai-copilot
ai_hints:
  - initial-setup
  - environment-configuration
  - service-activation
  - prerequisites
related:
  - quickstart-verification.md
  - ../infrastructure/devcontainer-architecture.md
last_updated: 2025-10-29
---

# Quick Start Setup

## Prerequisites

### Required Software

**Docker Desktop**: Compose V2 support required
**VS Code**: Dev Containers extension installed
**Git**: Version control system
**Node.js**: Not required (containerized)

### System Requirements

**RAM**: Minimum 16GB, recommended 32GB
**Disk**: 50GB free space for containers and volumes
**OS**: Windows 10/11, macOS, or Linux
**Network**: Internet connection for initial setup

## Repository Setup

### Clone Repository

Repository location: DeanLuus22021994/react-scuba on GitHub
Clone via HTTPS or SSH based on preference
Navigate to project root after cloning

### Environment Configuration

Copy `.env.example` to `.env` in repository root
Review default configuration values
Modify settings if needed (most defaults work)

### Optional MCP Auto-Start

MCP service starts manually by default
Enable auto-start by setting `ENABLE_MCP=true` in `.env`
Auto-start recommended for active MCP development only

## Infrastructure Startup

### Main Infrastructure

Start core services with Docker Compose
Services include databases, monitoring, build tools
Wait for healthy status before proceeding
Verify no port conflicts in terminal output

### MCP Service Activation

Two activation methods available:
- npm script: `npm run mcp:start`
- Docker Compose: `docker compose --profile mcp up -d`

MCP profile controls Python MCP sidecar and discovery agent
Services persist across main container rebuilds

## VS Code Integration

### Open Workspace

Open project directory in VS Code or VS Code Insiders
VS Code detects devcontainer configuration automatically
Choose between Stable or Insiders based on preference

### Container Reopen

Command Palette action: "Dev Containers: Reopen in Container"
Wait for container build and initialization
Extensions install automatically on first launch
Terminal opens inside container environment

### DevContainer Features

Node.js 22 pre-installed with npm workspace support
Python 3.12 with UV package manager
Docker CLI available for container management
Oh My Zsh with productivity plugins

## Service Verification

### Docker Container Status

Check all services running with `docker compose ps`
Verify healthy status for critical services
Databases (PostgreSQL, MariaDB) should show healthy
MCP services healthy if profile activated

### Network Connectivity

Test database connections from container
Verify MCP service responds on internal ports
Confirm service discovery detects services
Check monitoring stack accessibility

### VS Code Extensions

Verify GitHub Copilot active and authenticated
Native language servers loaded and functional
Python extensions recognize virtual environment
Docker extension shows running containers

## Development Workspace

### Workspace Structure

Server directory contains all npm workspaces
Apps directory holds frontend, backend, content provider
Packages directory contains shared libraries
Clients directory stores multi-tenant configurations

### Terminal Access

Integrated terminal opens in container context
Multiple terminal instances supported
All commands run in containerized environment
Host file system mounted for Git operations

### Hot Reload Verification

Make small change to source file
Observe immediate reflection in development server
HMR updates occur in sub-100ms
No manual refresh required

## Common Setup Patterns

### Fresh Installation

Clone repository, copy environment file, start infrastructure
Open in VS Code, reopen in container, verify services
Run initial workspace install if needed
Start development servers

### Existing Project Return

Pull latest changes from Git
Restart Docker Compose services if configuration changed
Reopen container in VS Code
Resume development immediately

### MCP Development Setup

Enable MCP in environment configuration
Start MCP services before opening container
Verify MCP health after container startup
Check discovery agent detects services

## Troubleshooting Setup

### Docker Issues

Docker Desktop not running: Start Docker Desktop
Port conflicts: Check and modify port assignments in .env
Network issues: Recreate Docker networks
Volume issues: Remove and recreate volumes

### Container Build Failures

Check Docker Desktop version meets requirements
Verify internet connectivity for image pulls
Review build logs for specific errors
Try rebuilding with no cache option

### VS Code Issues

Dev Containers extension not installed: Install from marketplace
Container connection fails: Check Docker connection
Extensions not loading: Reload window or rebuild container
Permission errors: Verify Docker user permissions

### Service Startup Issues

Database connection errors: Wait longer for database healthy
Port binding errors: Check for conflicting services
MCP services not starting: Verify profile activation
Health checks failing: Check service logs for details

## Next Steps

After successful setup:
- Verify all services with quick start verification
- Review development workflow documentation
- Explore multi-tenant architecture concepts
- Begin feature development

## Development Modes

### Frontend Development

Start web application development server
Hot module replacement provides instant feedback
Access frontend on port 3001 (default)
API proxied to backend automatically

### Backend Development

Start API server in development mode
Nodemon watches for file changes
Database connections established automatically
Test API endpoints via REST client

### Full Stack Development

Run both frontend and backend simultaneously
Services communicate via internal network
Database changes reflected immediately
End-to-end testing possible

## Configuration Customization

### Port Customization

Modify port assignments in `.env` file
Update docker-compose.yml if needed
Restart services after configuration changes
Verify no conflicts with host system

### Resource Allocation

Adjust container CPU and memory limits
Modify VS Code memory allocation for TypeScript server
Configure database resource limits
Monitor resource usage for optimization

### Feature Flags

Enable or disable optional features via environment
MCP auto-start controlled by flag
Monitoring stack optional activation
Experimental features toggle available

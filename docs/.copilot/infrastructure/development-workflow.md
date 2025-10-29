---
title: "Development Workflow"
domain: infrastructure
category: development
audience: ai-copilot
ai_hints:
  - development-process
  - task-completion-patterns
  - dependency-management
  - environment-configuration
related:
  - devcontainer-architecture.md
  - development-infrastructure.md
last_updated: 2025-10-29
---

# Development Workflow

## Development Process Overview

The React Scuba development workflow follows systematic task completion patterns with verification at each stage.

### Task Execution Pattern

**Sequential Validation**: Each task completes with verification before proceeding
**Dependency Resolution**: Backend and frontend dependencies managed separately
**Configuration Verification**: Environment files validated before service startup
**Build Validation**: Compilation and type-checking confirm task completion

## Dependency Management

### Backend Dependencies

Backend API uses Express.js ecosystem with MariaDB connectivity:
- Compression middleware for response optimization
- Rate limiting for API protection
- Input validation for security
- Legacy peer dependency handling for React 19 compatibility

### Frontend Dependencies

Frontend uses React 19 with modern tooling:
- Prop types validation (verified and available)
- Tailwind CSS for styling
- Vite for build tooling
- npm workspace for monorepo management

### Installation Strategies

**Legacy Peer Dependencies**: Use --legacy-peer-deps flag for React 19 warnings
**Workspace-Specific**: Install per workspace to maintain isolation
**Verification**: Confirm availability before proceeding to next task

## Configuration Management

### API Configuration

Backend API requires environment configuration for:
- Port assignment (avoiding conflicts)
- Database connection parameters
- CORS origin configuration
- Node environment setting

### Frontend Configuration

React frontend configuration includes:
- API endpoint configuration
- Contact information (WhatsApp, phone, email)
- Vite environment variable loading
- Client-specific settings

### Configuration Verification

**File Existence**: Confirm .env files present in correct locations
**Port Conflicts**: Verify unique port assignments across services
**Database Connectivity**: Validate connection parameters
**Environment Loading**: Ensure Vite processes environment variables

## Tailwind Configuration

### Configuration Structure

Tailwind v4 configuration includes:
- Custom color palettes (ocean/coral themes)
- Content path definitions for purging
- Plugin configuration
- PostCSS integration

### Verification Steps

**File Location**: Confirm tailwind.config.js in correct workspace
**Syntax Validation**: Verify JavaScript syntax correctness
**Content Paths**: Ensure glob patterns match source structure
**Version Compatibility**: Confirm Tailwind v4 features used correctly

## Build Process

### Development Builds

**Hot Module Replacement**: Instant feedback on code changes
**Source Maps**: Enable debugging with original source
**Fast Refresh**: React component state preservation
**Parallel Workspace Builds**: npm workspace parallelization

### Production Builds

**Optimization**: Minification and compression
**Bundle Splitting**: Code splitting for performance
**Asset Optimization**: Image and font optimization
**Cache Busting**: Content-based hashing for static assets

## Testing Strategy

### Unit Testing

**Framework**: Vitest for React component testing
**Coverage**: Target 80%+ for critical paths
**Isolation**: Test workspace independently
**Mocking**: External dependencies mocked appropriately

### Integration Testing

**E2E Framework**: Playwright for user journeys
**API Testing**: Express endpoint validation
**Multi-Tenant Scenarios**: Client isolation verification
**Database Integration**: Real database in test environment

## Task Completion Verification

### Verification Checklist

Each completed task includes:
- File creation or modification confirmed
- Configuration syntax validated
- Dependencies installed and available
- Service startup verified (where applicable)
- No errors in terminal output

### Status Reporting

**Completed Tasks**: Marked with timestamp and verification
**Blocked Tasks**: Document blocking issues and dependencies
**Next Steps**: Clear indication of next task requirements

## Environment Synchronization

### Container Environment

**Volume Synchronization**: Source code changes instantly available
**Dependency Isolation**: Named volumes prevent conflicts
**Service Discovery**: Automatic registration of new services
**Health Monitoring**: Real-time service status

### Host Environment

**File System**: Changes persisted to host for Git operations
**Environment Variables**: Managed via .env files
**Configuration Files**: Host-side editing with container reflection

## Troubleshooting Workflow

### Dependency Issues

**Symptom**: Module not found errors
**Resolution**: Verify installation in correct workspace
**Prevention**: Use workspace-specific install commands

### Port Conflicts

**Symptom**: Port already in use errors
**Resolution**: Update port configuration in .env
**Prevention**: Document port allocations across services

### Build Failures

**Symptom**: TypeScript errors or build crashes
**Resolution**: Check type definitions and dependencies
**Prevention**: Regular type-checking and linting

### Database Connection Issues

**Symptom**: Cannot connect to database
**Resolution**: Verify credentials and database running
**Prevention**: Health checks before dependent services start

## Development Progress Tracking

### Task Documentation

Each task documented with:
- Objective and scope
- Time estimate and actual duration
- Commands executed
- Files created or modified
- Verification results
- Next dependencies

### Status Indicators

**Completed**: ✅ with verification timestamp
**In Progress**: 🔄 with current status
**Blocked**: 🚫 with blocking issue description
**Planned**: 📋 with dependencies listed

## Workflow Optimization

### Performance Improvements

**Parallel Execution**: Run independent tasks simultaneously
**Cache Utilization**: Leverage build and package caches
**Incremental Builds**: Only rebuild changed workspaces
**Hot Reload**: Minimize restart requirements

### Developer Experience

**Fast Feedback**: Sub-100ms hot module replacement
**Clear Errors**: Descriptive error messages with solutions
**Automated Checks**: Pre-commit hooks for quality
**Integrated Tools**: All tools accessible via VS Code

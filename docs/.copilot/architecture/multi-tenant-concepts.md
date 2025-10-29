---
title: Multi-Tenant Architecture Concepts
source: MULTI_TENANT.md
domain: architecture
tags: [architecture, multi-tenant, saas, isolation]
ai_hints: [tenant resolution, configuration isolation, client onboarding]
ai_optimized: true
code_free: true
updated: 2025-10-29
---

# Multi-Tenant Architecture Concepts

## Purpose

AI-optimized reference for understanding multi-tenant SaaS architecture patterns in the React Scuba platform.

## Core Architectural Principles

### Multi-Client Isolation

The platform provides complete tenant isolation through:

- **Configuration Separation**: Each client has dedicated configuration stored in isolated directories
- **Runtime Resolution**: Tenant identity resolved from subdomain, domain, environment, or path
- **Type Safety**: TypeScript interfaces with Zod validation ensure configuration integrity
- **Asset Isolation**: Client-specific images and branding completely separated

### Tenant Resolution Strategies

Four resolution methods support different deployment scenarios:

**Subdomain Resolution**: Extract tenant from subdomain (e.g., oceanspirit.react-scuba.com)
**Custom Domain**: Full custom domain mapping (e.g., dive.oceanspirit.com)
**Environment Variable**: Static tenant selection via TENANT_ID
**Path-Based**: Tenant extracted from URL path (/clients/oceanspirit)

Priority order: Environment Variable → Custom Domain → Subdomain → Path-Based → Default

### Performance Optimization

**Configuration Caching**: In-memory cache with invalidation support reduces filesystem access
**Lazy Loading**: Tenant configuration loaded on-demand, not at application startup
**Cache Invalidation**: Manual cache clearing for configuration updates without restart

## Package Architecture

### Content Management Package

Location: server/apps/content/

Responsibilities:
- Load and validate client configurations from JSON files
- Resolve tenant identity from multiple sources
- Provide type-safe configuration access to applications
- Cache configurations for performance
- Validate all configurations against Zod schemas

### Client Configuration Storage

Location: server/clients/

Structure:
- One directory per client with unique slug identifier
- config.json containing all client-specific data
- images/ subdirectory for client assets
- _template/ directory providing onboarding template

### Type Definitions

Comprehensive TypeScript interfaces define:
- Tenant identification metadata
- Company and contact information
- Theme customization (colors, fonts, logos)
- Feature flags for conditional functionality
- Social media integration
- Industry-specific content (courses, products, services)

## Scalability Characteristics

### Horizontal Scaling

- Stateless resolution supports multiple application instances
- Configuration cached independently per instance
- No shared state between tenant resolution processes

### Vertical Scaling

- Unlimited clients supported (limited only by filesystem)
- Configuration size impacts memory but not resolution logic
- Asset storage scales with object storage integration

### Onboarding Process

New client addition requires:
1. Copy template directory with new client slug
2. Update config.json with client-specific data
3. Add client images to images/ subdirectory
4. No application code changes required
5. Configuration automatically discovered on next request

## Security Considerations

### Data Isolation

- No cross-tenant data access possible
- Configuration files read-only at runtime
- Tenant resolution happens before data access
- Each client configuration independently validated

### Configuration Validation

- Zod schemas prevent malformed configurations
- Required fields enforced at validation time
- Type safety ensures compile-time correctness
- Runtime validation catches configuration errors early

## Integration Points

### Frontend Integration

React applications consume configurations through:
- Context providers wrapping application root
- Custom hooks for accessing tenant data
- Environment variable overrides for development
- Type-safe configuration access throughout codebase

### Backend Integration

Express API accesses tenant configuration via:
- Middleware resolving tenant from request
- Configuration passed to route handlers
- Database queries scoped to resolved tenant
- Feature flags controlling endpoint availability

### Build-Time Integration

For static deployments:
- Vite plugin injects tenant configuration at build time
- Multiple builds generated per tenant
- Static assets separated by tenant
- CDN deployment with tenant-specific paths

## Multi-Tenant Patterns

### Shared Database with Tenant Column

Not implemented - configuration-based isolation only
Each tenant shares application infrastructure
No database-level tenant isolation

### Separate Database Per Tenant

Not implemented - configuration-based isolation only
Future enhancement possibility
Would require connection pooling per tenant

### Hybrid Approach

Current implementation:
- Shared application code and infrastructure
- Isolated configuration and assets
- Shared databases with tenant-scoped queries
- Content-level isolation without infrastructure duplication

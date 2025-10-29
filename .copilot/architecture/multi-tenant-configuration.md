---
title: Multi-Tenant Configuration Schema
source: MULTI_TENANT.md
domain: architecture
tags: [configuration, schema, validation, type-safety]
ai_hints: [client config, zod validation, typescript interfaces, configuration structure]
ai_optimized: true
code_free: true
updated: 2025-10-29
---

# Multi-Tenant Configuration Schema

## Purpose

AI-optimized reference for understanding the structure and validation of client configurations.

## Configuration Structure

### Tenant Identification

Each client configuration includes identification metadata:

**Tenant ID**: Unique UUID for internal reference
**Slug**: URL-safe identifier used in subdomains and paths
**Name**: Human-readable display name
**Status**: Active, inactive, or suspended state
**Timestamps**: Creation and last update timestamps in ISO 8601 format

### Company Information

Comprehensive company profile:

**Name**: Legal or trading company name
**Tagline**: Short marketing slogan
**Description**: Brief company overview for homepage
**About**: Detailed company history and mission
**Core Values**: Optional list of company values
**Certifications**: Optional industry certifications
**Established**: Optional founding year

### Contact Information

Multiple contact channels:

**Phone**: Primary contact phone number
**WhatsApp**: WhatsApp contact number
**Email**: Primary email address
**Address**: Physical location with street, city, postal code, country
**Hours**: Operating hours by day of week with open/close times

### Social Media Configuration

Platform-specific social media links:

**Facebook**: Page URL
**Instagram**: Profile URL
**YouTube**: Channel URL
**Twitter**: Profile URL (X platform)
**LinkedIn**: Company page URL
**TikTok**: Profile URL

### Theme Customization

Visual branding configuration:

**Colors**: Primary, secondary, accent, and semantic colors (success, warning, error, info)
**Fonts**: Heading and body font families with fallbacks
**Logos**: Primary logo, favicon, and optional secondary logo URLs
**Images**: Hero image, background patterns, and placeholder images

### Feature Flags

Conditional functionality control:

**Booking System**: Enable/disable online booking
**Course Catalog**: Show/hide diving courses
**Dive Sites**: Display dive site information
**Gallery**: Photo gallery functionality
**Team Page**: Staff/instructor profiles
**Blog**: News and articles section
**Testimonials**: Customer reviews
**Newsletter**: Email subscription
**Multi-language**: Language switching

### Navigation Structure

Configurable menu items:

**Label**: Display text for menu item
**Path**: Route path within application
**External**: Boolean indicating external link
**Children**: Optional nested submenu items

### SEO Configuration

Search engine optimization:

**Title**: Default page title
**Description**: Meta description for search results
**Keywords**: Array of relevant keywords
**OG Image**: Open Graph image for social sharing
**Twitter Card**: Twitter card type (summary or summary_large_image)

### Industry-Specific Content

Optional content types for different business verticals:

**Courses**: Diving certification courses (diving centers)
**Dive Sites**: Location descriptions (diving centers)
**Services**: Professional services offered (all industries)
**Products**: Software or physical products (all industries)
**Case Studies**: Project portfolios (professional services)
**Team Members**: Staff profiles with optional certifications

## Validation Rules

### Required Fields

Minimum configuration requirements:

- Tenant identification (id, slug, name, status)
- Company name
- Primary contact phone and email
- At least one theme color
- At least one font family

### Optional Fields

Industry-specific extensions:

- Courses and dive sites optional (diving-specific)
- Products and case studies optional (industry-agnostic)
- Team certifications optional (flexible across industries)
- Social media links optional

### Data Types

Type enforcement:

- UUIDs validated with regex pattern
- Slugs restricted to lowercase alphanumeric and hyphens
- Email addresses validated with email format
- URLs validated with URL format
- Dates in ISO 8601 format
- Colors in hex format (#RRGGBB)

### Zod Schema Validation

Runtime validation ensures:

- All required fields present
- Correct data types for all fields
- Valid formats for emails, URLs, dates
- Enum validation for status and feature flags
- Nested object structure validation
- Array element validation

## Configuration Loading

### File System Structure

Configurations stored as:

- JSON files in server/clients/[slug]/config.json
- Images in server/clients/[slug]/images/
- Template in server/clients/_template/

### Caching Strategy

Performance optimization:

- First load reads from filesystem
- Subsequent access returns cached configuration
- Cache invalidation on manual request
- No automatic cache expiration (deploy to refresh)

### Error Handling

Configuration loading failures:

- Missing configuration file returns default template
- Invalid JSON logs error and falls back to default
- Validation errors logged with detailed field information
- Application continues with fallback configuration

## Schema Evolution

### Backwards Compatibility

Schema changes maintain compatibility:

- New optional fields added without breaking existing configs
- Required fields never removed (deprecated instead)
- Default values provided for new fields
- Migration scripts for breaking changes

### Version Management

Configuration versioning:

- Schema version tracked in validation metadata
- Clients can use different schema versions
- Automatic migration on configuration load
- Version-specific validation rules

## Best Practices

### Configuration Design

Recommended patterns:

- Keep configurations small and focused
- Use feature flags for conditional functionality
- Provide sensible defaults for optional fields
- Validate configurations in CI/CD pipeline
- Document all custom fields added

### Asset Management

Image and file handling:

- Store assets in client-specific directories
- Use relative paths in configuration
- Optimize images before adding to repository
- Provide fallback images for missing assets
- Consider CDN for production deployments

### Security Considerations

Configuration safety:

- Never store secrets in configuration files
- Use environment variables for sensitive data
- Validate all user-provided configuration values
- Sanitize configuration before rendering in UI
- Restrict configuration file permissions in production

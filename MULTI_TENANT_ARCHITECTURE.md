# Multi-Tenant Architecture - React Scuba Platform

**Version:** 1.0.0  
**Date:** October 28, 2025  
**Status:** ✅ Implementation Complete

---

## Executive Summary

The React Scuba platform has been architected as a **multi-tenant SaaS solution** enabling streamlined onboarding of diving centers worldwide. This document describes the complete content management system built in `@react-scuba/content` package.

### Key Capabilities

- ✅ **Multi-Client Support**: Isolate configurations for unlimited diving centers
- ✅ **Flexible Tenant Resolution**: Subdomain, custom domain, environment variable, or path-based
- ✅ **Type-Safe Configuration**: Comprehensive TypeScript interfaces with Zod validation
- ✅ **Performance Optimized**: Built-in configuration caching with cache invalidation
- ✅ **Template-Based Onboarding**: Standardized configuration template for rapid client setup
- ✅ **Asset Isolation**: Client-specific image and branding asset management

---

## Architecture Overview

### Package Structure

```
server/
├── apps/
│   ├── content/                    # 🆕 Multi-tenant content management
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── README.md
│   │   └── src/
│   │       ├── index.js                # Main package exports
│   │       ├── types/
│   │       │   └── ClientConfig.ts     # TypeScript interfaces
│   │       ├── validators/
│   │       │   └── configValidator.ts  # Zod schema validation
│   │       ├── loaders/
│   │       │   └── configLoader.ts     # JSON config loader with caching
│   │       ├── resolvers/
│   │       │   └── tenantResolver.ts   # Tenant resolution strategies
│   │       └── utils/
│   ├── web/                        # Frontend React application
│   ├── api/                        # Backend Express API
│   └── docs/                       # VitePress documentation
│  
├── clients/                        # 🆕 Client configuration storage
│   ├── ocean-spirit-mauritius/     # Production client
│   │   ├── config.json
│   │   └── images/
│   │       ├── team/
│   │       └── branding/
│   └── _template/                  # Template for new clients
│       ├── config.json
│       ├── README.md
│       └── images/
│
└── packages/                       # Shared libraries
    ├── config/
    ├── types/
    ├── ui/
    └── utils/
```

---

## Configuration Schema

### ClientConfig Interface

The comprehensive configuration interface defines all client-specific data:

```typescript
interface ClientConfig {
  // Tenant Identification
  tenant: {
    id: string;                    // UUID
    slug: string;                  // URL-safe identifier
    name: string;                  // Display name
    status: 'active' | 'inactive' | 'suspended';
    createdAt: string;             // ISO 8601
    updatedAt: string;             // ISO 8601
  };

  // Company Information
  company: {
    name: string;
    tagline: string;
    description: string;
    about: string;
    coreValues?: string[];
    certifications?: string[];
    established?: number;
  };

  // Contact Information
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
      coordinates: { latitude: number; longitude: number };
    };
    businessHours: {
      [key: string]: { open: string; close: string; closed?: boolean };
    };
  };

  // Content Arrays
  team: TeamMember[];
  courses: Course[];
  diveSites: DiveSite[];
  gallery: GalleryImage[];
  testimonials?: Testimonial[];
  blog?: BlogPost[];

  // Branding & Assets
  branding: {
    logo: string;
    favicon: string;
    heroImage: string;
    colors: { primary: string; secondary: string; accent?: string };
  };

  // External Links
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    // ... other platforms
  };

  // SEO Metadata
  seo: {
    title: string;
    description: string;
    keywords: string[];
    baseUrl: string;
  };

  // Feature Toggles
  features: {
    booking: boolean;
    gallery: boolean;
    blog: boolean;
    multiCurrency: boolean;
    whatsappWidget: boolean;
  };

  // Pricing Configuration
  pricing: {
    defaultCurrency: string;
    currencies: string[];
  };
}
```

---

## Tenant Resolution Strategies

### 1. Subdomain Resolution
**Use Case**: Multi-tenant platform with standardized subdomains

```javascript
// Configuration
const resolver = createTenantResolver({
  strategy: 'subdomain',
  baseDomain: 'scuba-platform.com',
  fallbackSlug: 'ocean-spirit-mauritius'
});

// URL: https://ocean-spirit.scuba-platform.com
// Resolves to: "ocean-spirit"
```

### 2. Custom Domain Resolution
**Use Case**: White-label clients with own domains

```javascript
// Configuration
const resolver = createTenantResolver({
  strategy: 'domain',
  domainMap: {
    'osdiving.com': 'ocean-spirit-mauritius',
    'blueoceanbali.com': 'blue-ocean-bali'
  }
});

// URL: https://osdiving.com
// Resolves to: "ocean-spirit-mauritius"
```

### 3. Environment Variable Resolution
**Use Case**: Single deployment per tenant (simplest approach)

```javascript
// Configuration
const resolver = createTenantResolver({
  strategy: 'env',
  envVarName: 'TENANT_SLUG',
  fallbackSlug: 'ocean-spirit-mauritius'
});

// Environment: TENANT_SLUG=ocean-spirit-mauritius
// Resolves to: "ocean-spirit-mauritius"
```

### 4. Path-Based Resolution
**Use Case**: Development/testing environments

```javascript
// Configuration
const resolver = createTenantResolver({
  strategy: 'path',
  pathPrefix: '/clients/'
});

// URL: /clients/ocean-spirit/about
// Resolves to: "ocean-spirit"
```

---

## Client Onboarding Workflow

### Step 1: Prepare Client Data

Collect the following information:
- Company name, tagline, description
- Contact details (phone, email, WhatsApp, address with GPS coordinates)
- Business hours for each day
- Team member profiles with photos
- Course offerings with pricing
- Dive site information
- Gallery images
- Social media links
- Branding assets (logo, hero image, favicon)
- Color scheme (primary, secondary)

### Step 2: Copy Template

```powershell
# Copy template directory
Copy-Item -Recurse "server/clients/_template" "server/clients/new-client-slug"

# Navigate to new client directory
cd server/clients/new-client-slug
```

### Step 3: Edit Configuration

```json
// config.json
{
  "tenant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",  // Generate new UUID
    "slug": "new-client-slug",
    "name": "New Dive Center Name",
    "status": "active",
    "createdAt": "2025-10-28T00:00:00Z",
    "updatedAt": "2025-10-28T00:00:00Z"
  },
  // ... fill in all sections
}
```

### Step 4: Add Assets

```
server/clients/new-client-slug/
└── images/
    ├── team/
    │   ├── instructor-1.jpg
    │   └── instructor-2.jpg
    └── branding/
        ├── logo.png
        ├── favicon.ico
        └── hero.jpg
```

### Step 5: Validate Configuration

```javascript
import { safeValidateClientConfig } from '@react-scuba/content';
import config from './server/clients/new-client-slug/config.json';

const result = safeValidateClientConfig(config);
if (!result.success) {
  console.error('Validation errors:', result.errors);
}
```

### Step 6: Test Tenant Resolution

```javascript
import { loadClientConfig } from '@react-scuba/content';

const config = await loadClientConfig('new-client-slug');
console.log('Loaded:', config.company.name);
```

### Step 7: Deploy

- Commit configuration to version control
- Deploy application with tenant resolution configured
- Test in staging environment
- Promote to production

---

## Usage Examples

### Backend (Node.js/Express)

```javascript
import { loadClientConfig, createTenantResolver } from '@react-scuba/content';

// Create tenant resolver
const resolver = createTenantResolver({
  strategy: 'env',
  envVarName: 'TENANT_SLUG',
  fallbackSlug: 'ocean-spirit-mauritius'
});

// Middleware for tenant resolution
app.use(async (req, res, next) => {
  const tenantSlug = resolver.resolve({
    hostname: req.hostname,
    pathname: req.path
  });
  
  try {
    req.tenantConfig = await loadClientConfig(tenantSlug);
    next();
  } catch (error) {
    res.status(404).json({ error: 'Tenant not found' });
  }
});

// Use tenant data in routes
app.get('/api/company-info', (req, res) => {
  res.json({
    name: req.tenantConfig.company.name,
    tagline: req.tenantConfig.company.tagline,
    contact: req.tenantConfig.contact
  });
});
```

### Frontend (React)

```typescript
import { useState, useEffect } from 'react';
import { loadClientConfig, resolveTenantInBrowser } from '@react-scuba/content';

function useTenantConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const tenantSlug = resolveTenantInBrowser({
        strategy: 'env',
        fallbackSlug: 'ocean-spirit-mauritius'
      });
      
      const tenantConfig = await loadClientConfig(tenantSlug);
      setConfig(tenantConfig);
      setLoading(false);
    }
    
    load();
  }, []);

  return { config, loading };
}

// Component usage
function Header() {
  const { config, loading } = useTenantConfig();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <header>
      <img src={config.branding.logo} alt={config.company.name} />
      <h1>{config.company.name}</h1>
      <p>{config.company.tagline}</p>
    </header>
  );
}
```

---

## Performance Considerations

### Configuration Caching

The content loader implements automatic caching to minimize file I/O:

```javascript
// First load: reads from disk
const config1 = await loadClientConfig('ocean-spirit-mauritius');

// Subsequent loads: returns from cache
const config2 = await loadClientConfig('ocean-spirit-mauritius');

// Clear cache when configuration updates
clearConfigCache('ocean-spirit-mauritius');
```

### Cache Invalidation Strategies

1. **Manual**: Call `clearConfigCache()` after config updates
2. **Time-based**: Implement TTL with periodic cache clearing
3. **Event-based**: Clear cache on file system watch events
4. **Deployment**: Clear all caches on application restart

### Preloading

For multi-tenant deployments, preload all configurations on startup:

```javascript
import { preloadConfigs } from '@react-scuba/content';

const tenantSlugs = ['ocean-spirit-mauritius', 'blue-ocean-bali', 'coral-divers-thailand'];
await preloadConfigs(tenantSlugs);
```

---

## Security Considerations

### Configuration Validation

All configurations are validated against Zod schema before use:

```javascript
import { validateClientConfig } from '@react-scuba/content';

try {
  const config = validateClientConfig(rawConfig);
  // Config is guaranteed to be valid
} catch (error) {
  // Handle validation errors
  console.error('Invalid configuration:', error.errors);
}
```

### Asset Access Control

Client-specific assets should be served with proper access control:

```javascript
// Express middleware for asset isolation
app.use('/clients/:slug/images', (req, res, next) => {
  const requestedSlug = req.params.slug;
  const currentSlug = req.tenantConfig.tenant.slug;
  
  if (requestedSlug !== currentSlug) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
});
```

### Tenant Isolation

Ensure database queries filter by tenant_id:

```sql
-- All queries must include tenant filter
SELECT * FROM bookings WHERE tenant_id = ? AND date = ?;
```

---

## Migration Strategy

### Phase 1: Legacy Compatibility (Current)

Maintain existing constants files while introducing content package:

```javascript
// Legacy: Direct import
import { OCEAN_SPIRIT_CONTENT } from './config/constants/OCEAN_SPIRIT';

// New: Dynamic loading
import { loadClientConfig } from '@react-scuba/content';
const config = await loadClientConfig('ocean-spirit-mauritius');
```

### Phase 2: Gradual Adoption

Refactor components one-by-one to consume dynamic configuration:

```typescript
// Before
const companyName = OCEAN_SPIRIT_CONTENT.name;

// After
const { config } = useTenantConfig();
const companyName = config.company.name;
```

### Phase 3: Remove Legacy

Once all components use dynamic configuration:
1. Delete `/config/constants/` files
2. Update imports across codebase
3. Run comprehensive test suite
4. Deploy with monitoring

---

## Testing Strategy

### Unit Tests

```javascript
import { describe, it, expect } from 'vitest';
import { validateClientConfig } from '@react-scuba/content';

describe('Client Config Validation', () => {
  it('should validate valid configuration', () => {
    const config = {
      tenant: { /* ... */ },
      company: { /* ... */ },
      // ... complete valid config
    };
    
    expect(() => validateClientConfig(config)).not.toThrow();
  });

  it('should reject invalid tenant ID', () => {
    const config = {
      tenant: { id: 'not-a-uuid', /* ... */ },
      // ... rest of config
    };
    
    expect(() => validateClientConfig(config)).toThrow();
  });
});
```

### Integration Tests

```javascript
describe('Tenant Resolution', () => {
  it('should resolve tenant from subdomain', () => {
    const resolver = createTenantResolver({
      strategy: 'subdomain',
      baseDomain: 'platform.com'
    });
    
    const slug = resolver.resolve({ hostname: 'client.platform.com' });
    expect(slug).toBe('client');
  });
});
```

---

## Future Enhancements

### 1. Database-Driven Configuration (Phase 2)

Replace JSON files with database storage for dynamic updates:

```sql
CREATE TABLE tenant_configs (
  tenant_id UUID PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  config JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Admin UI (Phase 3)

Build administration interface for non-technical client management:
- Visual configuration editor
- Asset upload interface
- Real-time validation
- Preview mode

### 3. CMS Integration (Phase 4)

Integrate headless CMS (Strapi, Contentful, Sanity):
- Content authoring interface
- Version control
- Workflow approvals
- Multi-language support

### 4. A/B Testing (Phase 5)

Support configuration variants for testing:
- Multiple hero images
- Different pricing strategies
- Feature toggles per user segment

---

## Troubleshooting

### Configuration Not Found

**Error**: `Configuration not found for tenant: xyz`

**Solution**:
1. Verify `server/clients/xyz/config.json` exists
2. Check tenant slug matches exactly (case-sensitive)
3. Ensure configuration path is correct

### Validation Errors

**Error**: `Invalid configuration for tenant xyz`

**Solution**:
1. Review validation error details
2. Compare against template configuration
3. Ensure all required fields present
4. Verify data types match schema

### Cache Not Updating

**Symptom**: Configuration changes not reflected

**Solution**:
```javascript
import { clearConfigCache } from '@react-scuba/content';
clearConfigCache('tenant-slug');  // Clear specific tenant
clearConfigCache();                // Clear all tenants
```

---

## Support & Contact

For technical assistance with multi-tenant architecture:

- **Documentation**: This file + package README.md
- **Issues**: GitHub Issues
- **Architecture Team**: Contact via team channels

---

**Document Version**: 1.0.0  
**Last Updated**: October 28, 2025  
**Review Schedule**: Quarterly

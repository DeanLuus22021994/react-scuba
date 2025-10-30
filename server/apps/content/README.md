# @react-scuba/content

Multi-tenant content management system for React Scuba diving center platform.

## Features

- **Multi-Tenant Architecture**: Support multiple diving centers with isolated configurations
- **Flexible Resolution**: Subdomain, custom domain, environment variable, or URL path-based tenant detection
- **Type-Safe**: Comprehensive TypeScript interfaces and Zod validation
- **Caching**: Built-in configuration caching for performance
- **Validation**: Automatic schema validation with detailed error messages

## Installation

```bash
npm install @react-scuba/content
```

## Usage

### Load Client Configuration

```javascript
import { loadClientConfig } from '@react-scuba/content';

// Load configuration for a specific tenant
const config = await loadClientConfig('ocean-spirit-mauritius');

console.log(config.company.name); // "Ocean Spirit Scuba Diving Mauritius"
console.log(config.team); // Array of team members
console.log(config.courses); // Array of courses
```

### Tenant Resolution

```javascript
import { createTenantResolver } from '@react-scuba/content';

// Create resolver with subdomain strategy
const resolver = createTenantResolver({
  strategy: 'subdomain',
  baseDomain: 'scuba-platform.com',
  fallbackSlug: 'ocean-spirit-mauritius',
});

// Resolve tenant from request
const tenantSlug = resolver.resolve({
  hostname: 'ocean-spirit.scuba-platform.com',
});

console.log(tenantSlug); // "ocean-spirit"
```

### Validation

```javascript
import { safeValidateClientConfig } from '@react-scuba/content';

const result = safeValidateClientConfig(rawConfig);

if (result.success) {
  console.log('Valid configuration:', result.data);
} else {
  console.error('Validation errors:', result.errors);
}
```

## Configuration Structure

Client configurations are stored as JSON files in `server/clients/{tenant-slug}/config.json`.

### Required Fields

- `tenant`: Identification and metadata
- `company`: Company information
- `contact`: Contact details and business hours
- `team`: Team member profiles
- `courses`: Course offerings
- `diveSites`: Dive site information
- `gallery`: Gallery images
- `branding`: Logo, colors, assets
- `social`: Social media links
- `seo`: SEO metadata
- `features`: Feature toggles
- `pricing`: Currency configuration

### Example

```json
{
  "tenant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "ocean-spirit-mauritius",
    "name": "Ocean Spirit Scuba Diving Mauritius",
    "status": "active",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-10-28T00:00:00Z"
  },
  "company": {
    "name": "Ocean Spirit Scuba Diving Mauritius",
    "tagline": "PADI 5 Star ECO Green Fins Scuba Diving Centre",
    "description": "Premier diving center in Northern Mauritius",
    "about": "...",
    "coreValues": ["Safety", "Education", "Conservation"],
    "certifications": ["PADI 5 Star", "Green Fins", "ECO"],
    "established": 2005
  },
  "contact": {
    "phone": "+230 2634468",
    "whatsapp": "+230 5255 2732",
    "email": "info@osdiving.com",
    "address": {
      "street": "Coastal Road",
      "city": "Pereybere",
      "postalCode": "30546",
      "country": "Mauritius",
      "coordinates": {
        "latitude": -20.01748,
        "longitude": 57.57789
      }
    },
    "businessHours": {
      "monday": { "open": "08:00", "close": "16:30" },
      "tuesday": { "open": "08:00", "close": "16:30" },
      "sunday": { "open": "08:00", "close": "13:30" }
    }
  },
  "features": {
    "booking": true,
    "gallery": true,
    "blog": true,
    "testimonials": true,
    "multiCurrency": true,
    "whatsappWidget": true
  }
}
```

## API Reference

### Functions

#### `loadClientConfig(tenantSlug, configPath?, useCache?)`

Load and validate client configuration from JSON file.

#### `createTenantResolver(options)`

Create tenant resolver with specified strategy.

#### `validateClientConfig(config)`

Validate configuration against schema (throws on error).

#### `safeValidateClientConfig(config)`

Safely validate configuration (returns result object).

#### `clearConfigCache(tenantSlug?)`

Clear configuration cache.

### Tenant Resolution Strategies

- **subdomain**: Extract from subdomain (e.g., `tenant.platform.com`)
- **domain**: Map custom domains to tenants (e.g., `osdiving.com → ocean-spirit`)
- **env**: Read from environment variable (default: `TENANT_SLUG`)
- **path**: Extract from URL path (e.g., `/clients/tenant/...`)

## Client Onboarding

To onboard a new diving center:

1. Create directory: `server/clients/new-client-slug/`
2. Copy template: `cp server/clients/_template/config.json server/clients/new-client-slug/`
3. Update configuration with client data
4. Create asset folders: `images/team/`, `images/branding/`
5. Run validation: `npm run validate-config new-client-slug`

## License

MIT

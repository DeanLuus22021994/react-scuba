# Client Configuration Template

Template for onboarding new diving centers to the React Scuba multi-tenant platform.

## Quick Setup

1. **Copy template:**

   ```bash
   cp -r server/clients/_template server/clients/your-client-slug
   ```

2. **Update configuration:**
   - Edit `config.json` with client details
   - Generate new UUID for `tenant.id`
   - Update `tenant.slug` to match directory name

3. **Add client assets:**

   ```
   images/
   ├── branding/
   │   ├── logo.png (200x200+, transparent background)
   │   ├── favicon.ico (32x32, 16x16)
   │   └── hero.jpg (1920x1080+)
   └── team/
       └── [member-photos].jpg (800x800 recommended)
   ```

4. **Validate and deploy:**
   ```bash
   npm run validate-config your-client-slug
   ```

## Configuration Guide

### Required Updates

- `tenant.id` - Generate new UUID
- `tenant.slug` - URL-safe identifier (lowercase, hyphens)
- `company.*` - Business information
- `contact.*` - Contact details and address
- `seo.*` - SEO metadata

### Multi-Tenant Features

- Dynamic content loading by subdomain/domain
- Type-safe configuration validation
- Automatic asset path resolution
- Built-in caching and performance optimization

## Asset Guidelines

| Asset Type  | Format | Dimensions   | Notes                       |
| ----------- | ------ | ------------ | --------------------------- |
| Logo        | PNG    | 200x200+     | Transparent background      |
| Hero Image  | JPG    | 1920x1080+   | High quality, web-optimized |
| Favicon     | ICO    | 32x32, 16x16 | Standard web icon           |
| Team Photos | JPG    | 800x800      | Square aspect ratio         |

## Validation

The platform includes built-in Zod validation for all configuration fields. Invalid configurations will be rejected with detailed error messages.

**Reference:** `docs/.copilot/architecture/multi-tenant-concepts.md` for complete implementation details.

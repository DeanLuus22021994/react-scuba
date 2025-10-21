# Environment Variables

<div class="feature-card">

Configure environment variables for API keys, analytics, contact information, and other runtime settings.

</div>

## Overview

React Scuba uses environment variables to configure external services, API endpoints, and application behavior. All environment variables must be prefixed with `VITE_` to be accessible in the browser.

## Required Environment Variables

### Analytics Configuration

```bash
# Google Tag Manager (recommended)
VITE_GTM_ID=GTM-XXXXXXX

# OR Google Analytics 4
VITE_GA4_ID=G-XXXXXXXXXX
```

### Contact Information

```bash
# Business contact details
VITE_PHONE_NUMBER=+230 2634468
VITE_WHATSAPP_NUMBER=+230 5255 2732
VITE_EMAIL=info@osdiving.com
```

## Optional Environment Variables

### API Configuration

```bash
# Backend API endpoint
VITE_API_ENDPOINT=https://api.yourdomain.com

# Exchange rate API key (for currency conversion)
VITE_EXCHANGE_RATE_API_KEY=your_api_key_here
```

### Security & Anti-Spam

```bash
# Google reCAPTCHA site key
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

### Google Calendar Integration

```bash
# For booking system integration
VITE_GOOGLE_CALENDAR_API_KEY=your_calendar_api_key
VITE_GOOGLE_CALENDAR_ID=your_calendar_id@group.calendar.google.com
```

## Environment File Setup

### Development (.env.local)

Create a `.env.local` file in your project root for development:

```bash
# Development environment variables
VITE_GTM_ID=GTM-XXXXXXX
VITE_RECAPTCHA_SITE_KEY=your_dev_site_key
VITE_API_ENDPOINT=http://localhost:5000/api
```

### Production Deployment

Configure environment variables in your deployment platform:

**Vercel:**

```bash
vercel env add VITE_GTM_ID
vercel env add VITE_RECAPTCHA_SITE_KEY
```

**Netlify:**

```bash
netlify env:set VITE_GTM_ID "GTM-XXXXXXX"
netlify env:set VITE_RECAPTCHA_SITE_KEY "your_site_key"
```

**Docker:**

```bash
# docker-compose.yml
environment:
  - VITE_GTM_ID=GTM-XXXXXXX
  - VITE_RECAPTCHA_SITE_KEY=your_site_key
```

## Environment Validation

The application validates environment variables on startup:

```javascript
import { validateEnvVars } from '@/utils/env';

// Validates all environment variables
validateEnvVars();
```

### Validation Rules

- **Email format**: Must be valid email or empty
- **URL format**: Must be valid URL or empty
- **Optional variables**: Logged as warnings if missing
- **Type safety**: All variables are type-checked with Zod

## Development vs Production

### Development Mode

```javascript
import { isDevelopment } from '@/utils/env';

if (isDevelopment()) {
  // Enable debug logging
  // Show development tools
  // Use local API endpoints
}
```

### Production Mode

```javascript
import { isProduction } from '@/utils/env';

if (isProduction()) {
  // Enable analytics tracking
  // Enable error reporting
  // Use production API endpoints
}
```

## Security Considerations

### Client-Side Variables

- All `VITE_` prefixed variables are exposed to the browser
- Never store sensitive data (passwords, private keys) in client-side variables
- Use server-side environment variables for sensitive configuration

### API Keys

- Use restricted API keys with minimal permissions
- Implement proper CORS policies
- Rotate keys regularly
- Monitor API usage

## Environment-Specific Configuration

### Feature Flags

```javascript
// Conditional features based on environment
const features = {
  analytics: !!import.meta.env.VITE_GTM_ID || !!import.meta.env.VITE_GA4_ID,
  recaptcha: !!import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  calendar: !!import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY,
};
```

### API Endpoints

```javascript
import { getApiUrl } from '@/utils/env';

const apiClient = axios.create({
  baseURL: getApiUrl(),
});
```

## Troubleshooting

### Common Issues

**Variables not loading:**

- Ensure variables are prefixed with `VITE_`
- Restart development server after adding variables
- Check for typos in variable names

**Validation errors:**

- Check browser console for validation messages
- Ensure required variables are set
- Verify variable formats (URLs, emails)

**Analytics not working:**

- Verify GTM container is published
- Check GA4 measurement ID format
- Ensure scripts load without CORS errors

### Debug Environment

```javascript
// Log all environment variables (development only)
if (isDevelopment()) {
  console.log('Environment variables:', import.meta.env);
}
```

## Best Practices

### Environment File Management

- Never commit `.env` files to version control
- Use `.env.example` for documentation
- Document required vs optional variables
- Test with missing optional variables

### Deployment Safety

- Use different API keys for each environment
- Implement proper error handling for missing variables
- Monitor application logs for environment warnings
- Regular security audits of environment configuration

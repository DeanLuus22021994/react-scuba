# Environment

The environment utilities provide centralized configuration management, validation, and access to environment variables for the Ocean Spirit Scuba application.

## Environment Variable Validation

### Validate Environment Variables

```javascript
import { validateEnvVars } from '@/utils/env';

// Validate all environment variables on app startup
const isValid = validateEnvVars();

if (!isValid) {
  console.error('Environment configuration is invalid');
  // Handle invalid configuration
}
```

The validation checks for:

- Proper data types and formats
- Required vs optional variables
- Logs warnings for missing recommended variables

### Environment Schema

The system validates against this schema:

```javascript
const envSchema = {
  // Analytics
  VITE_GTM_ID: string?,           // Google Tag Manager ID
  VITE_GA4_ID: string?,           // Google Analytics 4 ID

  // Contact Information
  VITE_PHONE_NUMBER: string?,     // Default: '+230 2634468'
  VITE_WHATSAPP_NUMBER: string?,  // Default: '+230 5255 2732'
  VITE_EMAIL: string?,            // Default: 'info@osdiving.com'

  // API Configuration
  VITE_API_ENDPOINT: url?,        // API base URL
  VITE_EXCHANGE_RATE_API_KEY: string?, // Exchange rate API key

  // Security
  VITE_RECAPTCHA_SITE_KEY: string?, // ReCAPTCHA site key

  // Calendar Integration
  VITE_GOOGLE_CALENDAR_API_KEY: string?, // Google Calendar API key
  VITE_GOOGLE_CALENDAR_ID: string?,      // Calendar email/ID
};
```

## Environment Variable Access

### Get Environment Variable

```javascript
import { getEnvVar } from '@/utils/env';

// Get environment variable with optional default
const apiKey = getEnvVar('VITE_EXCHANGE_RATE_API_KEY');
const apiUrl = getEnvVar('VITE_API_ENDPOINT', 'http://localhost:5000/api');
```

**Parameters:**

- `key` (string): Environment variable name
- `defaultValue` (any): Default value if variable is not set

**Returns:** Environment variable value or default

### Environment Mode Checks

```javascript
import { isProduction, isDevelopment } from '@/utils/env';

if (isProduction()) {
  // Production-specific code
  console.log('Running in production mode');
}

if (isDevelopment()) {
  // Development-specific code
  console.log('Running in development mode');
}
```

## Specialized Getters

### Get API URL

```javascript
import { getApiUrl } from '@/utils/env';

const apiUrl = getApiUrl();
// Returns VITE_API_ENDPOINT or 'http://localhost:5000/api'
```

### Get Calendar Configuration

```javascript
import { getCalendarEmail, getCalendarApiKey } from '@/utils/env';

const calendarId = getCalendarEmail();
const apiKey = getCalendarApiKey();
```

## Environment Configuration

Create a `.env` file in your project root:

```bash
# Analytics
VITE_GTM_ID=GTM-XXXXXXX
VITE_GA4_ID=G-XXXXXXXXXX

# Contact Information
VITE_PHONE_NUMBER=+230 2634468
VITE_WHATSAPP_NUMBER=+230 5255 2732
VITE_EMAIL=info@osdiving.com

# API Configuration
VITE_API_ENDPOINT=https://api.oceanspirit.sc/api
VITE_EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key

# Security
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key

# Calendar Integration (optional)
VITE_GOOGLE_CALENDAR_API_KEY=your_calendar_api_key
VITE_GOOGLE_CALENDAR_ID=calendar@oceanspirit.sc
```

## Validation Warnings

The system logs warnings for missing but recommended variables:

- **Analytics**: Warns if neither GTM_ID nor GA4_ID is configured
- **Security**: Warns if ReCAPTCHA is not configured
- **API**: Warns if API endpoint is not configured (uses default)

## Integration

Environment validation should be called early in your application lifecycle:

```javascript
// main.jsx or App.jsx
import { validateEnvVars } from '@/utils/env';

// Validate environment on app start
validateEnvVars();
```

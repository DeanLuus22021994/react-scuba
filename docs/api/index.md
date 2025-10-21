# API Reference

<div class="feature-card">

Complete reference for all utilities, hooks, services, and data structures in React Scuba.

</div>

## 🛠️ Overview

React Scuba includes a comprehensive set of utilities and helpers designed to handle common tasks in dive center applications.

<div class="metrics">
  <div class="metric">
    <span class="metric-value">10+</span>
    <span class="metric-label">Modules</span>
  </div>
  <div class="metric">
    <span class="metric-value">85%</span>
    <span class="metric-label">Coverage</span>
  </div>
  <div class="metric">
    <span class="metric-value">100%</span>
    <span class="metric-label">Documented</span>
  </div>
</div>

## Quick Links

### Utilities

- **[Analytics](/api/analytics)** - Google Analytics 4 and GTM integration
- **[Currency](/api/currency)** - Multi-currency conversion utilities
- **[Logger](/api/logger)** - Environment-aware logging system
- **[SEO Helpers](/api/seo-helpers)** - Meta tags and structured data
- **[Environment](/api/environment)** - Environment variable validation

### Hooks

- **[useCurrency](/api/use-currency)** - Currency selection and conversion hook

### Services

- **[API Client](/api/client)** - Axios-based API integration service

### Data Structures

- **[Courses](/api/data-courses)** - PADI course catalog data
- **[Dive Sites](/api/data-dive-sites)** - Dive location information
- **[Team Members](/api/data-team)** - Staff profiles and certifications
- **[Gallery](/api/data-gallery)** - Photo gallery organization

## Import Patterns

All utilities use barrel exports for clean imports:

```javascript
// Import utilities
import { logger, initializeAnalytics, convertCurrency } from '@/utils';

// Import hooks
import { useCurrency } from '@/hooks';

// Import services
import { api } from '@/services';

// Import data
import courses from '@/data/courses';
import diveSites from '@/data/diveSites';
```

## Utility Functions Summary

| Module           | Functions                                                | Purpose                |
| ---------------- | -------------------------------------------------------- | ---------------------- |
| **analytics.js** | `initializeAnalytics`, `trackEvent`, `trackPageView`     | GA4/GTM integration    |
| **currency.js**  | `convertCurrency`, `formatCurrency`, `getCurrencySymbol` | Multi-currency support |
| **logger.js**    | `logger.log`, `logger.warn`, `logger.error`              | Development logging    |
| **seo.js**       | `generateMetaTags`, `generateStructuredData`             | SEO optimization       |
| **env.js**       | `validateEnv`                                            | Environment validation |

## Type Definitions

All components and utilities include PropTypes for runtime type checking:

```javascript
import PropTypes from 'prop-types';

// Example utility function with JSDoc
/**
 * Converts amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} from - Source currency code
 * @param {string} to - Target currency code
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, from, to) => {
  // Implementation
};
```

## Error Handling

All utilities include proper error handling:

```javascript
try {
  const result = await api.post('/booking', data);
  logger.log('Booking successful', result);
} catch (error) {
  logger.error('Booking failed', error);
  // Handle error appropriately
}
```

## Next Steps

Explore detailed documentation for each module:

- Start with [Logger](/api/logger) for development utilities
- Check [Analytics](/api/analytics) for tracking implementation
- Review [Currency](/api/currency) for multi-currency features

---

**Module Count:** 10+ • **Coverage:** 85% • **Documentation:** Complete

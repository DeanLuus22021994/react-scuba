# Logger

The logger utility provides consistent, environment-aware logging throughout the Ocean Spirit Scuba application. It automatically adjusts logging levels based on the environment and provides structured logging for debugging and monitoring.

## Log Levels

### Info Logging

```javascript
import logger from '@/utils/logger';

// Log informational messages (development only)
logger.info('Application started successfully');
logger.info('User authenticated:', userId);
logger.info('API request completed', { endpoint: '/api/courses', duration: 250 });
```

**Behavior:** Only logs in development mode, suppressed in production

### Warning Logging

```javascript
import logger from '@/utils/logger';

// Log warning messages
logger.warn('Optional dependency not found, using fallback');
logger.warn('Rate limit approaching', { remaining: 5, resetTime: '2025-01-01T12:00:00Z' });
```

**Behavior:** Logs in development mode, can be configured for production warnings

### Error Logging

```javascript
import logger from '@/utils/logger';

// Log error messages (always logged)
logger.error('API request failed:', error);
logger.error('Database connection lost', { errorCode: 500, timestamp: Date.now() });
```

**Behavior:** Always logs, suitable for error tracking services

### Debug Logging

```javascript
import logger from '@/utils/logger';

// Log debug information (development only)
logger.debug('Component state updated:', { component: 'BookingForm', state: newState });
logger.debug('Cache hit for key:', cacheKey);
```

**Behavior:** Only logs in development mode, useful for detailed debugging

## Environment Behavior

### Development Mode

- **Info**: ✅ Logged to console
- **Warn**: ✅ Logged to console
- **Error**: ✅ Logged to console
- **Debug**: ✅ Logged to console

### Production Mode

- **Info**: ❌ Suppressed
- **Warn**: ⚠️ Can be configured (default: suppressed)
- **Error**: ✅ Always logged (can be sent to error tracking service)
- **Debug**: ❌ Suppressed

## Usage Patterns

### API Error Handling

```javascript
import logger from '@/utils/logger';

try {
  const response = await api.get('/courses');
  logger.info('Courses fetched successfully', { count: response.data.length });
} catch (error) {
  logger.error('Failed to fetch courses:', error);
  // Handle error in UI
}
```

### Component Lifecycle

```javascript
import { useEffect } from 'react';
import logger from '@/utils/logger';

function BookingForm() {
  useEffect(() => {
    logger.debug('BookingForm mounted');
    return () => {
      logger.debug('BookingForm unmounted');
    };
  }, []);

  const handleSubmit = async (formData) => {
    logger.info('Processing booking submission');
    try {
      // Submit logic
      logger.info('Booking submitted successfully');
    } catch (error) {
      logger.error('Booking submission failed:', error);
    }
  };

  return (
    // Component JSX
  );
}
```

### Analytics Integration

```javascript
import logger from '@/utils/logger';

export const trackConversion = (eventName, params) => {
  logger.debug('Tracking conversion:', eventName, params);

  try {
    // Analytics tracking logic
    logger.info('Conversion tracked successfully:', eventName);
  } catch (error) {
    logger.error('Failed to track conversion:', eventName, error);
  }
};
```

## Integration with Error Boundaries

```javascript
import React from 'react';
import logger from '@/utils/logger';

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logger.error('React Error Boundary caught an error:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    // Error boundary implementation
  }
}
```

## Production Configuration

In production environments, consider integrating with error tracking services:

```javascript
// logger.js (production enhancement)
import * as Sentry from '@sentry/react';

const logger = {
  // ... existing methods

  error: (...args) => {
    console.error('[ERROR]', ...args);

    // Send to error tracking service
    if (import.meta.env.PROD) {
      Sentry.captureException(args[0], {
        extra: args.slice(1),
      });
    }
  },
};
```

## Best Practices

1. **Use appropriate log levels**: Info for general flow, warn for potential issues, error for failures
2. **Include context**: Add relevant data to help with debugging
3. **Avoid sensitive data**: Never log passwords, tokens, or personal information
4. **Performance**: Debug/info logs are suppressed in production for performance
5. **Structured logging**: Use objects for complex data to enable better searching

## Related

- [API Reference](/api/)

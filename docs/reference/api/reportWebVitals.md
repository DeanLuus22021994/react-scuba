# Report Web Vitals

The report web vitals utility provides performance monitoring and Core Web Vitals tracking for the Ocean Spirit Scuba website, integrated with Google Analytics 4.

## Overview

Web Vitals are a set of metrics that measure the quality of user experience on web pages. This utility uses the `web-vitals` library to track and report these metrics.

## Core Web Vitals Metrics

### Cumulative Layout Shift (CLS)

Measures visual stability by quantifying unexpected layout shifts during page load.

### First Input Delay (FID)

Measures interactivity by quantifying the delay between user input and browser response.

### First Contentful Paint (FCP)

Measures loading performance by marking when the first text or image is painted.

### Largest Contentful Paint (LCP)

Measures loading performance by marking when the largest content element is painted.

### Time to First Byte (TTFB)

Measures server responsiveness by quantifying the time between request and first byte received.

## Basic Usage

### Report to Custom Function

```javascript
import reportWebVitals from '@/utils/reportWebVitals';

// Report vitals to custom analytics function
reportWebVitals((metric) => {
  console.log(metric.name, metric.value);
  // Send to your analytics service
});
```

**Parameters:**

- `onPerfEntry` (function): Callback function that receives performance metrics

### Report to GA4

```javascript
import { reportWebVitalsToGA4 } from '@/utils/reportWebVitals';

// Automatically send all web vitals to Google Analytics 4
reportWebVitalsToGA4();
```

## Metric Object Structure

Each metric passed to the callback contains:

```javascript
{
  name: 'CLS',           // Metric name
  value: 0.05,           // Metric value
  id: 'v3-123456789',    // Unique metric ID
  delta: 0.05            // Change from previous value
}
```

## React Integration

### In index.js (Create React App)

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { reportWebVitalsToGA4 } from '@/utils/reportWebVitals';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// Report web vitals to GA4
reportWebVitalsToGA4();
```

### In main.jsx (Vite)

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { reportWebVitalsToGA4 } from '@/utils/reportWebVitals';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

// Report web vitals after app initialization
reportWebVitalsToGA4();
```

## Custom Analytics Integration

### Send to Multiple Services

```javascript
import reportWebVitals from '@/utils/reportWebVitals';

const sendToAnalytics = (metric) => {
  // Send to Google Analytics
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.value * 1000), // Convert to milliseconds
    custom_map: { metric_value: metric.value },
  });

  // Send to custom analytics service
  fetch('/reference/api/analytics/web-vitals', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: { 'Content-Type': 'application/json' },
  });
};

reportWebVitals(sendToAnalytics);
```

### Conditional Reporting

```javascript
import reportWebVitals from '@/utils/reportWebVitals';

reportWebVitals((metric) => {
  // Only report in production
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics
  }

  // Log all metrics in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }
});
```

## GA4 Integration Details

The `sendWebVitalsToGA4` function automatically:

1. Formats metrics for GA4 event structure
2. Includes metric values in milliseconds where appropriate
3. Uses custom parameters for detailed tracking
4. Handles different metric types appropriately

### GA4 Event Structure

```javascript
// Example GA4 event sent for LCP metric
gtag('event', 'LCP', {
  event_category: 'Web Vitals',
  event_label: 'v3-123456789',
  value: 2500, // LCP value in milliseconds
  custom_map: {
    metric_value: 2.5,
    metric_delta: 0.1,
  },
});
```

## Performance Thresholds

Recommended thresholds for good user experience:

- **CLS**: < 0.1 (good), < 0.25 (needs improvement)
- **FID**: < 100ms (good), < 300ms (needs improvement)
- **FCP**: < 1800ms (good), < 3000ms (needs improvement)
- **LCP**: < 2500ms (good), < 4000ms (needs improvement)
- **TTFB**: < 800ms (good), < 1800ms (needs improvement)

## Error Handling

The utility includes built-in error handling:

```javascript
// Graceful degradation if web-vitals library fails to load
reportWebVitals((metric) => {
  // This callback will not be called if web-vitals fails to import
});
```

## Browser Support

- Modern browsers supporting Performance Observer API
- Graceful degradation for unsupported browsers
- No metrics reported if web-vitals library unavailable

## Dependencies

- `web-vitals`: Core Web Vitals measurement library
- Analytics utilities for GA4 integration

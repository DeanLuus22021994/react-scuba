# Analytics Deployment

Configure Google Analytics 4 (GA4) and other analytics tools for tracking user behavior and application performance.

## Google Analytics 4 Setup

### Prerequisites

- Google Analytics account
- GA4 property created
- Measurement ID obtained

### Implementation

1. **Install Analytics Package**

```bash
npm install @vercel/analytics
```

2. **Configure in Application**

```jsx
// src/index.jsx
import { Analytics } from '@vercel/analytics/react';

root.render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
```

3. **Environment Variables**

Set the following environment variables in your deployment platform:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Event Tracking

Track custom events for user interactions:

```javascript
// src/utils/analytics.js
import { track } from '@vercel/analytics';

export const trackEvent = (eventName, properties = {}) => {
  track(eventName, properties);
};

// Usage examples
trackEvent('course_booking_started', { courseId: 'padi-owd' });
trackEvent('contact_form_submitted', { formType: 'general' });
trackEvent('dive_site_viewed', { siteId: 'nusa-penida' });
```

## Performance Monitoring

### Core Web Vitals

Monitor loading performance, interactivity, and visual stability:

```javascript
// src/utils/reportWebVitals.js
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
```

### Custom Performance Metrics

Track application-specific performance metrics:

```javascript
// Track page load times
const trackPageLoad = () => {
  const loadTime = performance.now();
  trackEvent('page_load', {
    loadTime: Math.round(loadTime),
    page: window.location.pathname,
  });
};

// Track API response times
export const trackApiCall = async (apiName, apiCall) => {
  const startTime = performance.now();
  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;
    trackEvent('api_call_success', {
      apiName,
      duration: Math.round(duration),
    });
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    trackEvent('api_call_error', {
      apiName,
      duration: Math.round(duration),
      error: error.message,
    });
    throw error;
  }
};
```

## Conversion Tracking

### Booking Conversions

Track successful bookings and revenue:

```javascript
// Track course bookings
export const trackCourseBooking = (courseId, price, currency = 'USD') => {
  trackEvent('purchase', {
    currency,
    value: price,
    items: [
      {
        item_id: courseId,
        item_name: courseId,
        price: price,
        quantity: 1,
      },
    ],
  });
};

// Track contact form conversions
export const trackContactConversion = (formType) => {
  trackEvent('contact_conversion', {
    form_type: formType,
    lead_source: 'website',
  });
};
```

## User Behavior Analysis

### Scroll Depth Tracking

Monitor how far users scroll on pages:

```javascript
// src/hooks/useScrollTracking.js
import { useEffect } from 'react';
import { trackEvent } from '../utils/analytics';

export const useScrollTracking = () => {
  useEffect(() => {
    let maxScroll = 0;

    const handleScroll = () => {
      const scrolled =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      const scrollDepth = Math.round(scrolled / 25) * 25; // Track in 25% increments

      if (scrollDepth > maxScroll && scrollDepth <= 100) {
        maxScroll = scrollDepth;
        trackEvent('scroll_depth', {
          depth: scrollDepth,
          page: window.location.pathname,
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};
```

### Time on Page

Track user engagement duration:

```javascript
// src/hooks/usePageTracking.js
import { useEffect } from 'react';
import { trackEvent } from '../utils/analytics';

export const usePageTracking = () => {
  useEffect(() => {
    const startTime = Date.now();

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent('time_on_page', {
        duration: timeSpent,
        page: window.location.pathname,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
};
```

## Privacy & Compliance

### GDPR Compliance

Implement consent management for EU users:

```javascript
// src/utils/consent.js
export const checkConsent = () => {
  return localStorage.getItem('analytics-consent') === 'true';
};

export const setConsent = (granted) => {
  localStorage.setItem('analytics-consent', granted.toString());
  if (granted) {
    // Enable analytics
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
    });
  }
};
```

### Data Retention

Configure data retention settings in Google Analytics:

1. Go to Admin → Data Settings → Data Retention
2. Set retention period (default: 26 months)
3. Configure reset on new activity

## Testing & Validation

### Analytics Debug Mode

Enable debug mode during development:

```javascript
// src/utils/analytics.js
const isDevelopment = import.meta.env.DEV;

export const initAnalytics = () => {
  if (isDevelopment) {
    // Enable debug mode
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      debug_mode: true,
    });
  }
};
```

### Real-time Reports

Monitor real-time data in Google Analytics:

1. Go to Reports → Real-time
2. Check active users and events
3. Verify event parameters are correct

## Troubleshooting

### Events Not Appearing

**Check console for errors:**

```javascript
// Debug event firing
window.gtag('event', 'test_event', {
  debug_mode: true,
});
```

**Verify measurement ID:**

- Check environment variables are set correctly
- Ensure ID starts with "G-"

### Inaccurate Data

**Filter internal traffic:**

- Create an internal traffic filter in GA4
- Use IP address ranges to exclude office traffic

**Set up proper attribution:**

- Configure conversion attribution models
- Set up cross-domain tracking if needed

## Integration with Other Tools

### Google Tag Manager

Use GTM for advanced tracking without code changes:

```javascript
// Load GTM
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-XXXXXXX');
```

### Third-party Analytics

Integrate additional analytics platforms:

```javascript
// Hotjar
if (import.meta.env.VITE_HOTJAR_ID) {
  (function (h, o, t, j, a, r) {
    h.hj =
      h.hj ||
      function () {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
    h._hjSettings = { hjid: import.meta.env.VITE_HOTJAR_ID, hjsv: 6 };
    a = o.getElementsByTagName('head')[0];
    r = o.createElement('script');
    r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
}
```

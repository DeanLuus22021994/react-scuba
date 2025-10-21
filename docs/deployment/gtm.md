# Google Tag Manager Deployment

Configure Google Tag Manager (GTM) for advanced tracking, event management, and marketing pixel integration in your SCUBA Bali application.

## Overview

Google Tag Manager provides:

- Centralized tag management without code changes
- Advanced event tracking and conversion measurement
- Integration with Google Analytics, Facebook Pixel, and other marketing tools
- Version control and testing environments
- Custom triggers and variables for complex tracking

## Prerequisites

- Google Analytics 4 property
- Google Tag Manager account and container
- Basic understanding of tagging concepts

## Quick Setup

### 1. Create GTM Container

1. **Go to Google Tag Manager**
2. **Create new container**
   - Container name: "SCUBA Bali Production"
   - Target platform: Web
   - Click "Create"

3. **Get container code**

```html
<!-- Google Tag Manager -->
<script>
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
</script>
<!-- End Google Tag Manager -->
```

### 2. Install in Application

```javascript
// src/utils/gtm.js
export const initGTM = (gtmId) => {
  if (!gtmId || typeof window === 'undefined') return;

  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', gtmId);
};

// src/index.jsx
import { initGTM } from './utils/gtm';

if (import.meta.env.PROD) {
  initGTM(import.meta.env.VITE_GTM_ID);
}
```

### 3. Environment Variables

Add to your deployment platform:

```bash
VITE_GTM_ID=GTM-XXXXXXX
```

## Core Configuration

### Google Analytics 4 Setup

1. **Create GA4 Configuration Tag**
   - Tag Type: Google Analytics → GA4 Configuration
   - Measurement ID: `{{GA4 Measurement ID}}`
   - Trigger: All Pages

2. **Set up GA4 Measurement ID Variable**
   - Variable Type: Constant
   - Value: Your GA4 Measurement ID (G-XXXXXXXXXX)

### Basic Event Tracking

#### Page Views (Automatic)

GA4 Configuration tag automatically tracks page views.

#### Custom Events

**Button Clicks:**

```javascript
// src/components/Button.jsx
const handleClick = (buttonName) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'button_click',
    button_name: buttonName,
    page_location: window.location.href,
  });
};
```

**Form Submissions:**

```javascript
// src/components/ContactForm.jsx
const handleSubmit = (formData) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'form_submit',
    form_type: 'contact',
    form_data: {
      name: formData.name,
      email: formData.email,
    },
  });
};
```

## Advanced Tracking

### E-commerce Tracking

**Course Bookings:**

```javascript
// Track course booking initiation
const trackBookingStart = (course) => {
  window.dataLayer.push({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'USD',
      value: course.price,
      items: [
        {
          item_id: course.id,
          item_name: course.name,
          category: 'course',
          price: course.price,
          quantity: 1,
        },
      ],
    },
  });
};

// Track booking completion
const trackBookingComplete = (booking) => {
  window.dataLayer.push({
    event: 'purchase',
    ecommerce: {
      transaction_id: booking.id,
      currency: 'USD',
      value: booking.total,
      tax: booking.tax,
      shipping: booking.shipping,
      items: booking.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
      })),
    },
  });
};
```

### User Engagement Tracking

**Scroll Depth:**

```javascript
// src/hooks/useScrollTracking.js
import { useEffect } from 'react';

export const useScrollTracking = () => {
  useEffect(() => {
    let maxScroll = 0;

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        window.dataLayer.push({
          event: 'scroll_depth',
          scroll_depth: scrollPercent,
          page_path: window.location.pathname,
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};
```

**Time on Page:**

```javascript
// src/hooks/useTimeTracking.js
import { useEffect } from 'react';

export const useTimeTracking = () => {
  useEffect(() => {
    const startTime = Date.now();

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      window.dataLayer.push({
        event: 'time_on_page',
        time_spent: timeSpent,
        page_path: window.location.pathname,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
};
```

### Error Tracking

**JavaScript Errors:**

```javascript
// src/utils/errorTracking.js
export const initErrorTracking = () => {
  window.addEventListener('error', (event) => {
    window.dataLayer.push({
      event: 'javascript_error',
      error_message: event.message,
      error_filename: event.filename,
      error_lineno: event.lineno,
      error_colno: event.colno,
      page_url: window.location.href,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    window.dataLayer.push({
      event: 'javascript_error',
      error_message: event.reason?.message || 'Unhandled promise rejection',
      error_type: 'promise_rejection',
      page_url: window.location.href,
    });
  });
};
```

## Marketing Pixel Integration

### Facebook Pixel

1. **Create Facebook Pixel Tag**
   - Tag Type: Custom HTML
   - HTML content:

```html
<!-- Facebook Pixel Code -->
<script>
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '{{Facebook Pixel ID}}');
  fbq('track', 'PageView');
</script>
<!-- End Facebook Pixel Code -->
```

2. **Set up Facebook Pixel ID Variable**
   - Variable Type: Constant
   - Value: Your Facebook Pixel ID

### Conversion Tracking

**Lead Generation:**

```javascript
// Track contact form submissions
const trackLead = (formData) => {
  window.dataLayer.push({
    event: 'generate_lead',
    lead_type: 'contact_form',
    lead_value: formData.email,
  });
};
```

## Custom Triggers and Variables

### Custom Triggers

**Element Visibility Trigger:**

- Trigger Type: Element Visibility
- Selection Method: CSS Selector
- Element Selector: `.course-card`
- Minimum Percent Visible: 50

**Scroll Depth Trigger:**

- Trigger Type: Scroll Depth
- Vertical Scroll Depths: 25, 50, 75, 90
- Enable Vertical Scroll Depths

### Custom Variables

**Data Layer Variable:**

- Variable Type: Data Layer Variable
- Data Layer Variable Name: `button_name`

**JavaScript Variable:**

- Variable Type: Custom JavaScript
- Custom JavaScript:

```javascript
function() {
  return window.location.pathname + window.location.search;
}
```

## Testing and Debugging

### GTM Debug Mode

1. **Enable Preview Mode**
   - Click "Preview" in GTM dashboard
   - Enter your website URL
   - Click "Connect"

2. **Debug Console**
   - Check fired tags
   - Verify data layer values
   - Test triggers and variables

### Data Layer Inspection

```javascript
// Debug data layer in browser console
console.log('Data Layer:', window.dataLayer);

// Monitor data layer changes
window.dataLayer = window.dataLayer || [];
const originalPush = window.dataLayer.push;
window.dataLayer.push = function () {
  console.log('Data Layer Push:', arguments);
  return originalPush.apply(this, arguments);
};
```

## Privacy and Compliance

### Consent Management

**GDPR Compliance:**

```javascript
// src/utils/consent.js
export const checkConsent = () => {
  return localStorage.getItem('gtm-consent') === 'granted';
};

export const grantConsent = () => {
  localStorage.setItem('gtm-consent', 'granted');
  // Enable GTM
  initGTM(import.meta.env.VITE_GTM_ID);
};

export const revokeConsent = () => {
  localStorage.removeItem('gtm-consent');
  // Disable GTM and clear data layer
  window.dataLayer = [];
};
```

### Cookie Consent Integration

**Cookie Banner Integration:**

```javascript
// src/components/CookieBanner.jsx
const acceptCookies = () => {
  grantConsent();
  window.dataLayer.push({
    event: 'consent_granted',
    consent_type: 'marketing',
  });
};
```

## Advanced Features

### Server-Side Tagging

**Benefits:**

- Improved privacy and security
- Better performance
- More reliable tracking

**Setup:**

1. Enable Server-Side Tagging in GTM
2. Deploy GTM Server Container to Cloud Run
3. Configure client-side container to send data to server

### Custom Templates

**Create Custom Tag Templates:**

1. Go to Templates → Tag Templates
2. Click "New"
3. Define template fields and permissions
4. Import community templates or create custom ones

### Container Versions

**Version Management:**

- Create versions for major changes
- Use workspaces for team collaboration
- Implement approval workflows for production deployments

## Monitoring and Maintenance

### Tag Performance

**Monitor Tag Firing:**

- Use GTM's built-in tag assistant
- Check Real-time reports in GA4
- Monitor for tag failures and errors

### Regular Audits

**Monthly Checks:**

- Review fired tags and triggers
- Update deprecated tags
- Clean up unused variables
- Verify conversion tracking

### Documentation

**Maintain Tag Documentation:**

- Document all tags, triggers, and variables
- Keep change logs for major updates
- Document custom event specifications

## Troubleshooting

### Common Issues

**Tags Not Firing:**

- Check trigger conditions
- Verify data layer variable names
- Test in preview mode

**Data Layer Undefined:**

```javascript
// Ensure data layer is initialized
window.dataLayer = window.dataLayer || [];
```

**Consent Issues:**

- Check consent management implementation
- Verify GTM consent settings
- Test with consent disabled

### Performance Issues

**Tag Loading Impact:**

- Use lazy loading for non-critical tags
- Implement tag sequencing
- Monitor Core Web Vitals impact

**Debug Performance:**

```javascript
// Measure tag loading time
const startTime = performance.now();
// ... tag initialization ...
const loadTime = performance.now() - startTime;
console.log('Tag load time:', loadTime);
```

## Integration Examples

### React Router Integration

```javascript
// src/utils/gtm.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    window.dataLayer.push({
      event: 'page_view',
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location]);
};
```

### Form Analytics

```javascript
// src/components/FormAnalytics.jsx
import { useState } from 'react';

export const useFormAnalytics = (formType) => {
  const [startTime, setStartTime] = useState(Date.now());

  const trackFormStart = () => {
    setStartTime(Date.now());
    window.dataLayer.push({
      event: 'form_start',
      form_type: formType,
    });
  };

  const trackFormSubmit = (success = true) => {
    const duration = Date.now() - startTime;
    window.dataLayer.push({
      event: 'form_submit',
      form_type: formType,
      form_duration: duration,
      form_success: success,
    });
  };

  return { trackFormStart, trackFormSubmit };
};
```

## Best Practices

### Organization

- Use consistent naming conventions
- Group related tags, triggers, and variables
- Document complex setups
- Use folders for organization

### Performance

- Minimize tag firing on every page
- Use efficient triggers
- Implement proper caching
- Monitor tag impact on page load

### Security

- Never expose sensitive data in data layer
- Use secure parameters for custom templates
- Regularly audit tag permissions
- Implement proper consent management

### Testing

- Always test in preview mode
- Use Google Analytics DebugView
- Test on multiple devices and browsers
- Validate data in real-time reports

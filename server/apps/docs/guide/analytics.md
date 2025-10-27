# Analytics

<div class="feature-card">

Comprehensive analytics implementation using Google Analytics 4 (GA4) and Google Tag Manager (GTM) for tracking user interactions, conversions, and performance metrics.

</div>

## Overview

React Scuba implements a robust analytics system that tracks user behavior, conversions, and performance metrics using **Google Analytics 4 (GA4)** and **Google Tag Manager (GTM)**. The system provides detailed insights into user engagement and business metrics.

## Architecture

### Analytics Providers

The application integrates with two Google Analytics platforms:

#### Google Analytics 4 (GA4)

- **Purpose**: Comprehensive event tracking and user journey analysis
- **Library**: `react-ga4` for React integration
- **Configuration**: Environment variable `VITE_GA4_ID`

#### Google Tag Manager (GTM)

- **Purpose**: Tag management and advanced tracking configurations
- **Library**: `react-gtm-module` for React integration
- **Configuration**: Environment variable `VITE_GTM_ID`

### Initialization Process

Analytics are initialized during application startup:

```javascript
// Initialize both GA4 and GTM
initializeGA4();
initializeGTM();
```

Both services require environment variables to be configured. If missing, the system logs warnings but continues to function without analytics.

## Event Tracking

### Page View Tracking

Automatic page view tracking for all route changes:

```javascript
trackPageView(path, title);
```

This sends page view events to both GA4 and GTM dataLayer.

### Conversion Events

The system tracks various conversion events critical to business goals:

#### Contact Events

```javascript
// Contact form submissions
trackContactSubmit(source, inquiryType);

// Phone number clicks
trackPhoneClick(source);

// Email address clicks
trackEmailClick(source);

// WhatsApp contact clicks
trackWhatsAppClick(source, messageType);
```

#### Course & Booking Events

```javascript
// Course inquiries
trackCourseInquiry(courseName, coursePrice, currency);

// Booking requests
trackBookingRequest(bookingType, value, currency);

// Calendar booking completions
trackCalendarBookingComplete(bookingType, value, currency, date);
```

#### Form Events

```javascript
// Form interaction tracking
trackFormStart(formName, source);
trackFormAbandon(formName, source, completionPercentage);
trackFormComplete(formName, source);
```

#### Utility Events

```javascript
// Currency changes
trackCurrencyChange(fromCurrency, toCurrency);
```

## Data Layer Integration

### GTM Data Layer

All events are pushed to the GTM dataLayer for advanced tracking:

```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: eventName,
  ...eventParams,
});
```

### Event Parameters

Events include relevant business context:

```javascript
// Example event structure
{
  event: 'course_inquiry',
  course_name: 'PADI Open Water Diver',
  course_price: 450,
  currency: 'USD',
  conversion_label: 'course_interest'
}
```

## Performance Monitoring

### Web Vitals Tracking

Core Web Vitals are automatically tracked and sent to GA4:

```javascript
sendWebVitalsToGA4({ name, delta, id });
```

Tracks:

- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)

### Implementation Details

Web Vitals are integrated through `reportWebVitals.js` and sent as non-interactive events to avoid affecting bounce rate calculations.

## Configuration

### Environment Variables

Required environment variables for analytics:

```bash
# Google Analytics 4
VITE_GA4_ID=GA-XXXXXXXXXX

# Google Tag Manager
VITE_GTM_ID=GTM-XXXXXXX
```

### Privacy & Compliance

- **GDPR Compliance**: Analytics only load with user consent
- **Cookie Management**: Respects browser privacy settings
- **Data Minimization**: Only collects necessary business metrics

## Event Categories

### Business Conversions

- Contact form submissions
- Course inquiries
- Booking requests
- Calendar bookings
- Phone/email/WhatsApp contacts

### User Interactions

- Form starts and completions
- Form abandonment tracking
- Currency preference changes
- Navigation patterns

### Performance Metrics

- Page load times
- Core Web Vitals
- User engagement metrics

## Implementation Guide

### Adding New Events

To add a new conversion event:

1. **Define the event function** in `analytics.js`:

```javascript
export const trackNewEvent = (param1, param2) => {
  trackConversion('new_event_name', {
    param1: param1,
    param2: param2,
    conversion_label: 'event_category',
  });
};
```

2. **Export from index** in `utils/index.js`

3. **Import and use** in components:

```javascript
import { trackNewEvent } from '@/utils/analytics';

const handleAction = () => {
  trackNewEvent(value1, value2);
};
```

### GTM Triggers & Tags

Configure corresponding GTM triggers for new events:

- **Trigger**: Custom Event - `new_event_name`
- **Tag**: GA4 Event - `new_event_name`
- **Parameters**: Map dataLayer variables to GA4 parameters

## Reporting & Analysis

### Key Metrics

Monitor these critical business metrics:

#### Conversion Funnel

1. **Awareness**: Page views, session duration
2. **Interest**: Course inquiries, booking requests
3. **Action**: Contact form submissions, phone calls
4. **Revenue**: Completed bookings, course enrollments

#### User Behavior

- **Top Pages**: Most visited content
- **User Flow**: Navigation patterns
- **Device/Mobile Usage**: Responsive design effectiveness
- **Geographic Distribution**: Target market analysis

### Custom Reports

Create custom reports for:

- **Course Performance**: Which courses generate most interest
- **Lead Sources**: Which pages/channels drive conversions
- **Booking Types**: Most popular services
- **Contact Methods**: Preferred communication channels

## Debugging & Testing

### Development Mode

Analytics are disabled in development by default. To test:

1. **Check console logs** for initialization messages
2. **Use GA4 Debug Mode** in browser developer tools
3. **Monitor dataLayer** in browser console

### Validation

Verify event tracking:

```javascript
// Check if analytics are initialized
console.log('GA4 initialized:', !!window.gtag);
console.log('GTM loaded:', !!window.dataLayer);

// Monitor dataLayer pushes
window.dataLayer.push({ event: 'test_event' });
```

## Best Practices

### Event Naming

- Use **snake_case** for event names
- Include **conversion_label** for categorization
- Keep event names **consistent** across platforms

### Data Quality

- **Validate parameters** before sending
- **Handle errors gracefully** (don't break user experience)
- **Minimize payload size** for performance

### Privacy Considerations

- **Obtain consent** before tracking
- **Anonymize data** where possible
- **Document data collection** practices

### Performance Impact

- **Lazy load** analytics scripts
- **Batch events** when possible
- **Monitor bundle size** impact

## Troubleshooting

### Common Issues

#### Analytics Not Loading

- Check environment variables are set
- Verify network connectivity to Google servers
- Check browser console for errors

#### Events Not Tracking

- Confirm event names match GTM triggers
- Check parameter formatting
- Verify GA4 property configuration

#### Performance Impact

- Monitor Core Web Vitals regression
- Check bundle size increase
- Review event frequency

### Support Resources

- **GA4 Documentation**: https://developers.google.com/analytics/devguides/collection/ga4
- **GTM Documentation**: https://developers.google.com/tag-manager
- **React GA4 Library**: https://github.com/codler/react-ga4

This analytics implementation provides comprehensive insights into user behavior and business performance while maintaining privacy compliance and optimal performance.

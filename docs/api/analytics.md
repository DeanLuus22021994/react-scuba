# Analytics

The analytics utilities provide comprehensive tracking for user interactions, conversions, and performance metrics using Google Analytics 4 (GA4) and Google Tag Manager (GTM).

## Initialization

### Google Tag Manager

```javascript
import { initializeGTM } from '@/utils/analytics';

// Initialize GTM on app startup
initializeGTM();
```

**Environment Variable:** `VITE_GTM_ID` - Your GTM container ID

### Google Analytics 4

```javascript
import { initializeGA4 } from '@/utils/analytics';

// Initialize GA4 on app startup
initializeGA4();
```

**Environment Variable:** `VITE_GA4_ID` - Your GA4 measurement ID

## Page Tracking

### Track Page Views

```javascript
import { trackPageView } from '@/utils/analytics';

// Track page view with custom path and title
trackPageView('/courses/padi-open-water', 'PADI Open Water Course');
```

**Parameters:**

- `path` (string): Page path
- `title` (string): Page title

## Conversion Tracking

### Generic Conversion Event

```javascript
import { trackConversion } from '@/utils/analytics';

// Track custom conversion event
trackConversion('button_click', {
  button_name: 'hero_cta',
  page_location: 'home',
  value: 1,
});
```

**Parameters:**

- `eventName` (string): Event name
- `eventParams` (object): Additional event parameters

### Contact Form Submission

```javascript
import { trackContactSubmit } from '@/utils/analytics';

// Track contact form submission
trackContactSubmit('hero_section', 'general_inquiry');
```

**Parameters:**

- `source` (string): Where the contact form was submitted from
- `inquiryType` (string): Type of inquiry (general, course, booking, etc.)

### Course Inquiry

```javascript
import { trackCourseInquiry } from '@/utils/analytics';

// Track course interest
trackCourseInquiry('PADI Open Water', 450, 'USD');
```

**Parameters:**

- `courseName` (string): Name of the course
- `coursePrice` (number): Course price
- `currency` (string): Currency code (USD, EUR, MUR, etc.)

### Booking Request

```javascript
import { trackBookingRequest } from '@/utils/analytics';

// Track booking inquiry
trackBookingRequest('dive_trip', 250, 'USD');
```

**Parameters:**

- `bookingType` (string): Type of booking (dive_trip, course, etc.)
- `value` (number): Booking value
- `currency` (string): Currency code

### Calendar Booking Completion

```javascript
import { trackCalendarBookingComplete } from '@/utils/analytics';

// Track completed booking
trackCalendarBookingComplete('course', 450, 'USD', '2025-12-01');
```

**Parameters:**

- `bookingType` (string): Type of booking
- `value` (number): Booking value
- `currency` (string): Currency code
- `date` (string): Booking date (YYYY-MM-DD)

### Contact Method Clicks

```javascript
import { trackPhoneClick, trackEmailClick, trackWhatsAppClick } from '@/utils/analytics';

// Track phone number click
trackPhoneClick('footer');

// Track email link click
trackEmailClick('contact_page');

// Track WhatsApp click
trackWhatsAppClick('hero_section', 'booking_inquiry');
```

### Currency Change

```javascript
import { trackCurrencyChange } from '@/utils/analytics';

// Track currency selector usage
trackCurrencyChange('USD', 'EUR');
```

**Parameters:**

- `fromCurrency` (string): Original currency
- `toCurrency` (string): New currency

### Form Analytics

```javascript
import { trackFormStart, trackFormAbandon, trackFormComplete } from '@/utils/analytics';

// Track form interaction start
trackFormStart('booking_form', 'courses_page');

// Track form abandonment
trackFormAbandon('contact_form', 'home_page', 60); // 60% complete

// Track form completion
trackFormComplete('newsletter_signup', 'footer');
```

## Performance Tracking

### Web Vitals

```javascript
import { sendWebVitalsToGA4 } from '@/utils/analytics';

// Send Core Web Vitals to GA4 (automatically handled by reportWebVitals)
sendWebVitalsToGA4({
  name: 'LCP',
  delta: 2500,
  id: 'v3-1234567890',
});
```

**Parameters:**

- `name` (string): Web Vital name (LCP, FID, CLS, etc.)
- `delta` (number): Metric value
- `id` (string): Unique identifier

## Event Categories

The analytics system tracks the following conversion categories:

- **Contact Events**: `contact_submit`, `phone_click`, `email_click`, `whatsapp_click`
- **Booking Events**: `booking_request`, `calendar_booking_complete`
- **Course Events**: `course_inquiry`
- **Form Events**: `form_start`, `form_abandon`, `form_complete`
- **Utility Events**: `currency_change`

## Environment Configuration

Set the following environment variables:

```bash
# .env
VITE_GTM_ID=GTM-XXXXXXX
VITE_GA4_ID=G-XXXXXXXXXX
```

## Integration

Analytics are automatically integrated throughout the application:

- Page views are tracked on route changes
- Form submissions trigger conversion events
- User interactions (clicks, currency changes) are tracked
- Web vitals are sent to GA4 for performance monitoring

## Related

- [API Reference](/api/)
- [Guide](/guide/analytics.md)

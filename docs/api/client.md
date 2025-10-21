# API Client

The API client provides a centralized interface for communicating with the Ocean Spirit Scuba backend services. It handles HTTP requests, error management, and response formatting.

## Configuration

The API client is configured with:

- Base URL: `VITE_API_ENDPOINT` environment variable (defaults to `http://localhost:5000/api`)
- Timeout: 15 seconds
- Default headers: `Content-Type: application/json`

## Available Methods

### Contact Form

```javascript
import { submitContactForm } from '@/services/api';

// Submit contact form data
const result = await submitContactForm({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Inquiry about diving courses',
  phone: '+230 123 4567',
});

if (result.success) {
  console.log('Contact form submitted successfully');
} else {
  console.error('Submission failed:', result.error);
}
```

**Parameters:**

- `data` (Object): Contact form data containing name, email, message, and phone

**Returns:** Promise resolving to `{ success: boolean, data?: any, error?: any }`

### Booking Inquiry

```javascript
import { submitBookingInquiry } from '@/services/api';

// Submit booking inquiry
const result = await submitBookingInquiry({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+230 123 4567',
  courseType: 'PADI Open Water',
  preferredDate: '2025-12-01',
  participants: 2,
  experience: 'beginner',
  message: 'Additional requirements',
});

if (result.success) {
  console.log('Booking inquiry submitted successfully');
} else {
  console.error('Submission failed:', result.error);
}
```

**Parameters:**

- `data` (Object): Booking inquiry data with course details and participant information

**Returns:** Promise resolving to `{ success: boolean, data?: any, error?: any }`

### Calendar Availability

```javascript
import { checkCalendarAvailability } from '@/services/api';

// Check availability for a specific date and course
const result = await checkCalendarAvailability('2025-12-01', 'padi-open-water');

if (result.success) {
  console.log('Available slots:', result.data.slots);
} else {
  console.error('Availability check failed:', result.error);
}
```

**Parameters:**

- `date` (string): ISO date string (YYYY-MM-DD)
- `courseId` (string): Course or dive type identifier

**Returns:** Promise resolving to `{ success: boolean, data?: any, error?: any }`

### Calendar Booking

```javascript
import { createCalendarBooking } from '@/services/api';

// Create a calendar booking
const result = await createCalendarBooking({
  courseId: 'padi-open-water',
  date: '2025-12-01',
  timeSlot: '09:00',
  participants: 2,
  customerDetails: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+230 123 4567',
  },
  specialRequests: 'Vegetarian meals',
});

if (result.success) {
  console.log('Booking created successfully:', result.data.bookingId);
} else {
  console.error('Booking creation failed:', result.error);
}
```

**Parameters:**

- `bookingData` (Object): Complete booking information including course, date, time, and customer details

**Returns:** Promise resolving to `{ success: boolean, data?: any, error?: any }`

### Newsletter Subscription

```javascript
import { subscribeNewsletter } from '@/services/api';

// Subscribe to newsletter
const result = await subscribeNewsletter('john@example.com');

if (result.success) {
  console.log('Newsletter subscription successful');
} else {
  console.error('Subscription failed:', result.error);
}
```

**Parameters:**

- `email` (string): Email address to subscribe

**Returns:** Promise resolving to `{ success: boolean, data?: any, error?: any }`

### Exchange Rates

```javascript
import { getExchangeRates } from '@/services/api';

// Get current exchange rates
const result = await getExchangeRates();

if (result.success) {
  console.log('Exchange rates:', result.data.rates);
  console.log('Base currency:', result.data.base);
} else {
  console.error('Failed to fetch exchange rates:', result.error);
}
```

**Returns:** Promise resolving to `{ success: boolean, data?: any, error?: any }`

## Error Handling

All API methods return a consistent response format:

- `success`: Boolean indicating if the request was successful
- `data`: Response data (only present if success is true)
- `error`: Error information (only present if success is false)

The API client includes automatic error logging and global error handling through axios interceptors.

## Environment Configuration

Set the `VITE_API_ENDPOINT` environment variable to configure the API base URL:

```bash
# .env
VITE_API_ENDPOINT=https://api.oceanspirit.sc/api
```

## Related

- [API Reference](/api/)
- [Guide](/guide/)

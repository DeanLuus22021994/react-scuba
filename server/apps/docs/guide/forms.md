---
title: Forms
description: Comprehensive guide to form implementation with React Hook Form, Zod validation, and analytics integration
---

# Forms

This guide covers the comprehensive form implementation in React Scuba, including validation, user experience, analytics tracking, and accessibility features.

## Overview

The application uses a robust form system built with:

- **React Hook Form** for performant form state management
- **Zod** for runtime type validation and schema definition
- **Analytics integration** for form tracking and conversion optimization
- **Accessibility-first design** with proper ARIA labels and keyboard navigation
- **Third-party integrations** including reCAPTCHA and date pickers

## Core Technologies

### React Hook Form

React Hook Form provides performant, flexible forms with minimal re-renders:

```jsx
import { useForm } from 'react-hook-form';

const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
  watch,
} = useForm({
  resolver: zodResolver(schema),
  defaultValues: {
    // Default form values
  },
});
```

**Key Features:**

- Minimal re-renders with uncontrolled components
- Built-in form validation
- Easy integration with external validation libraries
- Form state management (dirty, touched, valid)

### Zod Validation

Zod provides runtime type validation with excellent error messages:

```jsx
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  inquiryType: z.string().min(1, 'Please select an inquiry type'),
  preferredContact: z.string().min(1, 'Please select preferred contact method'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
```

**Benefits:**

- Type-safe validation schemas
- Human-readable error messages
- Composable validation rules
- Runtime type checking

## Form Components

### ContactModal

The contact form handles general inquiries with comprehensive validation:

```jsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  inquiryType: z.string().min(1, 'Please select an inquiry type'),
  preferredContact: z.string().min(1, 'Please select preferred contact method'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const ContactModal = ({ isOpen, onClose, initialSubject, source, utmParams }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      inquiryType: '',
      preferredContact: '',
      message: initialSubject || '',
    },
  });

  const onSubmit = async (data) => {
    // Form submission logic
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{/* Form fields */}</form>;
};
```

**Features:**

- Real-time validation with error display
- reCAPTCHA integration for spam prevention
- Analytics tracking for form starts, submissions, and abandons
- Responsive design with proper accessibility
- Form abandonment tracking based on completion percentage

### BookingModal

The booking form handles course and dive reservations with dynamic pricing:

```jsx
const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  participants: z.number().min(1).max(12),
  experienceLevel: z.string().min(1, 'Please select experience level'),
  specialRequests: z.string().optional(),
});
```

**Advanced Features:**

- Dynamic pricing with currency conversion
- Calendar availability checking
- Multi-step form flow with item selection
- Real-time price calculation
- Experience level validation
- Participant limits (1-12 people)

## Form Validation Patterns

### Schema Definition

Define validation schemas at the component level for maintainability:

```jsx
// Define schema with Zod
const formSchema = z
  .object({
    // Required fields
    requiredField: z.string().min(1, 'This field is required'),

    // Email validation
    email: z.string().email('Please enter a valid email'),

    // Number validation with constraints
    quantity: z.number().min(1).max(10),

    // Optional fields
    optionalField: z.string().optional(),

    // Conditional validation
    confirmEmail: z.string().email(),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails don't match",
    path: ['confirmEmail'],
  });
```

### Error Display

Display validation errors with proper styling and accessibility:

```jsx
<div>
  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
    Email *
  </label>
  <input
    {...register('email')}
    type="email"
    id="email"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
  />
  {errors.email && (
    <p className="mt-1 text-sm text-red-600" role="alert">
      {errors.email.message}
    </p>
  )}
</div>
```

### Form Submission

Handle form submission with proper error handling and user feedback:

```jsx
const onSubmit = async (data) => {
  setIsSubmitting(true);

  try {
    const result = await submitForm(data);

    if (result.success) {
      toast.success('Form submitted successfully!');
      trackFormSubmit(source, data);
      handleClose();
    } else {
      toast.error('Failed to submit form. Please try again.');
    }
  } catch (error) {
    logger.error('Form submission error:', error);
    toast.error('An error occurred. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

## Analytics Integration

### Form Tracking

Track form interactions for conversion optimization:

```jsx
import { trackFormStart, trackFormSubmit, trackFormAbandon } from '../../utils/analytics';

// Track form start
useEffect(() => {
  if (isOpen && !formStartTime) {
    setFormStartTime(Date.now());
    trackFormStart('contact_form', source);
  }
}, [isOpen, formStartTime, source]);

// Track form abandonment
const handleClose = () => {
  if (formStartTime && !isSubmitting) {
    const timeSpent = (Date.now() - formStartTime) / 1000;
    const completionPercentage = calculateCompletion();

    if (completionPercentage > 10 && timeSpent > 5) {
      trackFormAbandon('contact_form', source, completionPercentage);
    }
  }
  // ... rest of close logic
};
```

### Conversion Tracking

Track successful form submissions with relevant metadata:

```jsx
const onSubmit = async (data) => {
  // ... submission logic

  if (result.success) {
    trackFormSubmit(source, data.inquiryType);
    // Additional tracking for bookings
    trackBookingComplete(bookingType, itemName, price, currency);
  }
};
```

## Third-Party Integrations

### Google reCAPTCHA

Prevent spam submissions with reCAPTCHA integration:

```jsx
import ReCAPTCHA from 'react-google-recaptcha';

const [recaptchaToken, setRecaptchaToken] = useState(null);
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// In form
{
  recaptchaSiteKey && (
    <div className="flex justify-center">
      <ReCAPTCHA
        sitekey={recaptchaSiteKey}
        onChange={(token) => setRecaptchaToken(token)}
        onExpired={() => setRecaptchaToken(null)}
      />
    </div>
  );
}

// In submit handler
if (!recaptchaToken) {
  toast.error('Please complete the reCAPTCHA verification');
  return;
}
```

### React DatePicker

Handle date selection with localization and constraints:

```jsx
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const [selectedDate, setSelectedDate] = useState(null);

<DatePicker
  selected={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  minDate={new Date()}
  filterDate={(date) => date.getDay() !== 0} // Exclude Sundays
  dateFormat="MMMM d, yyyy"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
  placeholderText="Select a date..."
/>;
```

## API Integration

### Form Submission Service

Centralized API service for form submissions:

```javascript
// services/api.js
export const submitContactForm = async (data) => {
  try {
    const response = await api.post('/contact', data);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const submitBookingInquiry = async (data) => {
  try {
    const response = await api.post('/booking/inquiry', data);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};
```

### Error Handling

Comprehensive error handling with user-friendly messages:

```jsx
// API interceptor for global error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    logger.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);
```

## Accessibility Features

### ARIA Labels and Roles

Proper accessibility attributes for screen readers:

```jsx
<button onClick={handleClose} className="text-gray-400 hover:text-gray-500" aria-label="Close">
  <XMarkIcon className="w-6 h-6" />
</button>;

{
  errors.email && (
    <p className="mt-1 text-sm text-red-600" role="alert">
      {errors.email.message}
    </p>
  );
}
```

### Keyboard Navigation

Ensure all form elements are keyboard accessible:

```jsx
// Focus management
useEffect(() => {
  if (isOpen) {
    // Focus first input when modal opens
    const firstInput = document.getElementById('name');
    firstInput?.focus();
  }
}, [isOpen]);
```

### Form Validation Feedback

Real-time validation feedback for better UX:

```jsx
// Visual feedback for valid/invalid states
<input
  {...register('email')}
  type="email"
  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 ${
    errors.email ? 'border-red-500' : 'border-gray-300'
  }`}
/>
```

## Best Practices

### Form State Management

1. **Use uncontrolled components** with React Hook Form for performance
2. **Validate on blur/change** for immediate feedback
3. **Show validation errors** only after user interaction
4. **Reset forms** after successful submission
5. **Track form state** for analytics and UX improvements

### User Experience

1. **Progressive disclosure** - show fields as needed
2. **Smart defaults** - pre-fill known information
3. **Loading states** - show feedback during submission
4. **Error recovery** - allow users to fix and resubmit
5. **Confirmation** - clear success messaging

### Performance

1. **Debounce validation** for expensive operations
2. **Lazy load** form components when possible
3. **Minimize re-renders** with proper form setup
4. **Cache validation results** where appropriate

### Security

1. **Validate on server** - never trust client-side validation
2. **Use reCAPTCHA** for public forms
3. **Sanitize input** before processing
4. **Rate limiting** on form submissions
5. **CSRF protection** for state-changing operations

## Testing

### Unit Tests

Test form validation and submission logic:

```jsx
// ContactModal.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactModal from './ContactModal';

test('validates required fields', async () => {
  render(<ContactModal isOpen={true} onClose={() => {}} />);

  const submitButton = screen.getByRole('button', { name: /send message/i });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
  });
});
```

### Integration Tests

Test complete form workflows:

```jsx
test('submits contact form successfully', async () => {
  // Mock API
  const mockSubmit = jest.fn().mockResolvedValue({ success: true });

  render(<ContactModal isOpen={true} onClose={mockClose} />);

  // Fill form
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'John Doe' },
  });

  // Submit and verify
  fireEvent.click(screen.getByRole('button', { name: /send message/i }));

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'John Doe' }));
  });
});
```

## Common Patterns

### Conditional Fields

Show/hide fields based on user selections:

```jsx
const inquiryType = watch('inquiryType');

return (
  <form>
    <select {...register('inquiryType')}>
      <option value="general">General</option>
      <option value="booking">Booking</option>
    </select>

    {inquiryType === 'booking' && (
      <div>
        <label>Preferred Date</label>
        <DatePicker {...register('preferredDate')} />
      </div>
    )}
  </form>
);
```

### Dynamic Validation

Adjust validation rules based on form state:

```jsx
const schema = z
  .object({
    email: z.string().email(),
    confirmEmail: z.string().email(),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails don't match",
    path: ['confirmEmail'],
  });
```

### Form Persistence

Save form data to localStorage for better UX:

```jsx
// Save form data
useEffect(() => {
  const subscription = watch((data) => {
    localStorage.setItem('contactForm', JSON.stringify(data));
  });
  return () => subscription.unsubscribe();
}, [watch]);

// Restore form data
useEffect(() => {
  const saved = localStorage.getItem('contactForm');
  if (saved) {
    reset(JSON.parse(saved));
  }
}, [reset]);
```

This comprehensive form system ensures excellent user experience, robust validation, and detailed analytics tracking for conversion optimization.

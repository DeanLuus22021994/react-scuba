# Accessibility

<div class="feature-card">

WCAG 2.1 AA compliant React application with comprehensive accessibility features including keyboard navigation, screen reader support, focus management, and reduced motion preferences.

</div>

## Overview

React Scuba is built with accessibility as a core principle, following WCAG 2.1 AA guidelines. The application provides an inclusive experience for users with disabilities through comprehensive keyboard navigation, screen reader support, and thoughtful design patterns.

## Keyboard Navigation

### Focus Management

Comprehensive keyboard navigation system:

#### Focus Indicators

Custom focus rings for keyboard users:

```css
/* Focus visible for better keyboard navigation */
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}
```

#### Focus Ring Utilities

Reusable focus ring classes:

```css
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 2px #0ea5e9;
}

.focus-ring-inset:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px #0ea5e9;
}

.keyboard-focus:focus-visible {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}
```

### Skip Links

Skip-to-content links for keyboard users:

```html
<a href="#main-content" class="skip-to-content"> Skip to main content </a>
```

```css
.skip-to-content {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #0284c7;
  color: white;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.skip-to-content:focus {
  transform: translateY(0);
}
```

### Tab Order

Logical tab order throughout the application:

- Header navigation first
- Main content navigation
- Footer links last
- Modal dialogs trap focus appropriately

## Screen Reader Support

### ARIA Labels and Roles

Comprehensive ARIA implementation:

#### Navigation

```jsx
<nav aria-label="Main navigation">
  <ul role="menubar">
    <li role="none">
      <a href="/" role="menuitem">
        Home
      </a>
    </li>
  </ul>
</nav>
```

#### Buttons and Links

```jsx
// WhatsApp button with descriptive label
<a
  href="https://wa.me/1234567890"
  aria-label="Chat on WhatsApp"
  target="_blank"
  rel="noopener noreferrer"
>
  WhatsApp
</a>

// Phone link with accessibility
<a
  href="tel:+2301234567"
  aria-label="Call us at +230 123 4567"
>
  +230 123 4567
</a>
```

#### Images

```jsx
// Dive site images with alt text
<img
  src="/images/blue-bay.jpg"
  alt="Blue Bay Marine Park with crystal clear waters and coral reefs"
  loading="lazy"
/>

// Team member photos
<img
  src="/team/john.jpg"
  alt="John Doe, PADI Master Instructor with 15 years experience"
  loading="lazy"
/>
```

### Semantic HTML

Proper semantic structure:

```jsx
<header>
  <nav aria-label="Main navigation">
    {/* Navigation content */}
  </nav>
</header>

<main id="main-content">
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">Welcome to Mauritius Scuba</h1>
    {/* Section content */}
  </section>
</main>

<footer>
  <nav aria-label="Footer navigation">
    {/* Footer links */}
  </nav>
</footer>
```

### Live Regions

Dynamic content announcements:

```jsx
// Form submission feedback
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {submissionStatus}
</div>
```

## Visual Accessibility

### Color Contrast

WCAG AA compliant color combinations:

#### Text Colors

- **Primary text**: 4.5:1 contrast ratio on light backgrounds
- **Secondary text**: 4.5:1 contrast ratio
- **Links**: 4.5:1 contrast ratio with focus states

#### Component Colors

```css
/* Ocean theme - high contrast */
.btn-primary {
  background-color: #075985; /* 7:1 contrast on white */
  color: white;
}

.btn-secondary {
  background-color: white;
  color: #0284c7; /* 7:1 contrast */
  border: 2px solid #0284c7;
}
```

### Font Sizing

Readable typography with proper sizing:

- **Base font size**: 16px (1rem)
- **Line height**: 1.5 for body text
- **Heading hierarchy**: Consistent scaling

### Touch Targets

Adequate touch target sizes for mobile:

```css
/* Minimum 44px touch targets */
.btn,
.link,
.menu-item {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1rem;
}
```

## Motion and Animation

### Reduced Motion Support

Respects user motion preferences:

```css
/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Additional reduced motion handling */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-slide-in-left,
  .animate-scale-in {
    animation: none;
  }
}
```

### Animation Controls

User-controllable animations:

```jsx
// Animation toggle component
const [animationsEnabled, setAnimationsEnabled] = useState(
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

// Apply animation classes conditionally
<div className={animationsEnabled ? 'animate-fade-in' : ''}>Content</div>;
```

## Form Accessibility

### Form Labels

Properly associated form labels:

```jsx
<label htmlFor="name" className="form-label">
  Full Name
</label>
<input
  id="name"
  type="text"
  name="name"
  aria-describedby="name-error"
  aria-invalid={hasError}
/>
{hasError && (
  <span id="name-error" className="error-message" role="alert">
    Please enter your full name
  </span>
)}
```

### Error Handling

Accessible error messaging:

```jsx
// Error boundary with screen reader support
<div role="alert" aria-live="assertive" className="sr-only">
  An error occurred while loading the page
</div>
```

### Form Validation

Real-time validation feedback:

```jsx
<input
  type="email"
  aria-describedby="email-help email-error"
  aria-invalid={emailError ? 'true' : 'false'}
/>
<div id="email-help">We'll never share your email</div>
{emailError && (
  <div id="email-error" role="alert">
    Please enter a valid email address
  </div>
)}
```

## Modal and Dialog Accessibility

### Focus Trapping

Modal dialogs trap focus appropriately:

```jsx
// Modal component with focus management
useEffect(() => {
  if (isOpen) {
    // Focus first focusable element
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements?.length) {
      focusableElements[0].focus();
    }
  }
}, [isOpen]);
```

### ARIA Attributes

Proper modal ARIA implementation:

```jsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Booking Confirmation</h2>
  <p id="modal-description">Please review your booking details</p>
  {/* Modal content */}
</div>
```

## Testing and Validation

### Automated Testing

Accessibility testing in test suite:

```jsx
// Component accessibility tests
it('should have proper ARIA labels', () => {
  render(<WhatsAppButton />);
  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('aria-label', 'Chat on WhatsApp');
});

it('should be keyboard accessible', () => {
  render(<Navigation />);
  const menuButton = screen.getByRole('button', { name: /open menu/i });
  fireEvent.click(menuButton);
  // Test focus management
});
```

### Manual Testing

Accessibility testing checklist:

#### Keyboard Navigation

- [x] All interactive elements reachable with Tab
- [x] Logical tab order
- [x] Skip links work properly
- [x] Focus indicators visible

#### Screen Reader Testing

- [x] Semantic HTML structure
- [x] ARIA labels and descriptions
- [x] Form error announcements
- [x] Dynamic content updates

#### Visual Testing

- [x] Color contrast ratios meet WCAG AA
- [x] Text remains readable at 200% zoom
- [x] Touch targets meet minimum size
- [x] Focus indicators clearly visible

## Tools and Resources

### Development Tools

Accessibility development tools:

#### ESLint Plugins

```json
{
  "extends": ["plugin:jsx-a11y/recommended"],
  "plugins": ["jsx-a11y"]
}
```

#### Browser Extensions

- **WAVE**: Web accessibility evaluation tool
- **axe DevTools**: Automated accessibility testing
- **Accessibility Insights**: Microsoft accessibility toolkit

### Testing Tools

Automated accessibility testing:

#### Lighthouse

```bash
# Run accessibility audit
npx lighthouse https://yoursite.com --only-categories=accessibility
```

#### axe-core

```javascript
// Programmatic accessibility testing
import axe from 'axe-core';

axe.run(document, (err, results) => {
  console.log(results.violations);
});
```

## Compliance Standards

### WCAG 2.1 AA Requirements

Implemented WCAG guidelines:

#### Perceivable

- **Text Alternatives**: Alt text for images
- **Time-based Media**: N/A (no video/audio)
- **Adaptable**: Semantic HTML structure
- **Distinguishable**: High contrast, reduced motion

#### Operable

- **Keyboard Accessible**: Full keyboard navigation
- **Enough Time**: No time limits on content
- **Seizures**: Reduced motion support
- **Navigable**: Logical heading structure

#### Understandable

- **Readable**: Clear language and structure
- **Predictable**: Consistent navigation
- **Input Assistance**: Form validation and help

#### Robust

- **Compatible**: Standards-compliant HTML
- **Assistive Technology**: Screen reader support

## Best Practices

### Development Guidelines

Accessibility-first development approach:

#### Code Reviews

- **Automated checks**: ESLint jsx-a11y rules
- **Manual review**: Accessibility checklist
- **User testing**: Real user feedback

#### Component Library

- **Accessible defaults**: Built-in accessibility features
- **Consistent patterns**: Standardized ARIA usage
- **Documentation**: Accessibility notes for each component

#### Continuous Learning

- **Stay updated**: WCAG guideline changes
- **Tool training**: Regular accessibility tool usage
- **Community involvement**: Accessibility conferences and meetups

### Maintenance

Ongoing accessibility maintenance:

#### Regular Audits

- **Automated scanning**: Monthly accessibility reports
- **Manual testing**: Quarterly comprehensive reviews
- **User feedback**: Accessibility issue tracking

#### Documentation

- **Accessibility statement**: Public accessibility commitment
- **Contact information**: Accessibility feedback channels
- **Progress updates**: Accessibility improvement roadmap

This comprehensive accessibility implementation ensures React Scuba provides an inclusive experience for all users, regardless of ability or assistive technology usage.

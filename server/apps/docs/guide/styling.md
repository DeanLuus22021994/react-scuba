# Styling

<div class="feature-card">

Modern styling approach using Tailwind CSS v4 with custom design system, animations, and responsive utilities.

</div>

## Overview

React Scuba uses **Tailwind CSS v4** as the primary styling framework with a custom design system featuring ocean and coral color palettes, comprehensive component styles, and smooth animations.

## Design System

### Color Palette

The design system uses two carefully crafted color palettes:

#### Ocean Colors (Primary)

Professional blue tones for primary UI elements:

```css
ocean: {
  50: '#f0f9ff',   /* Lightest blue */
  500: '#0ea5e9',  /* Primary blue */
  900: '#0c4a6e',  /* Darkest blue */
}
```

#### Coral Colors (Accent)

Vibrant red tones for CTAs and highlights:

```css
coral: {
  50: '#fef2f2',   /* Lightest red */
  500: '#ef4444',  /* Primary red */
  900: '#7f1d1d',  /* Darkest red */
}
```

### Typography

**Inter font family** provides modern, readable typography:

```css
fontFamily: {
  sans:
    [ 'Inter',
    'system-ui',
    'sans-serif'];
}
```

- **Headings**: Font weight 700 (bold)
- **Body text**: Font weight 400 (regular)
- **Buttons**: Font weight 600-700 (semibold-bold)

## Component Styles

### Button System

Three button variants with consistent styling:

```css
/* Primary buttons - Ocean blue background */
.btn-primary {
  background-color: #075985;
  color: white;
  font-weight: 700;
  /* Hover effects with scale transform */
}

/* Secondary buttons - White background, blue border */
.btn-secondary {
  background-color: white;
  color: #0284c7;
  border: 2px solid #0284c7;
}

/* Outline buttons - Transparent background, blue border */
.btn-outline {
  background-color: transparent;
  color: #0284c7;
  border: 2px solid #0284c7;
}
```

### Card Components

Elevated cards with hover effects:

```css
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: /* Subtle shadow */
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: /* Enhanced shadow on hover */
}
```

### Form Elements

Consistent form styling with focus states:

```css
.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.input-field:focus {
  /* Custom focus ring using CSS custom properties */
  --tw-ring-color: #0ea5e9;
  border-color: transparent;
}
```

## Layout System

### Container Utilities

Responsive containers with proper padding:

```css
.container-custom {
  max-width: 80rem; /* 1280px */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Responsive padding */
@media (min-width: 640px) {
  .container-custom {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
```

### Section Spacing

Consistent vertical spacing:

```css
.section-padding {
  padding-top: 4rem;
  padding-bottom: 4rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
```

## Animation System

### CSS Custom Properties

Animation system built with CSS custom properties:

```css
:root {
  --animation-duration-fast: 0.3s;
  --animation-duration-normal: 0.5s;
  --animation-duration-slow: 0.8s;
  --animation-easing-default: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Keyframe Animations

Comprehensive animation library:

```css
/* Fade animations */
@keyframes fadeIn {
  /* ... */
}
@keyframes fadeInUp {
  /* ... */
}

/* Slide animations */
@keyframes slideInLeft {
  /* ... */
}
@keyframes slideInRight {
  /* ... */
}

/* Scale animations */
@keyframes scaleIn {
  /* ... */
}

/* Special effects */
@keyframes shimmer {
  /* ... */
}
@keyframes gradientShift {
  /* ... */
}
```

### Utility Classes

Ready-to-use animation classes:

```css
.animate-fade-in {
  animation: fadeIn var(--animation-duration-normal) var(--animation-easing-in);
}

.animate-slide-in-left {
  animation: slideInLeft var(--animation-duration-normal) var(--animation-easing-out);
}

.animate-scale-in {
  animation: scaleIn var(--animation-duration-fast) var(--animation-easing-out);
}
```

## Responsive Design

### Breakpoint Strategy

Mobile-first approach with standard breakpoints:

```css
/* Mobile first - default styles */

/* Small screens (640px+) */
@media (min-width: 640px) {
  /* sm: */
}

/* Medium screens (768px+) */
@media (min-width: 768px) {
  /* md: */
}

/* Large screens (1024px+) */
@media (min-width: 1024px) {
  /* lg: */
}

/* Extra large screens (1280px+) */
@media (min-width: 1280px) {
  /* xl: */
}
```

### Responsive Typography

Scalable heading sizes:

```css
.heading-primary {
  font-size: 1.875rem; /* 30px on mobile */
}

@media (min-width: 768px) {
  .heading-primary {
    font-size: 2.25rem; /* 36px on tablet */
  }
}

@media (min-width: 1024px) {
  .heading-primary {
    font-size: 3rem; /* 48px on desktop */
  }
}
```

## Accessibility Features

### Focus Management

Custom focus rings for keyboard navigation:

```css
.focus-ring:focus {
  outline: none;
  /* Custom ring using CSS custom properties */
  --tw-ring-color: #0ea5e9;
  --tw-ring-offset-width: 2px;
}
```

### Reduced Motion Support

Respects user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Skip Links

Accessibility skip links for screen readers:

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

## Performance Optimizations

### CSS Organization

Styles organized into logical sections:

```css
/* ========================================
   INDEX - Base styles
   UTILITIES - Custom utility classes
   COMPONENTS - Component-specific styles
   ANIMATIONS - Keyframe animations
   ======================================== */
```

### Tailwind CSS Optimization

- **Purging unused styles** in production
- **CSS custom properties** for dynamic theming
- **Component-based styling** to reduce bundle size

## Third-Party Integrations

### Component Libraries

Styled integrations with popular libraries:

```css
/* React DatePicker customization */
.react-datepicker {
  font-family: ui-sans-serif, system-ui, sans-serif;
  border-radius: 0.5rem;
  box-shadow:; /* Consistent shadow */
}

/* Leaflet map customization */
.leaflet-container {
  font-family: ui-sans-serif, system-ui, sans-serif;
}

/* Swiper carousel customization */
.swiper-button-next,
.swiper-button-prev {
  color: white;
}
```

### Animation Libraries

Framer Motion integration with custom CSS:

```css
/* Lightbox overlay */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.95);
  z-index: 50;
}
```

## Development Workflow

### CSS Architecture

1. **Base styles** in `index.css`
2. **Component styles** co-located with components
3. **Utility classes** for common patterns
4. **CSS custom properties** for theming

### Build Process

- **PostCSS processing** with Tailwind CSS v4
- **CSS consolidation** script for organization
- **Minification** in production builds
- **Source maps** for debugging

## Best Practices

### Class Naming

- Use **semantic class names** (`btn-primary`, `card`, `input-field`)
- **BEM methodology** for complex components
- **Utility-first** approach with Tailwind classes

### Performance

- **Minimize CSS bundle size** through purging
- **Use CSS custom properties** for dynamic values
- **Optimize animations** with `transform` and `opacity`
- **Lazy load** component styles when possible

### Maintainability

- **Document custom classes** and their usage
- **Consistent spacing** using design tokens
- **Regular audits** of unused styles
- **Version control** for style changes

## Customization

### Theme Extension

Extend the design system in `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // Add custom colors
        brand: '#your-brand-color',
      },
      fontFamily: {
        // Add custom fonts
        display: ['Your Display Font', 'sans-serif'],
      },
    },
  },
};
```

### CSS Custom Properties

Override design tokens in your components:

```css
.my-component {
  --animation-duration-fast: 0.2s; /* Faster animations */
  --tw-ring-color: #your-accent-color; /* Custom focus color */
}
```

This styling system provides a solid foundation for consistent, accessible, and performant user interfaces while remaining flexible for customization and extension.

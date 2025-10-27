# Performance

<div class="feature-card">

High-performance React application with intelligent code-splitting, lazy loading, Core Web Vitals optimization, and comprehensive monitoring using web-vitals library.

</div>

## Overview

React Scuba is optimized for exceptional performance with modern build tools, intelligent code-splitting, and Core Web Vitals monitoring. The application achieves fast loading times and smooth user interactions.

## Build Optimization

### Vite Build Configuration

Advanced Vite configuration for optimal production builds:

```javascript
export default defineConfig({
  build: {
    // Terser minification with console removal
    minify: 'terser',
    // Modern ESNext target for smaller bundles
    target: 'esnext',
    // Intelligent code-splitting
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Strategic chunking by functionality
          if (id.includes('react')) return 'react-vendor';
          if (id.includes('leaflet')) return 'maps';
          // ... additional chunks
        },
      },
    },
  },
});
```

### Code Splitting Strategy

Intelligent chunking reduces initial bundle size:

#### Core Chunks

- **react-vendor**: React core libraries (React, ReactDOM)
- **router**: React Router for navigation
- **ui-headless**: Headless UI components

#### Feature Chunks

- **framer-motion**: Animation library
- **maps**: Leaflet mapping components
- **forms**: Form validation and components
- **datepicker**: Date picker functionality

#### Utility Chunks

- **toast**: Notification system
- **vendor-misc**: Remaining third-party libraries

## Lazy Loading

### Component Lazy Loading

Critical components loaded immediately, others lazy-loaded:

```jsx
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const GalleryPage = lazy(() => import('../pages/GalleryPage'));
const DiveSitesPage = lazy(() => import('../pages/DiveSitesPage'));

// Loading fallback
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/gallery" element={<GalleryPage />} />
    <Route path="/dive-sites" element={<DiveSitesPage />} />
  </Routes>
</Suspense>;
```

### Image Optimization

Multiple image optimization strategies:

```jsx
// Lazy loading with intersection observer
<img
  loading="lazy"
  src="/images/dive-site.jpg"
  alt="Beautiful dive site"
  width="800"
  height="600"
/>

// WebP with fallbacks
<picture>
  <source srcset="/images/hero.webp" type="image/webp" />
  <img src="/images/hero.jpg" alt="Hero image" />
</picture>
```

## Core Web Vitals

### Performance Metrics

Optimized for all Core Web Vitals:

#### Largest Contentful Paint (LCP)

- **Target**: < 2.5 seconds
- **Optimization**: Critical resource prioritization
- **Monitoring**: Real-time LCP tracking

#### First Input Delay (FID)

- **Target**: < 100 milliseconds
- **Optimization**: Non-blocking JavaScript execution
- **Monitoring**: User interaction delay measurement

#### Cumulative Layout Shift (CLS)

- **Target**: < 0.1
- **Optimization**: Stable element dimensions
- **Monitoring**: Layout shift accumulation

### Web Vitals Integration

Automatic performance monitoring with Google Analytics:

```javascript
import { reportWebVitalsToGA4 } from './utils/reportWebVitals';

// In main.jsx
reportWebVitalsToGA4();
```

## Bundle Analysis

### Build Output Optimization

Production build optimizations:

```javascript
terserOptions: {
  compress: {
    // Remove development code
    drop_console: true,
    drop_debugger: true,
    // Remove unused code
    pure_funcs: ['console.log', 'console.info'],
  },
  format: {
    comments: false, // Remove comments
  },
}
```

### Asset Optimization

Content-hashed assets for optimal caching:

```javascript
output: {
  entryFileNames: 'assets/[name]-[hash].js',
  chunkFileNames: 'assets/[name]-[hash].js',
  assetFileNames: 'assets/[name]-[hash].[ext]',
}
```

## Runtime Performance

### React Optimization

Performance-focused React patterns:

#### Memoization

```jsx
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return heavyComputation(data);
  }, [data]);

  const handleClick = useCallback(() => {
    // Stable function reference
  }, []);

  return <div>{processedData}</div>;
});
```

#### Virtual Scrolling

Large lists use virtual scrolling to maintain performance:

```jsx
// For gallery grids with many images
<VirtualizedGrid items={galleryImages} itemHeight={200} containerHeight={600} />
```

### CSS Performance

Optimized styling for fast rendering:

#### CSS Containment

```css
.gallery-grid {
  contain: layout style paint;
  /* Isolates expensive recalculations */
}
```

#### GPU Acceleration

```css
.card {
  transform: translateZ(0); /* Forces GPU layer */
  will-change: transform; /* Hints browser optimization */
}
```

## Network Optimization

### Resource Hints

Preconnect to external domains:

```html
<!-- In index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://images.unsplash.com" />
<link rel="preconnect" href="https://www.google-analytics.com" />
```

### Caching Strategy

HTTP caching headers and service worker:

```javascript
// Service worker for static asset caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

## Monitoring & Analytics

### Performance Monitoring

Real-time performance tracking:

#### Google Analytics 4

- Core Web Vitals tracking
- Custom performance events
- User-centric performance metrics

#### Custom Metrics

```javascript
// Track component render time
const startTime = performance.now();
// ... component logic
const renderTime = performance.now() - startTime;
trackPerformance('component_render', { time: renderTime });
```

### Error Boundaries

Graceful error handling with performance impact monitoring:

```jsx
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    // Log error with performance context
    logError(error, {
      url: window.location.href,
      userAgent: navigator.userAgent,
      performance: performance.getEntriesByType('navigation')[0],
    });
  }
}
```

## Development Tools

### Performance Profiling

Built-in development performance tools:

#### React DevTools

- Component render profiling
- Flame graph analysis
- Component optimization suggestions

#### Lighthouse

Automated performance auditing:

```bash
# Run Lighthouse audit
npm run lighthouse
```

#### Bundle Analyzer

Visualize bundle composition:

```bash
# Analyze bundle size
npm run build:analyze
```

## Optimization Checklist

### Build Time Optimizations

- [x] Code splitting by routes and features
- [x] Tree shaking unused dependencies
- [x] Minification and compression
- [x] Asset optimization with hashing

### Runtime Optimizations

- [x] Component lazy loading
- [x] Image lazy loading and WebP
- [x] Memoization of expensive computations
- [x] Virtual scrolling for large lists

### Network Optimizations

- [x] Resource preconnection
- [x] Efficient caching strategies
- [x] CDN for static assets
- [x] Service worker implementation

### Monitoring & Maintenance

- [x] Core Web Vitals tracking
- [x] Performance budget monitoring
- [x] Error boundary implementation
- [x] Regular performance audits

## Performance Budgets

Defined performance thresholds:

```javascript
const performanceBudget = {
  // Bundle sizes
  'react-vendor': { size: 150, unit: 'KB' },
  main: { size: 100, unit: 'KB' },

  // Core Web Vitals
  LCP: { value: 2500, unit: 'ms' },
  FID: { value: 100, unit: 'ms' },
  CLS: { value: 0.1, unit: 'score' },

  // Network
  'total-requests': { value: 50, unit: 'requests' },
  'total-size': { value: 500, unit: 'KB' },
};
```

## Best Practices

### Code Quality

- **Bundle size monitoring**: Regular size checks
- **Dependency auditing**: Remove unused packages
- **Code splitting review**: Optimize chunk boundaries
- **Performance regression testing**: Automated checks

### User Experience

- **Progressive loading**: Content appears incrementally
- **Skeleton screens**: Loading state management
- **Perceived performance**: Optimize above-the-fold content
- **Offline capability**: Service worker implementation

### Development Workflow

- **Performance profiling**: Regular development audits
- **Automated testing**: Performance regression prevention
- **Documentation**: Performance guidelines for team
- **Continuous monitoring**: Production performance tracking

This performance optimization strategy ensures React Scuba delivers exceptional user experience with fast loading times, smooth interactions, and comprehensive monitoring across all devices and network conditions.

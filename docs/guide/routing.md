---
title: Routing
description: Comprehensive guide to React Router v7 implementation, navigation patterns, and scroll management
---

# Routing

This guide covers the comprehensive routing implementation in React Scuba using React Router v7, including navigation patterns, code splitting, and smooth scroll management.

## Overview

The application uses React Router v7 for client-side routing with the following features:

- **Code splitting** with lazy-loaded components for optimal performance
- **Smooth scroll navigation** for single-page sections
- **Responsive navigation** with mobile menu support
- **Active link highlighting** and accessibility features
- **Hash-based anchor navigation** for section scrolling

## Core Architecture

### Router Setup

The main routing configuration is centralized in `App.jsx`:

```jsx
import { lazy, Suspense, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Layout Components (loaded immediately - needed for all routes)
import Footer from './layouts/Footer';
import Header from './layouts/Header';

// Lazy-loaded Pages (code-split by route)
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const DiveSitesPage = lazy(() => import('./pages/DiveSitesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/dive-sites" element={<DiveSitesPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
```

**Key Features:**

- **BrowserRouter** for clean URLs without hash fragments
- **Lazy loading** for code splitting and performance optimization
- **Suspense boundaries** with loading states
- **Layout persistence** across route changes

### Route Configuration

Routes are defined with a clear hierarchy and semantic paths:

```jsx
const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/courses', name: 'Courses', component: CoursesPage },
  { path: '/about', name: 'About', component: AboutPage },
  { path: '/gallery', name: 'Gallery', component: GalleryPage },
  { path: '/dive-sites', name: 'Dive Sites', component: DiveSitesPage },
];
```

**Route Organization:**

- Root path (`/`) for homepage
- Feature-based paths (`/courses`, `/gallery`)
- Descriptive naming for SEO and user understanding

## Navigation Components

### Navigation Component

The navigation component handles both desktop and mobile navigation:

```jsx
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Courses', path: '/courses' },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
];

const Navigation = ({ mobile = false, closeMenu }) => {
  const location = useLocation();

  const linkClass = (path) => {
    const isActive = location.pathname === path;
    return `${baseClass} ${
      isActive ? 'text-ocean-600' : 'text-gray-700 hover:text-ocean-600'
    } transition-colors duration-200`;
  };

  return (
    <nav>
      {navItems.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={linkClass(link.path)}
          onClick={mobile ? closeMenu : undefined}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
};
```

**Features:**

- **Active link detection** using `useLocation` hook
- **Conditional styling** for current page highlighting
- **Mobile-responsive** with close menu functionality
- **Accessibility** with proper focus management

### Header Integration

The header component integrates navigation with responsive design:

```jsx
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-ocean-600">Mauritius Scuba</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <Navigation />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          className="lg:hidden"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <Transition show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" onClose={setMobileMenuOpen}>
          <Dialog.Panel className="fixed right-0 top-0 w-full max-w-sm h-full bg-white">
            <Navigation mobile closeMenu={() => setMobileMenuOpen(false)} />
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </header>
  );
};
```

**Responsive Features:**

- **Sticky positioning** for persistent navigation
- **Mobile-first design** with slide-out menu
- **Accessibility** with proper ARIA labels
- **Smooth transitions** using Headless UI

## Code Splitting Strategy

### Lazy Loading Implementation

Pages are lazy-loaded to reduce initial bundle size:

```jsx
// Lazy-loaded page imports
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));

// Layout components loaded immediately (shared across routes)
import Footer from './layouts/Footer';
import Header from './layouts/Header';
import Loading from './components/common/Loading';
```

**Benefits:**

- **Faster initial load** times
- **Reduced bundle size** for better performance
- **Progressive loading** of features as needed

### Loading States

Suspense boundaries provide smooth loading transitions:

```jsx
<main className="flex-grow">
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      {/* ... other routes */}
    </Routes>
  </Suspense>
</main>
```

**Loading Strategy:**

- **Skeleton loading** for better perceived performance
- **Consistent UX** across route changes
- **Error boundaries** for failed imports

## Scroll Management

### Smooth Anchor Navigation

The application combines routing with smooth scrolling for single-page sections:

```javascript
/**
 * Smoothly scroll to an element with optional offset
 */
export const scrollToElement = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });

  // Update URL hash without triggering navigation
  if (window.history.pushState) {
    window.history.pushState(null, null, `#${elementId}`);
  }

  // Focus element for accessibility
  element.setAttribute('tabindex', '-1');
  element.focus({ preventScroll: true });
};
```

**Features:**

- **Fixed header offset** calculation
- **URL hash management** for bookmarkable sections
- **Accessibility focus** management
- **Smooth scrolling** with native browser API

### Scroll Reveal Animations

Intersection Observer handles scroll-triggered animations:

```javascript
export const observeScrollReveal = (
  selector = '.reveal-on-scroll',
  callback = null,
  options = {}
) => {
  const defaultOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px',
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { ...defaultOptions, ...options }
  );

  document.querySelectorAll(selector).forEach((el) => observer.observe(el));
};
```

**Animation Features:**

- **Performance optimized** with unobserve after trigger
- **Configurable thresholds** for different reveal points
- **CSS-driven animations** for smooth performance

### Back to Top Functionality

Automatic back-to-top button with scroll detection:

```javascript
export const initBackToTop = (buttonId = 'back-to-top', showAfter = 300) => {
  const button = document.getElementById(buttonId);

  const handleScroll = () => {
    button.classList.toggle('visible', window.pageYOffset > showAfter);
  };

  window.addEventListener('scroll', handleScroll);
  button.addEventListener('click', () => scrollToTop());
};
```

**UX Features:**

- **Progressive enhancement** - works without JavaScript
- **Smooth scrolling** to top
- **Visibility toggle** based on scroll position

## Advanced Routing Patterns

### Route Guards

Implement authentication or permission checks:

```jsx
const ProtectedRoute = ({ children, requiresAuth }) => {
  const isAuthenticated = useAuth();

  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Usage
<Route
  path="/admin"
  element={
    <ProtectedRoute requiresAuth>
      <AdminPage />
    </ProtectedRoute>
  }
/>;
```

### Nested Routes

Handle complex page structures with nested routing:

```jsx
const CoursesPage = () => {
  return (
    <Routes>
      <Route index element={<CourseList />} />
      <Route path=":courseId" element={<CourseDetail />} />
      <Route path=":courseId/book" element={<BookingForm />} />
    </Routes>
  );
};
```

### Programmatic Navigation

Navigate programmatically with the `useNavigate` hook:

```jsx
import { useNavigate } from 'react-router-dom';

const BookingSuccess = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/courses', { replace: true });
  };

  return (
    <div>
      <h1>Booking Confirmed!</h1>
      <button onClick={handleContinue}>View More Courses</button>
    </div>
  );
};
```

## SEO and Accessibility

### Meta Tag Management

Dynamic meta tags for each route using React Helmet:

```jsx
import { Helmet } from 'react-helmet-async';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Mauritius Scuba</title>
        <meta
          name="description"
          content="Learn about our PADI certified dive instructors and our commitment to safe, enjoyable diving experiences."
        />
        <link rel="canonical" href="https://mauritiusscuba.com/about" />
      </Helmet>
      {/* Page content */}
    </>
  );
};
```

### Focus Management

Proper focus management for keyboard navigation:

```jsx
// Focus first heading on route change
useEffect(() => {
  const mainHeading = document.querySelector('main h1');
  if (mainHeading) {
    mainHeading.focus();
  }
}, [location.pathname]);
```

### Skip Links

Skip navigation links for screen readers:

```jsx
{
  /* In Header component */
}
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-ocean-600 text-white px-4 py-2 rounded"
>
  Skip to main content
</a>;

{
  /* In main content */
}
<main id="main-content">{/* Page content */}</main>;
```

## Performance Optimization

### Bundle Analysis

Monitor bundle sizes and optimize imports:

```javascript
// Analyze bundle with webpack-bundle-analyzer
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// Dynamic imports for large libraries
const loadHeavyLibrary = async () => {
  const { heavyFunction } = await import('./utils/heavyLibrary');
  return heavyFunction;
};
```

### Preloading Strategies

Preload likely next routes for better UX:

```jsx
const HomePage = lazy(() => import('./pages/HomePage'));

// Preload on hover
const preloadAbout = () => import('./pages/AboutPage');

<Link to="/about" onMouseEnter={preloadAbout} className="nav-link">
  About
</Link>;
```

### Route-Based Code Splitting

Split code by feature areas:

```jsx
// Feature-based lazy loading
const CourseRoutes = lazy(() => import('./features/courses/CourseRoutes'));
const GalleryRoutes = lazy(() => import('./features/gallery/GalleryRoutes'));

// In App.jsx
<Route path="/courses/*" element={<CourseRoutes />} />
<Route path="/gallery/*" element={<GalleryRoutes />} />
```

## Testing Routing

### Route Testing

Test routing behavior with React Testing Library:

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders home page on root path', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText('Welcome to Mauritius Scuba')).toBeInTheDocument();
});
```

### Navigation Testing

Test navigation component behavior:

```jsx
test('highlights active navigation link', () => {
  render(
    <MemoryRouter initialEntries={['/about']}>
      <Navigation />
    </MemoryRouter>
  );

  const aboutLink = screen.getByText('About');
  expect(aboutLink).toHaveClass('text-ocean-600');
});
```

### Scroll Testing

Test scroll functionality:

```jsx
test('scrolls to element on hash navigation', () => {
  // Mock scrollIntoView
  Element.prototype.scrollIntoView = jest.fn();

  render(<HomePage />);

  // Simulate hash change
  window.location.hash = '#courses';

  // Verify scroll behavior
  expect(scrollToElement).toHaveBeenCalledWith('courses');
});
```

## Best Practices

### Route Organization

1. **Semantic URLs** - Use descriptive, hierarchical paths
2. **Consistent patterns** - Follow RESTful conventions where applicable
3. **Shallow routing** - Avoid deeply nested routes when possible
4. **Route parameters** - Use descriptive parameter names

### Performance

1. **Lazy loading** - Split code at route boundaries
2. **Preloading** - Load likely next routes on user interaction
3. **Bundle optimization** - Monitor and optimize bundle sizes
4. **Caching strategies** - Cache route components when appropriate

### User Experience

1. **Loading states** - Provide feedback during route transitions
2. **Error boundaries** - Handle route loading failures gracefully
3. **Scroll restoration** - Maintain scroll position on navigation
4. **Focus management** - Ensure proper focus flow after navigation

### Accessibility

1. **Skip links** - Provide navigation shortcuts for screen readers
2. **Focus indicators** - Clear visual focus indicators
3. **Semantic HTML** - Use proper heading hierarchy
4. **ARIA landmarks** - Proper region identification

### SEO

1. **Meta tags** - Dynamic meta tags for each route
2. **Canonical URLs** - Prevent duplicate content issues
3. **Structured data** - Add JSON-LD for rich snippets
4. **Sitemap integration** - Ensure all routes are crawlable

This routing system provides a solid foundation for scalable React applications with excellent performance, accessibility, and user experience.

# Scroll To Anchor

The scroll to anchor utilities provide smooth scrolling navigation, viewport detection, and scroll-based animations for enhanced user experience.

## Smooth Scrolling

### Scroll to Element

```javascript
import { scrollToElement } from '@/utils/scrollToAnchor';

// Scroll to element with default 80px offset for fixed header
scrollToElement('courses-section');

// Scroll with custom offset
scrollToElement('contact-form', 100);
```

**Features:**

- Smooth scrolling animation
- Automatic URL hash update
- Accessibility focus management
- Configurable offset for fixed headers

### Handle Anchor Clicks

```javascript
import { handleAnchorClick } from '@/utils/scrollToAnchor';

// In React component
const handleClick = (event) => {
  handleAnchorClick(event, 'target-section');
};

return (
  <a href="#target-section" onClick={handleClick}>
    Go to Section
  </a>
);
```

### Scroll to Top

```javascript
import { scrollToTop } from '@/utils/scrollToAnchor';

// Scroll to top of page
scrollToTop();
```

## Viewport Detection

### Check Element Visibility

```javascript
import { isInViewport } from '@/utils/scrollToAnchor';

// Check if element is 50% visible in viewport
const element = document.getElementById('my-element');
const isVisible = isInViewport(element, 0.5); // true/false

// Check if fully visible
const isFullyVisible = isInViewport(element, 1.0);
```

**Parameters:**

- `element` (HTMLElement): Element to check
- `threshold` (number): Visibility threshold (0-1, default: 0.5)

## Scroll Reveal Animations

### Initialize Scroll Reveal

```javascript
import { initScrollReveal } from '@/utils/scrollToAnchor';

// Initialize on component mount
useEffect(() => {
  initScrollReveal();
}, []);
```

**Features:**

- Automatic hash navigation on page load
- Intersection Observer for performance
- CSS class management for animations

### Custom Scroll Reveal Observer

```javascript
import { observeScrollReveal } from '@/utils/scrollToAnchor';

// Observe custom elements
const observer = observeScrollReveal(
  '.my-reveal-class',
  (element) => {
    console.log('Element revealed:', element);
  },
  {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px',
  }
);

// Cleanup when needed
observer.disconnect();
```

**Parameters:**

- `selector` (string): CSS selector for elements to observe (default: '.reveal-on-scroll')
- `callback` (function): Optional callback when element is revealed
- `options` (object): IntersectionObserver options

## Navigation Utilities

### Get Section Anchors

```javascript
import { getSectionAnchors } from '@/utils/scrollToAnchor';

// Get all section IDs on the page
const anchors = getSectionAnchors();
// ['home', 'about', 'courses', 'gallery', 'contact']
```

### Get Active Section

```javascript
import { getActiveSection } from '@/utils/scrollToAnchor';

// Get currently active section based on scroll position
const sectionIds = ['home', 'about', 'courses'];
const activeSection = getActiveSection(sectionIds);
// 'courses'
```

**Parameters:**

- `sectionIds` (array): Array of section IDs to check

## Back to Top Button

### Initialize Back to Top

```javascript
import { initBackToTop } from '@/utils/scrollToAnchor';

// Initialize with default settings
const cleanup = initBackToTop();

// Initialize with custom settings
const cleanup = initBackToTop('my-back-button', 500);

// Cleanup on component unmount
return () => cleanup();
```

**Parameters:**

- `buttonId` (string): ID of the back to top button (default: 'back-to-top')
- `showAfter` (number): Scroll distance in pixels before showing button (default: 300)

## React Integration

### Navigation Component Example

```javascript
import { scrollToElement, getActiveSection, getSectionAnchors } from '@/utils/scrollToAnchor';

function Navigation({ activeSection, setActiveSection }) {
  const sectionIds = ['home', 'about', 'courses', 'gallery', 'contact'];

  useEffect(() => {
    const handleScroll = () => {
      const active = getActiveSection(sectionIds);
      setActiveSection(active);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    scrollToElement(sectionId);
  };

  return (
    <nav>
      {sectionIds.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          className={activeSection === id ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick(id);
          }}
        >
          {id.charAt(0).toUpperCase() + id.slice(1)}
        </a>
      ))}
    </nav>
  );
}
```

## CSS Classes

Add these CSS classes for scroll reveal animations:

```css
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.reveal-on-scroll.revealed {
  opacity: 1;
  transform: translateY(0);
}

#back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
}

#back-to-top.visible {
  opacity: 1;
  visibility: visible;
}
```

## Performance Considerations

- Intersection Observer is used for efficient scroll detection
- Elements are unobserved after being revealed to improve performance
- Smooth scrolling uses native browser APIs when available
- Event listeners are properly cleaned up to prevent memory leaks

## Accessibility

- Focus management ensures keyboard navigation works correctly
- Screen readers can navigate to anchor targets
- Reduced motion preferences are respected (uses CSS transitions)
- ARIA attributes are maintained during scroll operations

## Browser Support

- Modern browsers with Intersection Observer support
- Fallback for older browsers (basic scroll behavior)
- Graceful degradation for unsupported features

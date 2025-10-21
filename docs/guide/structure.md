# Project Structure

Understanding the project structure will help you navigate and contribute effectively.

## Directory Overview

```
react-scuba/
├── .github/           # GitHub workflows and config
├── .vscode/           # VS Code settings
├── docs/              # VitePress documentation
├── public/            # Static assets (served as-is)
├── src/               # Source code
├── dist/              # Production build (generated)
└── node_modules/      # Dependencies (generated)
```

## Source Code (`src/`)

### Component Organization

```
src/
├── assets/           # Static assets (images, SVGs)
│   ├── logo.svg
│   ├── placeholder.svg
│   └── README.md
│
├── components/       # React components
│   ├── about/        # About page components
│   ├── courses/      # Course components
│   ├── dive-sites/   # Dive site components
│   ├── gallery/      # Gallery components
│   ├── home/         # Homepage sections
│   ├── modals/       # Modal dialogs
│   └── shared/       # Reusable components
│
├── data/             # Static data files
│   ├── bookingTypes.js
│   ├── courses.js
│   ├── credentials.js
│   ├── diveSites.js
│   ├── gallery.js
│   └── team.js
│
├── layouts/          # Layout components
│   ├── Footer.jsx
│   ├── Header.jsx
│   └── Navigation.jsx
│
├── pages/            # Page components (routes)
│   ├── AboutPage.jsx
│   ├── CoursesPage.jsx
│   ├── DiveSitesPage.jsx
│   ├── GalleryPage.jsx
│   └── HomePage.jsx
│
├── styles/           # CSS utilities
│   ├── animations.css
│   ├── components.css
│   ├── index.css
│   └── utilities.css
│
├── utils/            # Helper functions
│   ├── analytics.js
│   ├── scrollToAnchor.js
│   └── seo.js
│
├── App.css          # Global app styles
├── App.jsx          # Main app component
├── index.css        # Tailwind imports
└── index.jsx        # Entry point
```

## Component Structure

### Feature-Based Organization

Components are organized by feature/page for better maintainability:

```
components/
└── home/
    ├── HeroSection.jsx       # Hero banner
    ├── ServicesSection.jsx   # Services grid
    ├── FeaturesSection.jsx   # Statistics
    ├── TestimonialsSection.jsx
    ├── CTASection.jsx        # Call to action
    ├── HomePage.jsx          # Orchestrator
    └── index.js              # Barrel export
```

### Naming Conventions

- **Components:** PascalCase (e.g., `HeroSection.jsx`)
- **Utilities:** camelCase (e.g., `scrollToAnchor.js`)
- **CSS files:** kebab-case (e.g., `utilities.css`)
- **Data files:** camelCase (e.g., `diveSites.js`)

## Data Layer (`src/data/`)

Centralized data management:

```javascript
// data/courses.js
export const COURSES = [
  {
    id: 'open-water',
    title: 'Open Water Diver',
    price: 350,
    duration: '3-4 days',
    // ... more fields
  },
  // ... more courses
];
```

Benefits:

- ✅ Single source of truth
- ✅ Easy to update content
- ✅ No hardcoded data in components
- ✅ Reusable across pages

## Styles Organization

### Four-Layer System

1. **index.css** - Tailwind imports & base layers
2. **utilities.css** - Custom utility classes
3. **components.css** - Third-party customization
4. **animations.css** - Keyframe animations

```css
/* utilities.css */
.btn-primary {
  /* Custom button */
}
.scroll-mt-header {
  /* Scroll offset */
}

/* components.css */
.react-datepicker {
  /* DatePicker styles */
}

/* animations.css */
@keyframes fadeIn {
  /* Animation */
}
```

## Public Assets (`public/`)

Served directly without processing:

```
public/
├── manifest.json    # PWA manifest
├── robots.txt       # SEO robots file
└── sitemap.xml      # Sitemap (if static)
```

## Configuration Files

### Root Level

```
react-scuba/
├── package.json          # Dependencies & scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind settings
├── postcss.config.js     # PostCSS plugins
├── jsconfig.json         # JavaScript config
├── .gitignore            # Git exclusions
└── .env                  # Environment variables
```

### Key Configurations

**vite.config.js:**

```javascript
export default defineConfig({
  plugins: [react()],
  // Build & dev server settings
});
```

**tailwind.config.js:**

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          /* Custom colors */
        },
      },
    },
  },
};
```

## Import Patterns

### Absolute Imports

```javascript
// Configured in jsconfig.json
import { HomePage } from '@/pages/HomePage';
import { courses } from '@/data/courses';
```

### Barrel Exports

```javascript
// components/home/index.js
export { HeroSection } from "./HeroSection";
export { ServicesSection } from "./ServicesSection";
// ... more exports

// Usage
import { HeroSection, ServicesSection } from ../reference/components/home";
```

## File Size Guidelines

- **Components:** < 250 lines (prefer smaller)
- **Data files:** < 300 lines
- **Utility modules:** < 200 lines
- **Page components:** < 300 lines

If a file exceeds these limits, consider decomposition.

## Best Practices

### Component Files

```jsx
// 1. Imports
import { useState } from 'react';
import PropTypes from 'prop-types';

// 2. Component definition
export default function MyComponent({ prop1, prop2 }) {
  // Logic
  return (/* JSX */);
}

// 3. PropTypes validation
MyComponent.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};
```

### Data Files

```javascript
// Export constants
export const DATA_ITEMS = [
  /* array */
];

// Export functions if needed
export function getItemById(id) {
  return DATA_ITEMS.find((item) => item.id === id);
}
```

## Documentation Structure (`docs/`)

```
docs/
├── .vitepress/          # VitePress config
│   └── config.js
├── getting-started/     # Getting started guides
├── components/          # Component docs
├── api/                 # API reference
├── deployment/          # Deploy guides
├── contributing/        # Contribution guide
└── index.md            # Homepage
```

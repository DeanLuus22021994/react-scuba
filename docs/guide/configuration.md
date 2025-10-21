# Configuration

<div class="feature-card">

Complete guide to configuring React Scuba for development and production environments.

</div>

## Overview

React Scuba uses a modern build setup with Vite, Tailwind CSS, and optimized tooling for fast development and production builds.

## Build Configuration

### Vite Configuration

The project uses Vite as the build tool with the following key features:

- **React Fast Refresh** for instant hot reloading
- **Intelligent code splitting** for optimal bundle sizes
- **Path aliases** (`@/` for `src/`)
- **Modern ESNext target** for better optimization
- **Terser minification** with console removal in production

### Key Vite Settings

```javascript
// vite.config.js highlights
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Path alias
    },
  },
  build: {
    target: 'esnext', // Modern browsers
    chunkSizeWarningLimit: 500, // Larger chunks allowed
    // Intelligent code splitting by library type
  },
});
```

## Styling Configuration

### Tailwind CSS Setup

The project uses Tailwind CSS v4 with custom ocean and coral color palettes:

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          /* Blue palette */
        },
        coral: {
          /* Red palette */
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

### Custom Color Palette

- **Ocean colors**: Professional blue tones for primary UI elements
- **Coral colors**: Accent colors for CTAs and highlights
- **Inter font**: Modern, readable typography

## Environment Configuration

### Environment Variables

The application supports the following environment variables:

```bash
# App Configuration
VITE_APP_URL=http://localhost:3000

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX

# API Configuration
VITE_API_BASE_URL=https://api.example.com

# Security
VITE_RECAPTCHA_SITE_KEY=your_site_key
```

### Development vs Production

**Development:**

- Hot module replacement enabled
- Source maps for debugging
- Console logs preserved
- CORS enabled for API calls

**Production:**

- Code minification and compression
- Console logs removed
- Optimized chunk splitting
- CDN-ready assets

## Testing Configuration

### Vitest Setup

The project uses Vitest with jsdom for comprehensive testing:

```javascript
// vite.config.js test configuration
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/setupTests.js',
  css: true,
},
```

### Test Categories

- **Unit tests**: Component and utility function testing
- **Integration tests**: Page-level functionality
- **E2E tests**: Full user journey testing with Playwright

## Development Tools

### ESLint Configuration

Code quality is enforced with ESLint rules for:

- React best practices
- Accessibility (jsx-a11y)
- Import organization
- Code consistency

### Prettier Configuration

Code formatting is automated with Prettier for:

- Consistent indentation (2 spaces)
- Semicolons always included
- Single quotes for strings
- Trailing commas in objects/arrays

## Performance Optimizations

### Build Optimizations

- **Tree shaking**: Unused code automatically removed
- **Code splitting**: Libraries loaded on-demand
- **Asset optimization**: Images and fonts optimized
- **CSS purging**: Unused styles removed

### Runtime Optimizations

- **React.lazy()**: Components loaded on-demand
- **Image optimization**: WebP format with fallbacks
- **Font loading**: Optimized with font-display: swap
- **Bundle analysis**: Tools to monitor bundle sizes

## Deployment Configuration

### Platform-Specific Settings

Each deployment platform has optimized configurations:

- **Vercel**: Automatic React optimization
- **Netlify**: Edge functions and forms support
- **GitHub Pages**: Static hosting with SPA routing

### Environment-Specific Builds

```javascript
// Conditional feature flags
const isProduction = process.env.NODE_ENV === 'production';
const enableAnalytics = !!import.meta.env.VITE_GA_MEASUREMENT_ID;
```

## Advanced Configuration

### Custom Plugins

The build system supports custom Vite plugins for:

- Asset processing
- Environment variable validation
- Build optimization
- Deployment integration

### Monorepo Support

Configuration is designed to work in monorepo setups with:

- Shared configurations
- Cross-package imports
- Unified build pipelines
- Consistent tooling across packages

# GitHub Pages Deployment

Deploy the SCUBA Bali React application to GitHub Pages for free, fast, and reliable static hosting directly from your repository.

## Overview

GitHub Pages provides:

- Free hosting for static websites
- Automatic deployments from GitHub repositories
- Custom domain support with SSL
- Global CDN through GitHub's infrastructure
- Integration with GitHub Actions for CI/CD

## Quick Start

### Automatic Deployment

1. **Enable GitHub Pages in repository**
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch
   - Save

2. **Set up GitHub Actions workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: scubabali.com # Optional: for custom domain
```

### Manual Deployment

If you prefer manual control:

```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Add deploy script to package.json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}

# Build and deploy
npm run build
npm run deploy
```

## Configuration

### Vite Configuration for GitHub Pages

Update `vite.config.js` for proper asset handling:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'react-router-dom'],
        },
      },
    },
  },
});
```

### Environment Variables

Set up environment variables for production:

```javascript
// src/config/env.js
const isProduction = import.meta.env.PROD;
const isGitHubPages = import.meta.env.BASE_URL?.includes('github.io');

export const config = {
  baseUrl: isProduction && isGitHubPages ? `${import.meta.env.BASE_URL}` : '',
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.scubabali.com',
  gaId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  gtmId: import.meta.env.VITE_GTM_ID,
  recaptchaKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
};
```

## Custom Domain Setup

### Add Custom Domain

1. **Repository Settings**
   - Go to Settings → Pages
   - Enter your custom domain (e.g., `scubabali.com`)
   - Save changes

2. **DNS Configuration**

For apex domain:

```text
A Record: @ → 185.199.108.153
A Record: @ → 185.199.109.153
A Record: @ → 185.199.110.153
A Record: @ → 185.199.111.153
```

For www subdomain:

```text
CNAME: www → yourusername.github.io
```

3. **SSL Certificate**
   - GitHub automatically provisions SSL
   - Enable "Enforce HTTPS" after DNS propagation

### Domain Verification

Check DNS propagation:

```bash
# Check A records
dig scubabali.com

# Check SSL certificate
curl -I https://scubabali.com
```

## Routing Configuration

### SPA Routing

GitHub Pages doesn't support server-side routing. Create `404.html` for client-side routing:

```html
<!-- public/404.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>SCUBA Bali</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      // This script takes the current url and converts the path and query
      // string into just a query string, and then redirects the browser
      // to the new url with only a query string and hash fragment,
      // e.g., https://www.foo.tld/one/two?a=b&c=d#qwe, becomes
      // https://www.foo.tld/?/one/two&a=b~and~c=d#qwe
      // Note: this 404.html file must be at least 512 bytes for it to work
      // with Internet Explorer (it is currently > 512 bytes)

      // If you're using a custom domain, replace 'yourusername.github.io' with your domain
      var redirect =
        'https://yourusername.github.io/?p=' +
        encodeURIComponent(
          window.location.pathname.slice(1) + window.location.search + window.location.hash
        );
      window.location.replace(redirect);
    </script>
  </head>
  <body></body>
</html>
```

Update your router configuration:

```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>{/* Your routes */}</Routes>
    </BrowserRouter>
  );
}
```

## Performance Optimization

### Build Optimization

Configure Vite for optimal builds:

```javascript
// vite.config.js
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['framer-motion', 'react-router-dom'],
          'map-vendor': ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
});
```

### Asset Optimization

```javascript
// Optimize images and assets
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    assetsInlineLimit: 4096, // Inline small assets
    cssCodeSplit: true, // Split CSS for better caching
    sourcemap: false, // Disable sourcemaps for production
  },
});
```

### Caching Strategy

Set appropriate cache headers:

```javascript
// public/_headers (for Netlify-style headers)
// GitHub Pages doesn't support custom headers, but you can use meta tags

// In index.html
<meta http-equiv="Cache-Control" content="max-age=31536000, public">
```

## Analytics Integration

### Google Analytics 4

```javascript
// src/utils/analytics.js
import { init, track } from './analytics-core';

export const initAnalytics = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_GA_MEASUREMENT_ID) {
    init(import.meta.env.VITE_GA_MEASUREMENT_ID);
  }
};

export const trackPageView = (page) => {
  track('page_view', { page_path: page });
};

export const trackEvent = (event, parameters = {}) => {
  track(event, parameters);
};
```

### Google Tag Manager

```javascript
// src/utils/gtm.js
export const initGTM = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_GTM_ID) {
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', import.meta.env.VITE_GTM_ID);
  }
};
```

## Security Considerations

### Content Security Policy

Add CSP headers (limited support on GitHub Pages):

```html
<!-- public/index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.scubabali.com;
"
/>
```

### Environment Variables Security

Never commit secrets to repository:

```javascript
// ❌ Bad: Hardcoded secrets
const API_KEY = 'sk-1234567890';

// ✅ Good: Environment variables
const API_KEY = import.meta.env.VITE_API_KEY;
```

## Testing & Validation

### Local Testing

Test GitHub Pages deployment locally:

```bash
# Install serve globally
npm install -g serve

# Build and serve
npm run build
serve -s dist -l 3000
```

### Link Checking

Validate all links work correctly:

```javascript
// src/utils/linkChecker.js
export const checkLinks = async () => {
  const links = document.querySelectorAll('a[href]');
  const brokenLinks = [];

  for (const link of links) {
    try {
      const response = await fetch(link.href, { method: 'HEAD' });
      if (!response.ok) {
        brokenLinks.push(link.href);
      }
    } catch (error) {
      brokenLinks.push(link.href);
    }
  }

  return brokenLinks;
};
```

## CI/CD Pipeline

### Advanced GitHub Actions

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Build
        run: npm run build

      - name: Run link checker
        run: npm run test:docs

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: scubabali.com
```

## Troubleshooting

### Common Issues

**404 errors on refresh:**

- Ensure `404.html` is properly configured
- Check router basename configuration
- Verify build output structure

**Assets not loading:**

```bash
# Check build output
ls -la dist/

# Verify asset paths in built files
grep -r "assets/" dist/
```

**Build failures:**

```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Custom domain issues:**

```bash
# Check DNS propagation
dig scubabali.com

# Verify GitHub Pages configuration
curl -I https://scubabali.com
```

### Performance Issues

**Large bundle size:**

```bash
# Analyze bundle
npm install --save-dev webpack-bundle-analyzer
npm run build -- --mode analyze
```

**Slow loading:**

- Enable gzip compression (automatic on GitHub Pages)
- Optimize images and assets
- Implement code splitting
- Use CDN for external resources

## Limitations

### GitHub Pages Limitations

- **No server-side rendering** - Client-side only
- **No custom headers** - Limited security headers
- **No environment variables** - All config must be build-time
- **No backend functionality** - Static hosting only
- **Build minutes limit** - 2,000 minutes/month for free accounts

### Workarounds

**Serverless functions:**

- Use Netlify Functions or Vercel for backend functionality
- Implement API routes through external services

**Dynamic content:**

- Use client-side JavaScript for dynamic features
- Implement caching strategies for frequently changing data

## Migration from Other Platforms

### From Netlify/Vercel

1. **Update build configuration** for GitHub Pages paths
2. **Configure routing** with 404.html fallback
3. **Set up GitHub Actions** for automated deployment
4. **Update DNS** to point to GitHub Pages
5. **Test thoroughly** before going live

### Cost Comparison

**GitHub Pages:**

- Free for public repositories
- Unlimited bandwidth
- Global CDN included

**Netlify/Vercel:**

- Generous free tiers
- More features and better performance
- Commercial options available

## Best Practices

### Repository Organization

- Keep source and build output separate
- Use branches for staging environments
- Implement proper CI/CD workflows
- Document deployment process

### Security

- Never commit secrets to repository
- Use environment variables for configuration
- Implement proper CSP headers
- Regularly update dependencies

### Performance

- Optimize bundle size and loading
- Implement proper caching strategies
- Use CDN for assets when possible
- Monitor Core Web Vitals

### Maintenance

- Set up automated testing and deployment
- Monitor site performance and uptime
- Keep dependencies updated
- Document changes and updates

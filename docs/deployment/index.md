# Deployment

Guide for deploying React Scuba to production on various platforms.

## Overview

React Scuba is optimized for deployment on modern hosting platforms. Choose the one that best fits your needs.

## Quick Deploy Options

### Recommended Platforms

| Platform                                     | Build Time | Deploy Time | Ease       | Cost                  |
| -------------------------------------------- | ---------- | ----------- | ---------- | --------------------- |
| **[Vercel](/deployment/vercel)**             | ~30s       | ~5s         | ⭐⭐⭐⭐⭐ | Free tier available   |
| **[Netlify](/deployment/netlify)**           | ~40s       | ~10s        | ⭐⭐⭐⭐⭐ | Free tier available   |
| **[GitHub Pages](/deployment/github-pages)** | ~1m        | ~15s        | ⭐⭐⭐⭐   | Free for public repos |
| **[Docker](/deployment/docker)**             | ~2m        | Varies      | ⭐⭐⭐     | Self-hosted           |

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Production environment variables configured
- [ ] Google Analytics / GTM IDs set up
- [ ] reCAPTCHA keys configured
- [ ] API endpoints configured
- [ ] Custom domain ready (optional)
- [ ] SSL certificate configured
- [ ] Build succeeds locally (`npm run build`)
- [ ] All tests passing (`npm test`)

## Environment Variables

All platforms require these variables:

```env
# Required
VITE_APP_URL=https://yourdomain.com

# Google Services
VITE_GTM_ID=GTM-XXXXXXX
VITE_GA4_ID=G-XXXXXXXXXX
VITE_RECAPTCHA_SITE_KEY=your_site_key

# API Configuration
VITE_API_ENDPOINT=https://api.yourdomain.com

# Contact Information
VITE_PHONE_NUMBER=+230XXXXXXXX
VITE_EMAIL=info@yourdomain.com
VITE_WHATSAPP_NUMBER=+230XXXXXXXX
```

See [Service Setup Guides](/deployment/gtm) for obtaining these values.

## Build Configuration

React Scuba uses Vite for building. The default configuration works for most platforms:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
});
```

Expected build output:

```bash
✓ built in 8.42s
dist/index.html                   0.51 kB
dist/assets/index-hash.css       45.22 kB
dist/assets/index-hash.js       347.18 kB gzipped
```

## Performance Optimization

After deployment, verify your site meets these targets:

| Metric                      | Target  | Tool                    |
| --------------------------- | ------- | ----------------------- |
| **Lighthouse Performance**  | 90+     | Chrome DevTools         |
| **First Contentful Paint**  | < 1.8s  | PageSpeed Insights      |
| **Time to Interactive**     | < 3.8s  | PageSpeed Insights      |
| **Cumulative Layout Shift** | < 0.1   | PageSpeed Insights      |
| **Total Bundle Size**       | < 500KB | Webpack Bundle Analyzer |

## Deployment Guides

Choose your platform:

### Quick Deploy

- **[Vercel](/deployment/vercel)** - One-click deploy with GitHub integration
- **[Netlify](/deployment/netlify)** - Drag & drop or Git-based deployment

### Advanced Deploy

- **[GitHub Pages](/deployment/github-pages)** - Free hosting with GitHub Actions
- **[Docker](/deployment/docker)** - Containerized deployment for any platform

### Service Integration

- **[Google Tag Manager](/deployment/gtm)** - Analytics and tracking setup
- **[Google Analytics](/deployment/analytics)** - GA4 configuration
- **[reCAPTCHA](/deployment/recaptcha)** - Form protection setup
- **[Custom Domain](/deployment/domain)** - DNS configuration

## Post-Deployment

After deployment:

1. **Test thoroughly** - Check all pages and features
2. **Verify analytics** - Confirm GTM/GA4 are tracking
3. **Check forms** - Test contact and booking forms
4. **Test mobile** - Verify responsive design
5. **Monitor errors** - Set up error tracking
6. **Set up monitoring** - Use Uptime Robot or similar

## Troubleshooting

### Common Issues

**Build failures:**

```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

**Environment variables not working:**

- Ensure all `VITE_` prefixed variables are set
- Restart dev server after changes
- Check platform-specific variable configuration

**404 on page refresh:**

- Configure redirects for SPA routing
- See platform-specific guides for details

## CI/CD Setup

React Scuba includes GitHub Actions workflows:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm run deploy
```

## Need Help?

- Check platform-specific guides in the sidebar
- Review [Environment Variables Guide](/guide/environment)
- Ask in [GitHub Discussions](https://github.com/DeanLuus22021994/react-scuba/discussions)

---

**Deployment Time:** 5-15 minutes • **Difficulty:** Easy • **Support:** Multiple platforms

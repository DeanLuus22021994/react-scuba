# Netlify Deployment

## Overview

Deploy the SCUBA Bali React application to Netlify with continuous deployment from GitHub.

## Prerequisites

- [Netlify Account](https://app.netlify.com/signup)
- GitHub repository
- Node.js 18+ installed locally

## Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/DeanLuus22021994/react-scuba)

## Manual Deployment

### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Login to Netlify

```bash
netlify login
```

### 3. Initialize Site

```bash
netlify init
```

### 4. Deploy

```bash
# Deploy to production
netlify deploy --prod

# Deploy preview
netlify deploy
```

## Configuration

### netlify.toml

Create a `netlify.toml` file in the project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Environment Variables

### Required Variables

Configure in Netlify Dashboard under Site Settings → Environment Variables:

```bash
# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Tag Manager
VITE_GTM_ID=GTM-XXXXXXX

# API Configuration
VITE_API_BASE_URL=https://api.scubabali.com

# reCAPTCHA
VITE_RECAPTCHA_SITE_KEY=your_site_key
```

### Setting Environment Variables

**Via Netlify Dashboard:**

1. Site Settings → Environment Variables
2. Click "Add a variable"
3. Enter key and value
4. Select scopes (all or specific contexts)
5. Save and redeploy

**Via Netlify CLI:**

```bash
netlify env:set VITE_GA_MEASUREMENT_ID "G-XXXXXXXXXX"
netlify env:set VITE_GTM_ID "GTM-XXXXXXX"
```

## Automatic Deployments

### GitHub Integration

1. **Connect Repository**

   ```bash
   netlify init
   ```

   Select "Create & configure a new site"

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 20

3. **Deploy Triggers**
   - Production: Pushes to `main` branch
   - Deploy Previews: Pull requests

### Build Hooks

Create webhook for external triggers:

1. Site Settings → Build & Deploy → Build Hooks
2. Add build hook (e.g., "Manual Deploy")
3. Trigger via:

```bash
curl -X POST -d {} https://api.netlify.com/build_hooks/YOUR_HOOK_ID
```

## Custom Domain

### Add Domain

1. **Via Dashboard:**
   - Site Settings → Domain Management
   - Add custom domain
   - Follow DNS configuration instructions

2. **DNS Configuration:**

```text
# Primary domain
A Record: @ → 75.2.60.5

# www subdomain
CNAME: www → your-site.netlify.app
```

### SSL Certificate

Netlify automatically provisions and renews Let's Encrypt SSL certificates.

## Performance Features

### Edge Network

Netlify provides:

- Global CDN (Netlify Edge)
- Automatic compression (Brotli/gzip)
- HTTP/2 & HTTP/3 support
- Instant cache invalidation

### Build Plugins

Install useful plugins in `netlify.toml`:

```toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"

[[plugins]]
  package = "netlify-plugin-cache"

  [plugins.inputs]
    paths = ["node_modules", ".cache"]
```

## Forms & Functions

### Netlify Forms

Add contact forms with serverless backend:

```jsx
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

### Serverless Functions

Create API endpoints in `netlify/functions/`:

```javascript
// netlify/functions/api.js
export async function handler(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Netlify!' }),
  };
}
```

## Analytics

### Netlify Analytics

Enable in Site Settings → Analytics:

- Server-side analytics (no client-side scripts)
- Privacy-focused
- No cookie consent required

### Integration with GA4

Netlify Analytics complements Google Analytics 4 for comprehensive insights.

## Monitoring

### Deploy Logs

View build logs:

```bash
netlify watch
netlify logs
```

### Status Badge

Add deployment status to README:

```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)
```

## Troubleshooting

### Build Failures

**Peer Dependencies:**

```toml
[build.environment]
  NPM_FLAGS = "--legacy-peer-deps"
```

**Memory Issues:**

```toml
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=4096"
```

### 404 Errors

Ensure redirect rule in `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables Not Loading

- Verify variable names start with `VITE_`
- Check scopes (production/deploy previews/branch deploys)
- Clear cache and redeploy: `netlify build --clear-cache`

### Deploy Preview Issues

**Disable automatic deploys for branches:**

```toml
[context.branch-deploy]
  command = "echo 'Skipping build'"
```

## Advanced Features

### Split Testing

A/B test different versions:

1. Create branch for variant
2. Site Settings → Split Testing
3. Configure traffic distribution

### Edge Functions

Run code at the edge:

```javascript
// netlify/edge-functions/greeting.js
export default async (request, context) => {
  return new Response('Hello from the edge!');
};
```

## Migration from Other Platforms

### From Vercel

1. Import git repository to Netlify
2. Configure same build settings
3. Add environment variables
4. Update DNS records

### From GitHub Pages

1. Connect repository
2. Update build command to `npm run build`
3. Set publish directory to `dist`
4. Configure custom domain

## Related

- [Deployment Overview](/deployment/)
- [Environment Variables](/guide/environment)
- [GitHub Pages](/deployment/github-pages)
- [Vercel](/deployment/vercel)

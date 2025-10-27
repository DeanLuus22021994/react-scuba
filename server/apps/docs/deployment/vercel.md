# Vercel Deployment

## Overview

Deploy the SCUBA Bali React application to Vercel with automatic deployments from GitHub.

## Prerequisites

- [Vercel Account](https://vercel.com/signup)
- GitHub repository connected
- Environment variables configured

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DeanLuus22021994/react-scuba)

## Manual Deployment

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
# Production deployment
vercel --prod

# Preview deployment
vercel
```

## Configuration

### vercel.json

Create a `vercel.json` file in the project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm start",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Environment Variables

### Required Variables

Set these in your Vercel project settings:

```bash
# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Tag Manager
VITE_GTM_ID=GTM-XXXXXXX

# API Endpoints
VITE_API_BASE_URL=https://api.scubabali.com

# reCAPTCHA
VITE_RECAPTCHA_SITE_KEY=your_site_key
```

### Setting Environment Variables

**Via Vercel Dashboard:**

1. Go to Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development
3. Click "Save"

**Via Vercel CLI:**

```bash
vercel env add VITE_GA_MEASUREMENT_ID production
vercel env add VITE_GTM_ID production
```

## Automatic Deployments

### GitHub Integration

1. **Connect Repository**
   - Go to Vercel Dashboard
   - Click "Import Project"
   - Select GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`

3. **Deploy**
   - Every push to `main` → Production deployment
   - Every PR → Preview deployment

## Custom Domain

### Add Domain

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `scubabali.com`)
3. Configure DNS records:

```text
A Record: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

### SSL Certificate

Vercel automatically provisions SSL certificates for all domains.

## Performance Optimization

### Edge Network

Vercel's Edge Network automatically optimizes:

- Static asset caching
- Compression (Brotli/gzip)
- Image optimization
- Global CDN distribution

### Analytics

Enable Vercel Analytics:

```bash
npm install @vercel/analytics
```

```jsx
// src/index.jsx
import { Analytics } from '@vercel/analytics/react';

root.render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
```

## Monitoring

### Vercel Logs

View deployment and runtime logs:

```bash
vercel logs <deployment-url>
```

### Build Logs

Check build output in the Vercel dashboard for debugging failed deployments.

## Troubleshooting

### Build Failures

**Peer Dependency Issues:**

```bash
# Ensure install command uses --legacy-peer-deps
npm install --legacy-peer-deps
```

**Memory Errors:**

```json
{
  "build": {
    "env": {
      "NODE_OPTIONS": "--max-old-space-size=4096"
    }
  }
}
```

### 404 Errors

Ensure rewrites are configured in `vercel.json` for SPA routing.

### Environment Variables Not Loading

- Check variable names start with `VITE_`
- Verify variables are set for the correct environment
- Redeploy after changing environment variables

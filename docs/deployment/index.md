# Deployment Overview

This guide covers various deployment strategies for the SCUBA Bali React application, helping you choose the best platform for your needs.

## Deployment Platforms

### Static Site Hosting

**Best for:** Simple deployments, documentation sites, marketing pages

- **[GitHub Pages](/deployment/github-pages)** - Free hosting directly from your repository
- **[Netlify](/deployment/netlify)** - Modern hosting with continuous deployment and serverless functions
- **[Vercel](/deployment/vercel)** - Optimized for React applications with global CDN

### Containerized Deployment

**Best for:** Complex applications, microservices, enterprise deployments

- **[Docker](/deployment/docker)** - Containerize your application for consistent deployment across environments

### Domain & Infrastructure

**Best for:** Production deployments requiring custom domains and advanced configuration

- **[Domain Configuration](/deployment/domain)** - DNS setup, SSL certificates, and custom domain management

## Analytics & Monitoring

**Best for:** Tracking user behavior, performance monitoring, and business intelligence

- **[Analytics](/deployment/analytics)** - Google Analytics 4 setup and configuration
- **[Google Tag Manager](/deployment/gtm)** - Tag management and event tracking

## Security & Protection

**Best for:** Form protection, spam prevention, and user verification

- **[reCAPTCHA](/deployment/recaptcha)** - Bot protection and spam prevention for forms

## Platform Comparison

| Platform     | Free Tier              | Custom Domain | SSL | CDN | Build Minutes | Serverless Functions |
| ------------ | ---------------------- | ------------- | --- | --- | ------------- | -------------------- |
| GitHub Pages | ✅ Unlimited           | ✅            | ✅  | ✅  | 2,000/month   | ❌                   |
| Netlify      | ✅ 100GB bandwidth     | ✅            | ✅  | ✅  | 300/month     | ✅                   |
| Vercel       | ✅ Unlimited bandwidth | ✅            | ✅  | ✅  | 6,000/month   | ✅                   |
| Docker       | ✅                     | ✅            | ✅  | ❌  | Unlimited     | ✅                   |

## Quick Start

### For Beginners

If you're new to deployment, start with **GitHub Pages** - it's free, simple, and directly integrated with your repository.

### For React Apps

For optimal React performance, choose **Vercel** - it provides the best developer experience and performance optimizations.

### For Full-Stack Features

If you need serverless functions, forms, or advanced features, **Netlify** offers the most comprehensive platform.

### For Enterprise

For containerized deployments with full control, use **Docker** with your preferred cloud provider.

## Environment Variables

All deployment platforms support environment variables for configuration. Required variables include:

- `VITE_GA_MEASUREMENT_ID` - Google Analytics tracking ID
- `VITE_GTM_ID` - Google Tag Manager container ID
- `VITE_API_BASE_URL` - Backend API endpoint
- `VITE_RECAPTCHA_SITE_KEY` - reCAPTCHA site key

## Build Configuration

The application uses Vite as the build tool. Standard build commands:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build locally
npm run preview
```

# SEO Optimization

<div class="feature-card">

Comprehensive SEO implementation using React Helmet Async, structured data (JSON-LD), and performance optimizations for better search engine visibility.

</div>

## Overview

React Scuba implements a comprehensive SEO strategy that includes dynamic meta tags, structured data markup, and performance optimizations to improve search engine visibility and user experience.

## Meta Tags Management

### React Helmet Async Integration

The application uses **React Helmet Async** for dynamic meta tag management:

```jsx
import { Helmet } from 'react-helmet-async';

// In components
<Helmet>
  <title>Page Title</title>
  <meta name="description" content="Page description" />
  <link rel="canonical" href="https://example.com/page" />
</Helmet>;
```

### SEO Component

A reusable `SEO` component handles page-specific meta tags:

```jsx
import SEO from '../common/SEO';

// Usage in pages
<SEO page="home" />
<SEO
  page="courses"
  customTitle="Custom Course Title"
  customDescription="Custom description"
/>
```

## Page-Specific Meta Tags

### Default Meta Configuration

Base meta tags defined in `seo.js`:

```javascript
const defaultMetaTags = {
  title: 'Mauritius Scuba Diving Center | PADI Certified Diving Courses & Tours',
  description: 'Discover the underwater paradise of Mauritius...',
  keywords: 'mauritius scuba diving, padi courses mauritius...',
  ogImage: 'https://www.mauritiusscuba.com/images/og-image.jpg',
  twitterCard: 'summary_large_image',
};
```

### Page-Specific Tags

Dynamic meta tags for each page:

```javascript
const pages = {
  home: {
    title: 'Mauritius Scuba Diving Center | PADI Certified...',
    description: 'Discover the underwater paradise...',
    canonical: 'https://www.mauritiusscuba.com',
  },
  courses: {
    title: 'PADI Diving Courses | Scuba Certification in Mauritius',
    description: 'Get PADI certified in Mauritius!...',
    canonical: 'https://www.mauritiusscuba.com/courses',
  },
  // ... other pages
};
```

## Structured Data (JSON-LD)

### Local Business Schema

Comprehensive local business markup for search engines:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Mauritius Scuba Diving Center",
  "description": "Professional scuba diving center in Mauritius...",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Coastal Road",
    "addressLocality": "Grand Baie",
    "addressRegion": "Rivière du Rempart",
    "postalCode": "30501",
    "addressCountry": "MU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -20.348404,
    "longitude": 57.552152
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "18:00"
    }
  ]
}
```

### Course Schema

Structured data for diving courses:

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "PADI Open Water Diver",
  "description": "Complete scuba diving certification course...",
  "provider": {
    "@type": "Organization",
    "name": "Mauritius Scuba Diving Center"
  },
  "offers": {
    "@type": "Offer",
    "price": "450",
    "priceCurrency": "USD"
  }
}
```

### Breadcrumb Schema

Navigation breadcrumb markup:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.mauritiusscuba.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Courses",
      "item": "https://www.mauritiusscuba.com/courses"
    }
  ]
}
```

## Social Media Optimization

### Open Graph Tags

Facebook and LinkedIn sharing optimization:

```html
<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.mauritiusscuba.com" />
<meta property="og:title" content="Mauritius Scuba Diving Center" />
<meta property="og:description" content="Discover the underwater paradise..." />
<meta property="og:image" content="https://www.mauritiusscuba.com/og-image.jpg" />
<meta property="og:locale" content="en_US" />
<meta property="og:site_name" content="Mauritius Scuba Diving" />
```

### Twitter Cards

Twitter sharing optimization:

```html
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Mauritius Scuba Diving Center" />
<meta name="twitter:description" content="Discover the underwater paradise..." />
<meta name="twitter:image" content="https://www.mauritiusscuba.com/twitter-image.jpg" />
```

## Technical SEO

### Canonical URLs

Proper canonical URL implementation:

```html
<link rel="canonical" href="https://www.mauritiusscuba.com/courses" />
```

### Robots Meta Tag

Search engine crawling instructions:

```html
<meta name="robots" content="index, follow" />
```

### Geo Tags

Location-based SEO optimization:

```html
<meta name="geo.region" content="MU" />
<meta name="geo.placename" content="Mauritius" />
<meta name="geo.position" content="-20.348404;57.552152" />
<meta name="ICBM" content="-20.348404, 57.552152" />
```

## Performance Optimization

### Core Web Vitals

SEO-friendly performance metrics:

- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **FID (First Input Delay)**: < 100 milliseconds
- **CLS (Cumulative Layout Shift)**: < 0.1

### Image Optimization

SEO-optimized images with proper attributes:

```html
<img
  src="/images/dive-site.jpg"
  alt="Blue Bay dive site with coral reef"
  width="800"
  height="600"
  loading="lazy"
/>
```

### Font Loading

Optimized font loading for better performance:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

## Local SEO

### Google My Business Integration

Local search optimization elements:

- **Business name**: Mauritius Scuba Diving Center
- **Address**: Coastal Road, Grand Baie, Mauritius
- **Phone**: +230-XXXX-XXXX
- **Website**: https://www.mauritiusscuba.com
- **Hours**: 8:00 AM - 6:00 PM daily

### Local Keywords

Targeted local search terms:

- "scuba diving Mauritius"
- "PADI courses Mauritius"
- "dive center Grand Baie"
- "Mauritius diving certification"
- "Blue Bay diving"

## Content Optimization

### Keyword Strategy

Primary and secondary keywords:

#### Primary Keywords

- Mauritius scuba diving
- PADI courses Mauritius
- Scuba certification Mauritius

#### Long-tail Keywords

- "best scuba diving courses in Mauritius"
- "PADI open water diver certification Mauritius"
- "guided diving tours Mauritius"

### Heading Structure

Semantic HTML heading hierarchy:

```html
<h1>Mauritius Scuba Diving Center</h1>
<h2>PADI Certified Courses</h2>
<h3>Open Water Diver Course</h3>
<h3>Advanced Open Water Course</h3>
<h2>Dive Sites</h2>
<h3>Blue Bay Marine Park</h3>
<h3>Cathedral</h3>
```

## Mobile SEO

### Responsive Design

Mobile-first responsive implementation:

- **Viewport meta tag**: Proper mobile scaling
- **Touch-friendly**: Adequate button sizes
- **Fast loading**: Optimized for mobile networks

### Mobile Performance

Mobile-specific optimizations:

- **AMP pages**: Not implemented (SPA architecture)
- **Mobile redirects**: Automatic responsive design
- **Local mobile searches**: Optimized for "near me" queries

## Analytics Integration

### Search Console Setup

Google Search Console configuration:

- **Property verification**: HTML meta tag method
- **Sitemap submission**: `/sitemap.xml`
- **Robots.txt**: `/robots.txt`

### SEO Monitoring

Key metrics to monitor:

- **Organic search traffic**
- **Keyword rankings**
- **Click-through rates**
- **Conversion rates from organic traffic**

## Implementation Guide

### Adding SEO to New Pages

1. **Create page meta tags** in `seo.js`:

```javascript
newPage: {
  title: 'New Page Title',
  description: 'New page description...',
  canonical: 'https://www.mauritiusscuba.com/new-page',
}
```

2. **Add SEO component** to page:

```jsx
import SEO from '../components/common/SEO';

const NewPage = () => (
  <>
    <SEO page="newPage" />
    {/* Page content */}
  </>
);
```

3. **Add structured data** if applicable:

```jsx
import { generateLocalBusinessSchema } from '../utils/seo';

// In component
<Helmet>
  <script type="application/ld+json">{JSON.stringify(generateLocalBusinessSchema())}</script>
</Helmet>;
```

### Testing SEO Implementation

1. **Google Rich Results Test**: Validate structured data
2. **Google Mobile-Friendly Test**: Check mobile optimization
3. **Google PageSpeed Insights**: Performance analysis
4. **Screaming Frog**: Technical SEO audit

## Best Practices

### Content Guidelines

- **Unique titles**: Each page has distinct title
- **Descriptive meta descriptions**: 150-160 characters
- **Keyword optimization**: Natural keyword placement
- **Quality content**: Comprehensive, valuable information

### Technical Standards

- **HTTPS**: Secure connection required
- **Fast loading**: < 3 seconds page load time
- **Clean URLs**: Descriptive, keyword-rich URLs
- **XML sitemap**: Updated sitemap submission

### Monitoring & Maintenance

- **Regular audits**: Monthly SEO health checks
- **Performance monitoring**: Core Web Vitals tracking
- **Content updates**: Fresh, relevant content
- **Backlink monitoring**: Quality backlink acquisition

This comprehensive SEO strategy ensures maximum visibility in search engines while providing an excellent user experience across all devices and platforms.

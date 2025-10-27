# SEO Helpers

The SEO helpers provide structured data generation, meta tag management, and search engine optimization utilities for the Ocean Spirit Scuba website.

## Structured Data (Schema.org)

### Local Business Schema

```javascript
import { generateLocalBusinessSchema } from '@/utils/seo';

// Generate LocalBusiness structured data
const businessSchema = generateLocalBusinessSchema();

// Use in component:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
/>;
```

**Generated Schema Includes:**

- Business name, description, and contact information
- Physical address and geographic coordinates
- Business hours and pricing information
- Social media profiles and accepted payment methods

### Breadcrumb Schema

```javascript
import { generateBreadcrumbSchema } from '@/utils/seo';

// Generate breadcrumb structured data
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://www.mauritiusscuba.com' },
  { name: 'Courses', url: 'https://www.mauritiusscuba.com/courses' },
  { name: 'PADI Open Water', url: 'https://www.mauritiusscuba.com/courses/open-water' },
]);
```

**Parameters:**

- `items` (array): Array of breadcrumb items with `name` and `url` properties

### Course Schema

```javascript
import { generateCourseSchema } from '@/utils/seo';

// Generate course structured data
const courseSchema = generateCourseSchema({
  name: 'PADI Open Water Diver Course',
  description: 'Complete scuba diving certification course',
  price: 450,
  currency: 'USD',
});
```

**Parameters:**

- `course` (object): Course data with name, description, price, and currency

## Meta Tags

### Default Meta Tags

```javascript
import { defaultMetaTags } from '@/utils/seo';

console.log(defaultMetaTags);
// {
//   title: 'Mauritius Scuba Diving Center | PADI Certified Diving Courses & Tours',
//   description: '...',
//   keywords: '...',
//   ogImage: '...',
//   twitterCard: 'summary_large_image'
// }
```

### Page-Specific Meta Tags

```javascript
import { generatePageMetaTags } from '@/utils/seo';

// Get meta tags for specific page
const homeMeta = generatePageMetaTags('home');
const coursesMeta = generatePageMetaTags('courses');
const aboutMeta = generatePageMetaTags('about');
```

**Available Pages:**

- `home` - Homepage
- `about` - About page
- `dive-sites` - Dive sites page
- `courses` - Courses page
- `gallery` - Gallery page

**Returns:** Object with `title`, `description`, and `canonical` URL

## React Helmet Integration

### SEO Component Usage

```javascript
import { Helmet } from 'react-helmet-async';
import { generatePageMetaTags, generateLocalBusinessSchema } from '@/utils/seo';

function HomePage() {
  const metaTags = generatePageMetaTags('home');
  const businessSchema = generateLocalBusinessSchema();

  return (
    <>
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <link rel="canonical" href={metaTags.canonical} />

        {/* Open Graph */}
        <meta property="og:title" content={metaTags.title} />
        <meta property="og:description" content={metaTags.description} />
        <meta property="og:image" content="https://www.mauritiusscuba.com/images/og-image.jpg" />
        <meta property="og:url" content={metaTags.canonical} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTags.title} />
        <meta name="twitter:description" content={metaTags.description} />
        <meta name="twitter:image" content="https://www.mauritiusscuba.com/images/og-image.jpg" />
      </Helmet>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />

      {/* Page content */}
    </>
  );
}
```

## SEO Component

For consistent SEO implementation, use the SEO component:

```javascript
import SEO from '@/reference/components/common/SEO';

function CoursesPage() {
  return (
    <>
      <SEO page="courses" />
      {/* Page content */}
    </>
  );
}
```

## Environment Configuration

The SEO utilities use environment variables for dynamic content:

```bash
# .env
VITE_PHONE_NUMBER=+230 2634468
VITE_EMAIL=info@osdiving.com
```

## Best Practices

1. **Always include canonical URLs** to prevent duplicate content issues
2. **Use structured data** for rich snippets in search results
3. **Optimize meta descriptions** (150-160 characters) and titles (50-60 characters)
4. **Include Open Graph and Twitter Card meta tags** for social sharing
5. **Use descriptive, keyword-rich URLs** and page titles

## Schema.org Validation

Test your structured data using:

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

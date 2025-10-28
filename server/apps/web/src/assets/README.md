# Assets Directory

This directory contains shared static assets for the multi-tenant diving platform.

## Structure

```text
assets/
├── logo.svg           # Main company logo
├── placeholder.svg    # Placeholder image for missing content
└── README.md         # This file
```

## Usage

### Logo

The logo can be imported in React components:

```jsx
import logo from '../assets/logo.svg';

<img src={logo} alt="React Scuba Platform" />;
```

### Placeholder

Used as fallback for missing images:

```jsx
import placeholder from '../assets/placeholder.svg';

<img src={placeholder} alt="Placeholder" />;
```

## Image Strategy

This application primarily uses:

- **Unsplash** for high-quality dive photography (via URLs)
- **Heroicons** for UI icons (imported from @heroicons/react)
- **Local SVGs** for branding (logo) and fallbacks (placeholder)

## Adding New Assets

When adding new assets:

1. Optimize images before adding (use tools like SVGO for SVGs, ImageOptim for photos)
2. Use descriptive filenames: `feature-name-variant.ext`
3. Update this README with new asset documentation
4. Consider using a CDN for large images

## Best Practices

- **SVG**: Preferred for logos, icons, and simple graphics (scalable, small file size)
- **WebP**: Preferred for photos (better compression than JPEG/PNG)
- **PNG**: Use for images requiring transparency
- **JPEG**: Use for photos without transparency

## File Size Guidelines

- Icons/Logos: < 50 KB
- Thumbnails: < 100 KB
- Full-size images: < 500 KB
- Background images: < 200 KB

## Accessibility

Always provide meaningful alt text when using these assets:

```jsx
// Good
<img src={logo} alt="Professional Dive Center - React Scuba Platform" />

// Bad
<img src={logo} alt="logo" />
```

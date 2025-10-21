# Documentation

This directory contains the VitePress documentation for the SCUBA Bali project.

## 🚀 Quick Start

```bash
# Install dependencies (if not already installed)
npm install

# Start documentation dev server
npm run docs:dev

# Build documentation
npm run docs:build

# Preview built docs
npm run docs:preview
```

## 📁 Structure

```
docs/
├── .vitepress/          # VitePress configuration
│   └── config.js        # Site config, nav, sidebar
├── getting-started/     # Getting started guides
│   ├── index.md         # Overview
│   ├── installation.md  # Installation guide
│   └── structure.md     # Project structure
├── components/          # Component documentation
│   └── index.md         # Components overview
├── api/                 # API reference (TODO)
├── deployment/          # Deployment guides (TODO)
├── contributing/        # Contributing guide (TODO)
└── index.md            # Documentation homepage
```

## 🎯 Features

### Native GitHub Integration

- **Markdown-based:** All docs in standard Markdown
- **Version Control:** Full git history for documentation
- **PR Reviews:** Docs changes reviewed like code
- **GitHub Pages:** Auto-deploy on push to main

### Modern Stack (2025)

- **VitePress 1.x:** Vue + Vite-powered static site generator
- **Fast:** Lightning-fast dev server and builds
- **TypeScript:** Full TypeScript support
- **Dark Mode:** Built-in dark mode support
- **Search:** Local search out of the box
- **Mobile:** Responsive design

### Developer Experience

- **Hot Reload:** Instant updates during development
- **Markdown Extensions:** Frontmatter, custom containers, code groups
- **Syntax Highlighting:** Shiki for beautiful code blocks
- **Link Checking:** Dead link detection
- **SEO:** Auto-generated sitemap and meta tags

## 📝 Writing Documentation

### Create a New Page

1. Add markdown file in appropriate directory:

```bash
touch docs/components/modals.md
```

2. Add frontmatter (optional):

```markdown
---
title: Modal Components
description: Dialog and overlay components
---

# Modal Components

...
```

3. Update sidebar in `docs/.vitepress/config.js`:

```javascript
sidebar: {
  '/components/': [
    {
      text: 'Components',
      items: [
        { text: 'Modals', link: '/components/modals' },
      ],
    },
  ],
},
```

### Markdown Extensions

**Custom Containers:**

```markdown
::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is dangerous
:::
```

**Code Groups:**

````markdown
::: code-group

````js [npm]
npm install vitepress
\```

```bash [yarn]
yarn add -D vitepress
\```
:::
````
````

**Line Highlighting:**

````markdown
```javascript{2,4-6}
function hello() {
  console.log('This line is highlighted')

  // These lines
  // are also
  // highlighted
}
```
````

## 🚀 Deployment

### GitHub Pages (Automatic)

The `.github/workflows/docs.yml` workflow automatically deploys docs to GitHub Pages when:

- Changes are pushed to `main` branch
- Changes are made to `docs/` directory
- Workflow is manually triggered

**Setup:**

1. Go to repository Settings > Pages
2. Set Source to "GitHub Actions"
3. Push changes to `main`
4. Docs will be available at: `https://DeanLuus22021994.github.io/react-scuba/`

### Manual Deployment

```bash
# Build docs
npm run docs:build

# Output in docs/.vitepress/dist
# Upload to any static hosting provider
```

## 🎨 Customization

### Theme Configuration

Edit `docs/.vitepress/config.js`:

```javascript
export default defineConfig({
  title: "Your Project",
  description: "Description",

  themeConfig: {
    logo: "/logo.svg",
    nav: [
      /* navigation items */
    ],
    sidebar: {
      /* sidebar config */
    },
    socialLinks: [
      /* social links */
    ],
  },
});
```

### Custom Components

Create Vue components in `.vitepress/theme/`:

```vue
<!-- .vitepress/theme/MyComponent.vue -->
<template>
  <div class="my-component">
    <slot />
  </div>
</template>
```

Use in markdown:

```markdown
<MyComponent>
  Content here
</MyComponent>
```

### Custom Styles

Add global styles in `.vitepress/theme/custom.css`:

```css
:root {
  --vp-c-brand: #0e7490;
}
```

Import in `.vitepress/theme/index.js`:

```javascript
import DefaultTheme from "vitepress/theme";
import "./custom.css";

export default DefaultTheme;
```

## 🔍 Search

VitePress includes local search by default. No configuration needed!

To use Algolia DocSearch (optional):

```javascript
export default defineConfig({
  themeConfig: {
    search: {
      provider: "algolia",
      options: {
        appId: "YOUR_APP_ID",
        apiKey: "YOUR_API_KEY",
        indexName: "YOUR_INDEX_NAME",
      },
    },
  },
});
```

## 📊 Analytics

Add Google Analytics or Plausible:

```javascript
export default defineConfig({
  head: [
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX",
      },
    ],
  ],
});
```

## 🤝 Contributing

To contribute to documentation:

1. Fork the repository
2. Create a branch: `git checkout -b docs/my-update`
3. Make changes to markdown files
4. Test locally: `npm run docs:dev`
5. Build to check for errors: `npm run docs:build`
6. Commit and push
7. Open a pull request

## 📚 Resources

- [VitePress Documentation](https://vitepress.dev/)
- [Markdown Extensions](https://vitepress.dev/guide/markdown)
- [Theme Customization](https://vitepress.dev/guide/theme-introduction)
- [Deployment Guide](https://vitepress.dev/guide/deploy)

## 🐛 Troubleshooting

### Build Fails with Dead Links

Edit `docs/.vitepress/config.js`:

```javascript
export default defineConfig({
  ignoreDeadLinks: true, // or use patterns
});
```

### Port Already in Use

```bash
npm run docs:dev -- --port 5174
```

### CSS Not Loading

Clear cache:

```bash
rm -rf docs/.vitepress/.temp
rm -rf docs/.vitepress/cache
npm run docs:dev
```

## ✨ Next Steps

1. **Complete Pages:** Add missing component documentation
2. **API Reference:** Document all utilities and hooks
3. **Deployment Guides:** Add platform-specific guides
4. **Contributing Guide:** Add contribution guidelines
5. **Examples:** Add live code examples
6. **Search:** Consider Algolia for better search
7. **i18n:** Add internationalization if needed

---

**Status:** 🟢 Active Development
**Last Updated:** 2025-10-21
**VitePress Version:** 1.6.4

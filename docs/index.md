---
layout: home

hero:
  name: 'React Scuba'
  text: 'Modern Dive Center Platform'
  tagline: Production-ready website built with React 19, Vite, and Tailwind CSS
  image:
    src: /logo.svg
    alt: SCUBA Bali
  actions:
    - theme: brand
      text: Quick Start
      link: /guide/quick-start
    - theme: alt
      text: View Components
      link: /components/
    - theme: alt
      text: GitHub
      link: https://github.com/DeanLuus22021994/react-scuba

features:
  - icon: ⚡
    title: Lightning Fast
    details: Built with Vite 6 for instant hot module replacement and optimized production builds under 350KB gzipped.

  - icon: 🎨
    title: Modern UI/UX
    details: React 19, Tailwind CSS 3, and Framer Motion deliver beautiful animations and responsive design.

  - icon: 📱
    title: Mobile First
    details: Pixel-perfect responsive design optimized for all devices with touch gestures and adaptive layouts.

  - icon: �️
    title: Production Ready
    details: Error boundaries, environment validation, comprehensive testing, and battle-tested code quality.

  - icon: 📊
    title: Full Analytics
    details: Google Analytics 4, GTM integration, conversion tracking, and custom event monitoring built-in.

  - icon: 🔍
    title: SEO Optimized
    details: Meta tags, JSON-LD structured data, sitemap, and perfect Lighthouse scores out of the box.

  - icon: 🎯
    title: 38+ Components
    details: Fully typed React components with PropTypes, comprehensive docs, and live examples.

  - icon: 🌊
    title: Dive Features
    details: Booking system, interactive maps, course catalog, gallery with lightbox, and multi-currency support.

  - icon: ♿
    title: Accessible
    details: WCAG 2.1 AA compliant with keyboard navigation, ARIA labels, and screen reader support.
---

<style>
.home-quick-start {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(3, 105, 161, 0.05) 100%);
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  border: 2px solid var(--vp-c-brand);
}
</style>

<div class="home-quick-start">

## ⚡ Quick Start

```bash
# Clone and install
git clone https://github.com/DeanLuus22021994/react-scuba.git
cd react-scuba
npm install

# Start development
npm start

# Run tests
npm test

# Build for production
npm run build
```

</div>

## 🎯 Modern Tech Stack

<div class="metrics">
  <div class="metric">
    <span class="metric-value">19.0</span>
    <span class="metric-label">React</span>
  </div>
  <div class="metric">
    <span class="metric-value">6.3</span>
    <span class="metric-label">Vite</span>
  </div>
  <div class="metric">
    <span class="metric-value">38+</span>
    <span class="metric-label">Components</span>
  </div>
  <div class="metric">
    <span class="metric-value">347KB</span>
    <span class="metric-label">Gzipped</span>
  </div>
</div>

| Category       | Technology               | Version  |
| -------------- | ------------------------ | -------- |
| **Framework**  | React                    | 19.0.0   |
| **Build Tool** | Vite                     | 6.3.6    |
| **Styling**    | Tailwind CSS             | 3.4.18   |
| **Routing**    | React Router             | 7.9.4    |
| **Animations** | Framer Motion            | 12.23.24 |
| **Forms**      | React Hook Form + Zod    | Latest   |
| **UI Library** | Headless UI              | 2.2.9    |
| **Icons**      | Heroicons                | 2.2.0    |
| **Maps**       | React Leaflet            | 5.0.0    |
| **Testing**    | Vitest + Testing Library | 3.0.7    |
| **Docs**       | VitePress                | 1.6.4    |

## 📦 What's Included

::: tip Complete Feature Set
**5 Main Pages** • **38+ Components** • **6 Utilities** • **Comprehensive Testing** • **Full Analytics Integration**
:::

<div class="quick-links">
  <div class="feature-card">
    <h3>✅ Homepage</h3>
    <p>Hero, services, features, testimonials, CTAs</p>
  </div>
  <div class="feature-card">
    <h3>✅ About Page</h3>
    <p>Team profiles, certifications, company story</p>
  </div>
  <div class="feature-card">
    <h3>✅ Dive Sites</h3>
    <p>Interactive maps, detailed site info</p>
  </div>
  <div class="feature-card">
    <h3>✅ Courses</h3>
    <p>PADI offerings, pricing, comparison tables</p>
  </div>
  <div class="feature-card">
    <h3>✅ Gallery</h3>
    <p>Lightbox, categories, lazy loading, filters</p>
  </div>
  <div class="feature-card">
    <h3>✅ Booking</h3>
    <p>Forms with validation and reCAPTCHA</p>
  </div>
</div>

**Core Features:**

- 💰 **Multi-Currency** - Live exchange rates (MUR, USD, EUR, GBP)
- 🔍 **SEO Ready** - Meta tags, JSON-LD, sitemap generation
- 📊 **Analytics** - GA4, GTM, conversion tracking
- ♿ **Accessibility** - WCAG 2.1 AA compliant
- 🛡️ **Error Handling** - Error boundaries, validation, logging
- ⚡ **Performance** - Code splitting, lazy loading, optimized images

## 🏗️ Project Architecture

::: info Well-Organized Structure
Clean separation of concerns with feature-based component organization
:::

```
react-scuba/
├── docs/                    # 📚 VitePress documentation
├── src/
│   ├── components/          # 🧩 38+ React components
│   │   ├── about/          # About page components
│   │   ├── common/         # Shared components
│   │   ├── courses/        # Course components
│   │   ├── dive-sites/     # Dive site components
│   │   ├── gallery/        # Gallery components
│   │   ├── home/           # Homepage sections
│   │   ├── modals/         # Modal dialogs
│   │   └── shared/         # Cross-page components
│   ├── utils/              # 🛠️ Utilities (analytics, logger, SEO, etc.)
│   ├── hooks/              # 🪝 Custom React hooks
│   ├── services/           # 🔌 API clients
│   ├── data/               # 📊 Static data
│   ├── layouts/            # 🏗️ Layout components
│   └── styles/             # 🎨 Global styles
└── package.json
```

## Next Steps

## 🚀 Next Steps

<div class="quick-links">
  <a href="/guide/quick-start" class="quick-link">
    <h4>🚀 Quick Start</h4>
    <p>Get up and running in 5 minutes</p>
  </a>
  <a href="/guide/installation" class="quick-link">
    <h4>📦 Installation</h4>
    <p>Detailed setup instructions</p>
  </a>
  <a href="/components/" class="quick-link">
    <h4>🧩 Components</h4>
    <p>Explore 38+ React components</p>
  </a>
  <a href="/deployment/" class="quick-link">
    <h4>🌐 Deploy</h4>
    <p>Production deployment guides</p>
  </a>
</div>

## Community & Support

- 🐛 [Report Issues](https://github.com/DeanLuus22021994/react-scuba/issues)
- 💬 [Discussions](https://github.com/DeanLuus22021994/react-scuba/discussions)
- 📖 [Contributing Guide](/contributing)
- 📝 [Changelog](/changelog)

## License

[MIT License](https://github.com/DeanLuus22021994/react-scuba/blob/main/LICENSE) © 2025 React Scuba

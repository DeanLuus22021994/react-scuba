import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'React Scuba',
  description: 'Modern dive center website built with React 19, Vite, and Tailwind CSS',
  base: '/react-scuba/',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#0e7490' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'React Scuba Documentation' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'React Scuba',

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Components', link: '/components/' },
      { text: 'API', link: '/api/' },
      {
        text: 'Resources',
        items: [
          { text: 'Deployment', link: '/deployment/' },
          { text: 'Contributing', link: '/contributing' },
          { text: 'Changelog', link: '/changelog' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          collapsed: false,
          items: [
            { text: 'What is React Scuba?', link: '/guide/' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Project Structure', link: '/guide/structure' },
          ],
        },
        {
          text: 'Essentials',
          collapsed: false,
          items: [
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Environment Variables', link: '/guide/environment' },
            { text: 'Styling', link: '/guide/styling' },
            { text: 'Routing', link: '/guide/routing' },
          ],
        },
        {
          text: 'Features',
          collapsed: false,
          items: [
            { text: 'Analytics & Tracking', link: '/guide/analytics' },
            { text: 'SEO Optimization', link: '/guide/seo' },
            { text: 'Multi-Currency', link: '/guide/currency' },
            { text: 'Forms & Validation', link: '/guide/forms' },
          ],
        },
        {
          text: 'Best Practices',
          collapsed: false,
          items: [
            { text: 'Code Quality', link: '/guide/code-quality' },
            { text: 'Testing', link: '/guide/testing' },
            { text: 'Performance', link: '/guide/performance' },
            { text: 'Accessibility', link: '/guide/accessibility' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'Overview',
          items: [{ text: 'Component Library', link: '/components/' }],
        },
        {
          text: 'Layout',
          collapsed: false,
          items: [
            { text: 'Header', link: '/components/header' },
            { text: 'Footer', link: '/components/footer' },
            { text: 'Navigation', link: '/components/navigation' },
          ],
        },
        {
          text: 'Pages',
          collapsed: false,
          items: [
            { text: 'Home', link: '/components/home' },
            { text: 'About', link: '/components/about' },
            { text: 'Courses', link: '/components/courses' },
            { text: 'Dive Sites', link: '/components/dive-sites' },
            { text: 'Gallery', link: '/components/gallery' },
          ],
        },
        {
          text: 'Common',
          collapsed: false,
          items: [
            { text: 'Error Boundary', link: '/components/error-boundary' },
            { text: 'Loading States', link: '/components/loading' },
            { text: 'SEO Component', link: '/components/seo' },
            { text: 'Currency Selector', link: '/components/currency-selector' },
            { text: 'CTA Buttons', link: '/components/cta-buttons' },
          ],
        },
        {
          text: 'Interactive',
          collapsed: false,
          items: [
            { text: 'Modals', link: '/components/modals' },
            { text: 'Forms', link: '/components/forms' },
            { text: 'Maps', link: '/components/maps' },
            { text: 'Carousels', link: '/components/carousels' },
            { text: 'Lightbox', link: '/components/lightbox' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [{ text: 'Overview', link: '/api/' }],
        },
        {
          text: 'Utilities',
          collapsed: false,
          items: [
            { text: 'Analytics', link: '/api/analytics' },
            { text: 'Currency', link: '/api/currency' },
            { text: 'Logger', link: '/api/logger' },
            { text: 'SEO Helpers', link: '/api/seo-helpers' },
            { text: 'Environment', link: '/api/environment' },
          ],
        },
        {
          text: 'Hooks',
          collapsed: false,
          items: [{ text: 'useCurrency', link: '/api/use-currency' }],
        },
        {
          text: 'Services',
          collapsed: false,
          items: [{ text: 'API Client', link: '/api/client' }],
        },
        {
          text: 'Data',
          collapsed: false,
          items: [
            { text: 'Courses', link: '/api/data-courses' },
            { text: 'Dive Sites', link: '/api/data-dive-sites' },
            { text: 'Team Members', link: '/api/data-team' },
            { text: 'Gallery', link: '/api/data-gallery' },
          ],
        },
      ],
      '/deployment/': [
        {
          text: 'Deployment',
          items: [{ text: 'Overview', link: '/deployment/' }],
        },
        {
          text: 'Platforms',
          collapsed: false,
          items: [
            { text: 'Vercel', link: '/deployment/vercel' },
            { text: 'Netlify', link: '/deployment/netlify' },
            { text: 'GitHub Pages', link: '/deployment/github-pages' },
            { text: 'Docker', link: '/deployment/docker' },
          ],
        },
        {
          text: 'Services',
          collapsed: false,
          items: [
            { text: 'Google Tag Manager', link: '/deployment/gtm' },
            { text: 'Google Analytics', link: '/deployment/analytics' },
            { text: 'reCAPTCHA', link: '/deployment/recaptcha' },
            { text: 'Custom Domain', link: '/deployment/domain' },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/DeanLuus22021994/react-scuba',
      },
    ],

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    editLink: {
      pattern: 'https://github.com/DeanLuus22021994/react-scuba/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 React Scuba',
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    },
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
    container: {
      tipLabel: 'TIP',
      warningLabel: 'WARNING',
      dangerLabel: 'DANGER',
      infoLabel: 'INFO',
    },
  },

  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
    },
  },

  // Clean URLs (no .html extension)
  cleanUrls: true,

  // Enable last updated timestamp
  lastUpdated: true,

  // sitemap for SEO
  sitemap: {
    hostname: 'https://deanluus22021994.github.io/react-scuba',
  },

  // Allow dead links during development - we're building incrementally
  ignoreDeadLinks: true,
});

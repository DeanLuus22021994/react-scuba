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
      { text: 'Reference', link: '/reference/' },
      {
        text: 'Resources',
        items: [
          { text: 'Deployment', link: '/deployment/' },
          { text: 'Contributing', link: '/contributing/' },
          { text: 'Changelog', link: '/contributing/changelog' },
        ],
      },
    ],

    sidebar: '/toc.yml',

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

import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SCUBA Bali Docs",
  description: "Comprehensive documentation for SCUBA Bali dive center website",
  base: "/react-scuba/",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo.svg",

    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/getting-started/" },
      { text: "Components", link: "/components/" },
      { text: "API", link: "/api/" },
      { text: "Deployment", link: "/deployment/" },
    ],

    sidebar: {
      "/getting-started/": [
        {
          text: "Getting Started",
          items: [
            { text: "Introduction", link: "/getting-started/" },
            { text: "Installation", link: "/getting-started/installation" },
            { text: "Project Structure", link: "/getting-started/structure" },
            { text: "Configuration", link: "/getting-started/configuration" },
          ],
        },
      ],
      "/components/": [
        {
          text: "Components",
          items: [
            { text: "Overview", link: "/components/" },
            { text: "Layout", link: "/components/layout" },
            { text: "Pages", link: "/components/pages" },
            { text: "Shared Components", link: "/components/shared" },
            { text: "Modals", link: "/components/modals" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          items: [
            { text: "Overview", link: "/api/" },
            { text: "Data Models", link: "/api/data-models" },
            { text: "Utilities", link: "/api/utilities" },
            { text: "Hooks", link: "/api/hooks" },
          ],
        },
      ],
      "/deployment/": [
        {
          text: "Deployment",
          items: [
            { text: "Overview", link: "/deployment/" },
            { text: "Environment Variables", link: "/deployment/environment" },
            { text: "Vercel", link: "/deployment/vercel" },
            { text: "Netlify", link: "/deployment/netlify" },
            { text: "GitHub Pages", link: "/deployment/github-pages" },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/DeanLuus22021994/react-scuba",
      },
    ],

    search: {
      provider: "local",
    },

    editLink: {
      pattern:
        "https://github.com/DeanLuus22021994/react-scuba/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025 SCUBA Bali",
    },
  },

  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
    lineNumbers: true,
  },

  // Ignore dead links during development
  ignoreDeadLinks: true,
});

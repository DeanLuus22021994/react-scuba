import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react({
        // Use latest JSX transform with bleeding-edge optimizations
        jsxRuntime: 'automatic',
        jsxImportSource: 'react',
        // Enable fast refresh with bleeding-edge features
        fastRefresh: true,
      }),
      // Bundle analyzer - only in build mode
      isProduction &&
        visualizer({
          filename: './dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
          template: 'treemap', // Use modern treemap visualization
        }),
    ].filter(Boolean),
    esbuild: false, // Disable esbuild in favor of SWC
    build: {
      outDir: 'dist',
      sourcemap: isProduction ? false : true,
      minify: 'esbuild', // Use esbuild for faster builds (bleeding-edge)
      // Target ES2024 for bleeding-edge optimization
      target: 'es2024',
      // Increase chunk size limit since we're code-splitting properly
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          // Intelligent code-splitting strategy
          manualChunks(id) {
            // Core React libraries
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            // React Router
            if (id.includes('node_modules/react-router')) {
              return 'router';
            }
            // TanStack Query
            if (id.includes('node_modules/@tanstack/react-query')) {
              return 'query';
            }
            // Zustand
            if (id.includes('node_modules/zustand')) {
              return 'zustand';
            }
            // UI libraries
            if (id.includes('node_modules/@headlessui') || id.includes('node_modules/@heroicons')) {
              return 'ui-headless';
            }
            // Animation library
            if (id.includes('node_modules/framer-motion')) {
              return 'framer-motion';
            }
            // Map libraries
            if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) {
              return 'maps';
            }
            // Toast notifications
            if (id.includes('node_modules/react-hot-toast')) {
              return 'toast';
            }
            // Form libraries
            if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/zod')) {
              return 'forms';
            }
            // Date picker
            if (id.includes('node_modules/react-datepicker')) {
              return 'datepicker';
            }
            // Remaining node_modules
            if (id.includes('node_modules')) {
              return 'vendor-misc';
            }
          },
          // Use content hash for better caching
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          // Additional optimizations
          pure_funcs: isProduction
            ? ['console.log', 'console.info', 'console.debug', 'console.trace']
            : [],
          passes: 2,
          unsafe_arrows: true,
          unsafe_methods: true,
        },
        format: {
          comments: false,
        },
        mangle: {
          safari10: true,
        },
      },
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Better module preloading
      modulePreload: {
        polyfill: true,
      },
      // Report compressed size
      reportCompressedSize: true,
      // Optimize dependencies
      assetsInlineLimit: 4096,
    },
    // Modern path resolution (replaces deprecated TypeScript baseUrl)
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@/components': resolve(__dirname, './src/components'),
        '@/utils': resolve(__dirname, './src/utils'),
        '@/services': resolve(__dirname, './src/services'),
        '@/types': resolve(__dirname, './src/types'),
        '@/pages': resolve(__dirname, './src/pages'),
        '@/hooks': resolve(__dirname, './src/hooks'),
        '@/styles': resolve(__dirname, './src/styles'),
        '@react-scuba/types': resolve(__dirname, '../../packages/types/src'),
        '@react-scuba/ui': resolve(__dirname, '../../packages/ui/src'),
        '@react-scuba/utils': resolve(__dirname, '../../packages/utils/src'),
        '@react-scuba/content': resolve(__dirname, '../content/src'),
      },
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'zustand',
        'framer-motion',
      ],
      exclude: ['@react-scuba/ui', '@react-scuba/utils'],
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
      globalSetup: './tests/global-setup.js',
      css: true,
      reporters: ['default', './tests/report/vitest.reporter.js'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        reportsDirectory: './coverage',
        exclude: [
          'node_modules/**',
          'dist/**',
          'tests/**',
          'src/setupTests.js',
          '**/*.config.js',
          '**/*.config.ts',
          '**/types/**',
          '**/*.d.ts',
          '**/index.js',
          '**/index.ts',
          '**/index.tsx',
          'src/index.jsx',
          'docker-compose-examples/**',
          '.vitepress/**',
          'docs/**',
          'scripts/**',
        ],
        include: ['src/**/*.{js,jsx,ts,tsx}'],
        all: true,
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    // Server configuration
    server: {
      host: '0.0.0.0',
      port: 3001,
      strictPort: false,
      open: false,
      cors: true,
      hmr: {
        overlay: true,
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: true,
      open: false,
    },
  };
});

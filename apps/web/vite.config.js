import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: false, // Disable esbuild in favor of SWC
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    // Target ES2022 for better optimization
    target: 'es2022',
    // Increase chunk size limit since we're code-splitting properly
    chunkSizeWarningLimit: 500,
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
        drop_console: true,
        drop_debugger: true,
        // Additional optimizations
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
      },
      format: {
        comments: false,
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'zustand'],
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
      clientPort: 3001,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    open: false,
  },
});

/**
 * Vitest configuration for API testing
 * Includes coverage, mocking, and test environment setup
 */
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Test environment configuration
    environment: 'node',
    globals: true,
    
    // Test file patterns
    include: ['src/tests/**/*.{test,spec}.{js,mjs,ts}'],
    exclude: ['node_modules', 'dist', 'build'],
    
    // Setup files
    setupFiles: ['src/tests/setup.js'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.{test,spec}.{js,mjs,ts}',
        '**/db/connection.js', // Database connection - integration tested
        '**/utils/logger.js'   // Logger utility - simple wrapper
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      },
      // Fail tests if coverage thresholds aren't met
      skipFull: false
    },
    
    // Test timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Parallel execution
    threads: true,
    maxThreads: 4,
    
    // Reporter configuration
    reporter: ['verbose', 'json', 'html'],
    outputFile: {
      json: './coverage/test-results.json',
      html: './coverage/test-report.html'
    },
    
    // Mock configuration
    clearMocks: true,
    restoreMocks: true,
    
    // Watch mode configuration
    watch: false, // Disabled for CI
    
    // Pool options for better performance
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true
      }
    }
  },
  
  // Resolve configuration for imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './src/tests')
    }
  },
  
  // Define global constants
  define: {
    __DEV__: false,
    __TEST__: true
  }
});
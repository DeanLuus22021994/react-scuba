// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { afterAll, afterEach, beforeAll } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup test logging
const logsDir = join(__dirname, '../tests/logs');
const logFile = join(logsDir, 'test-results.log');
const testResults = [];

beforeAll(() => {
  // Create logs directory if it doesn't exist
  try {
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }

    const header = `Test Run Started: ${new Date().toISOString()}\n${'='.repeat(80)}\n\n`;
    writeFileSync(logFile, header, { flag: 'a' });
  } catch (error) {
    // Ignore errors in test setup - tests can still run
    console.warn('Could not setup test logging:', error.message);
  }
});

afterEach((context) => {
  const timestamp = new Date().toISOString();
  const testName = context.task.name;
  const suiteName =
    context.task.suite?.name ||
    context.task.file?.name?.replace('.test.jsx', '').replace('.test.js', '') ||
    'Unknown';
  const passed = context.task.result?.state === 'pass';
  const duration = context.task.result?.duration || 0;

  const logEntry = `[${timestamp}] ${passed ? '✓ PASS' : '✗ FAIL'} | ${suiteName} > ${testName} | ${duration}ms\n`;

  testResults.push({
    timestamp,
    passed,
    testName,
    suiteName,
    duration,
    message: `${suiteName} > ${testName}`,
  });

  try {
    appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error('Failed to write test log:', error);
  }
});

afterAll(() => {
  const summary = `\n${'='.repeat(80)}\nTest Run Completed: ${new Date().toISOString()}\n`;
  const totalTests = testResults.length;
  const passedTests = testResults.filter((r) => r.passed).length;
  const failedTests = totalTests - passedTests;

  const summaryText =
    summary +
    `Total Tests: ${totalTests}\n` +
    `Passed: ${passedTests}\n` +
    `Failed: ${failedTests}\n` +
    `${'='.repeat(80)}\n`;

  try {
    appendFileSync(logFile, summaryText);

    // Create JSON file with structured results
    const jsonFile = join(logsDir, 'test-results.json');
    writeFileSync(
      jsonFile,
      JSON.stringify(
        {
          runTime: new Date().toISOString(),
          summary: {
            total: totalTests,
            passed: passedTests,
            failed: failedTests,
          },
          tests: testResults,
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error('Failed to write test summary:', error);
  }
});

// Mock IntersectionObserver for tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

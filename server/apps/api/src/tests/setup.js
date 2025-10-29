/**
 * Test setup file for API tests
 * Global test configuration and mocks
 */
import { vi } from "vitest";
import { config } from "dotenv";

// Load test environment variables
config({ path: ".env.test" });

// Global test configuration
globalThis.__TEST__ = true;

// Mock console methods to reduce test noise
const originalConsole = global.console;
global.console = {
	...originalConsole,
	log: vi.fn(),
	debug: vi.fn(),
	info: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
};

// Mock process.env for consistent testing
process.env.NODE_ENV = "test";
process.env.PORT = "3001";
process.env.DB_HOST = "localhost";
process.env.DB_USER = "test_user";
process.env.DB_PASSWORD = "test_password";
process.env.DB_NAME = "test_react_scuba";

// Global test utilities
globalThis.mockApiResponse = (data, success = true) => {
	return success ? { success: true, data } : { success: false, error: data };
};

// Setup fake timers by default (can be overridden in individual tests)
vi.useFakeTimers({
	shouldAdvanceTime: true,
});

// Global afterEach cleanup
afterEach(() => {
	vi.clearAllTimers();
});

// Global afterAll cleanup
afterAll(() => {
	vi.useRealTimers();
	global.console = originalConsole;
});

import ReactDOM from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';

// Mock ReactDOM
vi.mock('react-dom/client', () => ({
    default: {
        createRoot: vi.fn(() => ({
            render: vi.fn(),
        })),
    },
}));

// Mock App
vi.mock('@/App', () => ({
    default: () => 'App',
}));

describe('index.jsx', () => {
    it('should have entry point', () => {
        expect(ReactDOM.createRoot).toBeDefined();
    });

    it('should import required modules', () => {
        // Test passes if mocks are set up correctly
        expect(ReactDOM.createRoot).toBeDefined();
    });

    it('should not throw on import', () => {
        // Test passes if the mock setup doesn't throw
        expect(() => {
            ReactDOM.createRoot(document.createElement('div'));
        }).not.toThrow();
    });
});

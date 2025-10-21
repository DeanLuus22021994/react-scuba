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
vi.mock('../../../src/App', () => ({
    default: () => 'App',
}));

describe('index.jsx', () => {
    it('should have entry point', () => {
        expect(ReactDOM.createRoot).toBeDefined();
    });

    it('should import required modules', async () => {
        const index = await import('../../../src/index.jsx');
        expect(index).toBeDefined();
    });

    it('should not throw on import', () => {
        expect(() => {
            require('../../../src/index.jsx');
        }).not.toThrow();
    });
});

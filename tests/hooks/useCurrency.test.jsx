import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurrencyProvider, useCurrency } from '@/hooks/useCurrency';

describe('useCurrency', () => {
    const wrapper = ({ children }) => <CurrencyProvider>{children}</CurrencyProvider>;

    it('should provide currency context', async () => {
        const { result } = renderHook(() => useCurrency(), { wrapper });

        await waitFor(() => {
            expect(result.current.currency).toBeDefined();
        });
    });

    it('should have default currency', async () => {
        const { result } = renderHook(() => useCurrency(), { wrapper });

        await waitFor(() => {
            expect(result.current.currency).toBe('MUR');
        });
    });

    it('should provide format function', async () => {
        const { result } = renderHook(() => useCurrency(), { wrapper });

        await waitFor(() => {
            expect(typeof result.current.format).toBe('function');
        });
    });

    it('should provide convert function', async () => {
        const { result } = renderHook(() => useCurrency(), { wrapper });

        await waitFor(() => {
            expect(typeof result.current.convert).toBe('function');
        });
    });

    it('should provide setCurrency function', async () => {
        const { result } = renderHook(() => useCurrency(), { wrapper });

        await waitFor(() => {
            expect(typeof result.current.setCurrency).toBe('function');
        });
    });

    it('should provide availableCurrencies', async () => {
        const { result } = renderHook(() => useCurrency(), { wrapper });

        await waitFor(() => {
            expect(Array.isArray(result.current.availableCurrencies)).toBe(true);
            expect(result.current.availableCurrencies.length).toBeGreaterThan(0);
        });
    });
});

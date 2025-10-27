import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { usePreferencesStore } from '../../src/stores/usePreferencesStore';

describe('usePreferencesStore', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should initialize with default currency USD', () => {
    const { result } = renderHook(() => usePreferencesStore());

    expect(result.current.currency).toBe('USD');
  });

  it('should change currency to USD', () => {
    const { result } = renderHook(() => usePreferencesStore());

    act(() => {
      result.current.setCurrency('USD');
    });

    expect(result.current.currency).toBe('USD');
  });

  it('should change currency to MUR', () => {
    const { result } = renderHook(() => usePreferencesStore());

    act(() => {
      result.current.setCurrency('MUR');
    });

    expect(result.current.currency).toBe('MUR');
  });

  it('should handle currency changes multiple times', () => {
    const { result } = renderHook(() => usePreferencesStore());

    act(() => {
      result.current.setCurrency('USD');
    });
    expect(result.current.currency).toBe('USD');

    act(() => {
      result.current.setCurrency('GBP');
    });
    expect(result.current.currency).toBe('GBP');

    act(() => {
      result.current.setCurrency('EUR');
    });
    expect(result.current.currency).toBe('EUR');
  });
});

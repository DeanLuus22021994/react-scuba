import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDiveSiteFilter } from '../../../src/features/dive-sites/hooks/useDiveSiteFilter';

describe('useDiveSiteFilter', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDiveSiteFilter());

    expect(result.current.difficulty).toBe('All');
    expect(result.current.depthRange).toEqual([0, 50]);
    expect(result.current.totalCount).toBeGreaterThan(0);
    expect(result.current.filteredCount).toBe(result.current.totalCount);
  });

  it('should filter by beginner difficulty', () => {
    const { result } = renderHook(() => useDiveSiteFilter());

    act(() => {
      result.current.setDifficulty('Beginner');
    });

    expect(result.current.difficulty).toBe('Beginner');
    expect(result.current.sites.every((site) => site.difficulty.toLowerCase().includes('beginner'))).toBe(true);
  });

  it('should filter by intermediate difficulty', () => {
    const { result } = renderHook(() => useDiveSiteFilter());

    act(() => {
      result.current.setDifficulty('Intermediate');
    });

    expect(result.current.sites.every((site) => site.difficulty.toLowerCase().includes('intermediate'))).toBe(true);
  });

  it('should filter by depth range', () => {
    const { result } = renderHook(() => useDiveSiteFilter());

    act(() => {
      result.current.setDepthRange([10, 30]);
    });

    expect(result.current.depthRange).toEqual([10, 30]);
    expect(
      result.current.sites.every((site) => {
        const depth = parseInt(site.depth);
        return depth >= 10 && depth <= 30;
      }),
    ).toBe(true);
  });

  it('should combine difficulty and depth filters', () => {
    const { result } = renderHook(() => useDiveSiteFilter());

    act(() => {
      result.current.setDifficulty('Beginner');
      result.current.setDepthRange([0, 20]);
    });

    expect(
      result.current.sites.every((site) => {
        const depth = parseInt(site.depth);
        return site.difficulty.toLowerCase().includes('beginner') && depth >= 0 && depth <= 20;
      }),
    ).toBe(true);
  });

  it('should reset filters to defaults', () => {
    const { result } = renderHook(() => useDiveSiteFilter());

    act(() => {
      result.current.setDifficulty('Advanced');
      result.current.setDepthRange([20, 40]);
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.difficulty).toBe('All');
    expect(result.current.depthRange).toEqual([0, 50]);
    expect(result.current.filteredCount).toBe(result.current.totalCount);
  });

  it('should initialize with custom difficulty', () => {
    const { result } = renderHook(() => useDiveSiteFilter({ initialDifficulty: 'Advanced' }));

    expect(result.current.difficulty).toBe('Advanced');
  });

  it('should initialize with custom depth range', () => {
    const { result } = renderHook(() => useDiveSiteFilter({ initialDepthRange: [15, 35] }));

    expect(result.current.depthRange).toEqual([15, 35]);
  });

  it('should update filtered count correctly', () => {
    const { result } = renderHook(() => useDiveSiteFilter());

    const initialCount = result.current.filteredCount;

    act(() => {
      result.current.setDepthRange([40, 50]);
    });

    expect(result.current.filteredCount).toBeLessThanOrEqual(initialCount);
  });

  it('should handle deep dive sites', () => {
    const { result } = renderHook(() => useDiveSiteFilter());

    act(() => {
      result.current.setDepthRange([30, 50]);
    });

    expect(result.current.sites.every((site) => parseInt(site.depth) >= 30)).toBe(true);
  });

  it('should memoize filtered results', () => {
    const { result, rerender } = renderHook(() => useDiveSiteFilter());

    const firstSites = result.current.sites;

    rerender();

    expect(result.current.sites).toBe(firstSites);
  });
});

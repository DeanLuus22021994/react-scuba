import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCourseFilter } from '../../../src/features/courses/hooks/useCourseFilter';

describe('useCourseFilter', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCourseFilter());

    expect(result.current.difficulty).toBe('all');
    expect(result.current.priceRange).toEqual([0, 50000]);
    expect(result.current.totalCount).toBeGreaterThan(0);
    expect(result.current.filteredCount).toBe(result.current.totalCount);
  });

  it('should filter by difficulty beginner', () => {
    const { result } = renderHook(() => useCourseFilter());

    act(() => {
      result.current.setDifficulty('beginner');
    });

    expect(result.current.difficulty).toBe('beginner');
    expect(result.current.courses.every((course) => course.price <= 5000)).toBe(true);
  });

  it('should filter by difficulty intermediate', () => {
    const { result } = renderHook(() => useCourseFilter());

    act(() => {
      result.current.setDifficulty('intermediate');
    });

    expect(result.current.difficulty).toBe('intermediate');
    expect(
      result.current.courses.every((course) => course.price > 5000 && course.price <= 15000)
    ).toBe(true);
  });

  it('should filter by difficulty advanced', () => {
    const { result } = renderHook(() => useCourseFilter());

    act(() => {
      result.current.setDifficulty('advanced');
    });

    expect(
      result.current.courses.every((course) => course.price > 15000 && course.price <= 30000)
    ).toBe(true);
  });

  it('should filter by price range', () => {
    const { result } = renderHook(() => useCourseFilter());

    act(() => {
      result.current.setPriceRange([10000, 20000]);
    });

    expect(result.current.priceRange).toEqual([10000, 20000]);
    expect(
      result.current.courses.every((course) => course.price >= 10000 && course.price <= 20000)
    ).toBe(true);
  });

  it('should combine difficulty and price filters', () => {
    const { result } = renderHook(() => useCourseFilter());

    act(() => {
      result.current.setDifficulty('intermediate');
      result.current.setPriceRange([5000, 10000]);
    });

    expect(
      result.current.courses.every((course) => course.price > 5000 && course.price <= 10000)
    ).toBe(true);
  });

  it('should reset filters to defaults', () => {
    const { result } = renderHook(() => useCourseFilter());

    act(() => {
      result.current.setDifficulty('advanced');
      result.current.setPriceRange([20000, 40000]);
    });

    expect(result.current.difficulty).toBe('advanced');

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.difficulty).toBe('all');
    expect(result.current.priceRange).toEqual([0, 50000]);
    expect(result.current.filteredCount).toBe(result.current.totalCount);
  });

  it('should initialize with custom difficulty', () => {
    const { result } = renderHook(() => useCourseFilter({ initialDifficulty: 'professional' }));

    expect(result.current.difficulty).toBe('professional');
  });

  it('should initialize with custom price range', () => {
    const { result } = renderHook(() => useCourseFilter({ initialPriceRange: [15000, 25000] }));

    expect(result.current.priceRange).toEqual([15000, 25000]);
  });

  it('should update filtered count correctly', () => {
    const { result } = renderHook(() => useCourseFilter());

    const initialCount = result.current.filteredCount;

    act(() => {
      result.current.setPriceRange([40000, 50000]);
    });

    expect(result.current.filteredCount).toBeLessThan(initialCount);
  });

  it('should handle empty filter results', () => {
    const { result } = renderHook(() => useCourseFilter());

    act(() => {
      result.current.setPriceRange([100000, 200000]);
    });

    expect(result.current.filteredCount).toBe(0);
    expect(result.current.courses).toEqual([]);
  });

  it('should memoize filtered results', () => {
    const { result, rerender } = renderHook(() => useCourseFilter());

    const firstCourses = result.current.courses;

    rerender();

    expect(result.current.courses).toBe(firstCourses);
  });
});

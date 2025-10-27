import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useGalleryFilter } from '../../../src/features/gallery/hooks/useGalleryFilter';

describe('useGalleryFilter', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGalleryFilter());

    expect(result.current.category).toBe('All');
    expect(result.current.sortBy).toBe('date');
    expect(result.current.totalCount).toBeGreaterThan(0);
    expect(result.current.filteredCount).toBe(result.current.totalCount);
  });

  it('should filter by Marine Life category', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => {
      result.current.setCategory('Marine Life');
    });

    expect(result.current.category).toBe('Marine Life');
    expect(result.current.images.every((img) => img.category === 'Marine Life')).toBe(true);
  });

  it('should filter by Boats category', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => {
      result.current.setCategory('Boats');
    });

    expect(result.current.images.every((img) => img.category === 'Boats')).toBe(true);
  });

  it('should sort by title', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => {
      result.current.setSortBy('title');
    });

    expect(result.current.sortBy).toBe('title');

    const titles = result.current.images.map((img) => img.title);
    const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sortedTitles);
  });

  it('should sort by date (reverse order)', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => {
      result.current.setSortBy('date');
    });

    expect(result.current.sortBy).toBe('date');
  });

  it('should combine category filter and title sort', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => {
      result.current.setCategory('Marine Life');
      result.current.setSortBy('title');
    });

    expect(result.current.category).toBe('Marine Life');
    const titles = result.current.images.map((img) => img.title);
    const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sortedTitles);
  });

  it('should reset filters to defaults', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => {
      result.current.setCategory('Divers');
      result.current.setSortBy('title');
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.category).toBe('All');
    expect(result.current.sortBy).toBe('date');
    expect(result.current.filteredCount).toBe(result.current.totalCount);
  });

  it('should initialize with custom category', () => {
    const { result } = renderHook(() => useGalleryFilter({ initialCategory: 'Underwater' }));

    expect(result.current.category).toBe('Underwater');
  });

  it('should initialize with custom sort', () => {
    const { result } = renderHook(() => useGalleryFilter({ initialSortBy: 'title' }));

    expect(result.current.sortBy).toBe('title');
  });

  it('should update filtered count when category changes', () => {
    const { result } = renderHook(() => useGalleryFilter());

    const initialCount = result.current.filteredCount;

    act(() => {
      result.current.setCategory('Marine Life');
    });

    expect(result.current.filteredCount).toBeLessThanOrEqual(initialCount);
  });

  it('should memoize filtered results', () => {
    const { result, rerender } = renderHook(() => useGalleryFilter());

    const firstImages = result.current.images;

    rerender();

    expect(result.current.images).toBe(firstImages);
  });
});

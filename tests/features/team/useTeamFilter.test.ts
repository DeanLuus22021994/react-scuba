import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTeamFilter } from '../../../src/features/team/hooks/useTeamFilter';

describe('useTeamFilter', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTeamFilter());

    expect(result.current.specialty).toBe('all');
    expect(result.current.totalCount).toBeGreaterThan(0);
    expect(result.current.filteredCount).toBe(result.current.totalCount);
  });

  it('should show all members when specialty is all', () => {
    const { result } = renderHook(() => useTeamFilter());

    expect(result.current.members.length).toBe(result.current.totalCount);
  });

  it('should filter by beginner specialty', () => {
    const { result } = renderHook(() => useTeamFilter());

    act(() => {
      result.current.setSpecialty('beginner');
    });

    expect(result.current.specialty).toBe('beginner');
    if (result.current.members.length > 0) {
      expect(
        result.current.members.every((member) => member.role.toLowerCase().includes('open water'))
      ).toBe(true);
    }
  });

  it('should filter by advanced specialty', () => {
    const { result } = renderHook(() => useTeamFilter());

    act(() => {
      result.current.setSpecialty('advanced');
    });

    if (result.current.members.length > 0) {
      expect(
        result.current.members.every((member) => member.role.toLowerCase().includes('advanced'))
      ).toBe(true);
    }
  });

  it('should filter by technical specialty', () => {
    const { result } = renderHook(() => useTeamFilter());

    act(() => {
      result.current.setSpecialty('technical');
    });

    if (result.current.members.length > 0) {
      expect(
        result.current.members.every((member) => member.role.toLowerCase().includes('technical'))
      ).toBe(true);
    }
  });

  it('should filter by photography specialty', () => {
    const { result } = renderHook(() => useTeamFilter());

    act(() => {
      result.current.setSpecialty('photography');
    });

    if (result.current.members.length > 0) {
      expect(
        result.current.members.every((member) => member.role.toLowerCase().includes('photo'))
      ).toBe(true);
    }
  });

  it('should reset filters to defaults', () => {
    const { result } = renderHook(() => useTeamFilter());

    act(() => {
      result.current.setSpecialty('technical');
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.specialty).toBe('all');
    expect(result.current.filteredCount).toBe(result.current.totalCount);
  });

  it('should initialize with custom specialty', () => {
    const { result } = renderHook(() => useTeamFilter({ initialSpecialty: 'advanced' }));

    expect(result.current.specialty).toBe('advanced');
  });

  it('should update filtered count correctly', () => {
    const { result } = renderHook(() => useTeamFilter());

    const totalCount = result.current.totalCount;

    act(() => {
      result.current.setSpecialty('technical');
    });

    expect(result.current.filteredCount).toBeLessThanOrEqual(totalCount);
  });

  it('should handle empty specialty filter results', () => {
    const { result } = renderHook(() => useTeamFilter());

    act(() => {
      // Try a specialty that might not exist
      result.current.setSpecialty('photography');
    });

    expect(result.current.filteredCount).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(result.current.members)).toBe(true);
  });

  it('should memoize filtered results', () => {
    const { result, rerender } = renderHook(() => useTeamFilter());

    const firstMembers = result.current.members;

    rerender();

    expect(result.current.members).toBe(firstMembers);
  });
});

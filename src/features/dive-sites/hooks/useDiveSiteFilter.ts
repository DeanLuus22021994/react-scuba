import { DIVE_SITES, type DiveSite } from '@config/constants/DIVE_SITES';
import { useMemo, useState } from 'react';

export type DiveDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UseDiveSiteFilterOptions {
  initialDifficulty?: DiveDifficulty | 'All';
  initialDepthRange?: [number, number];
}

export interface UseDiveSiteFilterReturn {
  sites: DiveSite[];
  difficulty: DiveDifficulty | 'All';
  depthRange: [number, number];
  setDifficulty: (difficulty: DiveDifficulty | 'All') => void;
  setDepthRange: (range: [number, number]) => void;
  resetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

/**
 * useDiveSiteFilter Hook
 *
 * Custom hook for filtering dive sites by difficulty and depth.
 * Provides memoized results for performance.
 */
export const useDiveSiteFilter = (options?: UseDiveSiteFilterOptions): UseDiveSiteFilterReturn => {
  const [difficulty, setDifficulty] = useState<DiveDifficulty | 'All'>(options?.initialDifficulty || 'All');
  const [depthRange, setDepthRange] = useState<[number, number]>(options?.initialDepthRange || [0, 50]);

  const sites = useMemo(() => {
    let filtered = [...DIVE_SITES];

    // Filter by difficulty
    if (difficulty !== 'All') {
      filtered = filtered.filter((site) => site.difficulty.toLowerCase().includes(difficulty.toLowerCase()));
    }

    // Filter by depth range
    filtered = filtered.filter((site) => {
      const maxDepth = parseInt(site.depth);
      return maxDepth >= depthRange[0] && maxDepth <= depthRange[1];
    });

    return filtered;
  }, [difficulty, depthRange]);

  const resetFilters = () => {
    setDifficulty('All');
    setDepthRange([0, 50]);
  };

  return {
    sites,
    difficulty,
    depthRange,
    setDifficulty,
    setDepthRange,
    resetFilters,
    filteredCount: sites.length,
    totalCount: DIVE_SITES.length,
  };
};

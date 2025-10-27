import { useMemo, useState } from 'react';
import { COURSES, type Course } from '../../../config/constants/COURSES';

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'professional';

export interface UseCourseFilterOptions {
  initialDifficulty?: CourseDifficulty | 'all';
  initialPriceRange?: [number, number];
}

export interface UseCourseFilterReturn {
  courses: Course[];
  difficulty: CourseDifficulty | 'all';
  priceRange: [number, number];
  setDifficulty: (difficulty: CourseDifficulty | 'all') => void;
  setPriceRange: (range: [number, number]) => void;
  resetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

/**
 * useCourseFilter Hook
 *
 * Custom hook for filtering and sorting diving courses.
 * Supports difficulty level and price range filtering.
 */
export const useCourseFilter = (options?: UseCourseFilterOptions): UseCourseFilterReturn => {
  const [difficulty, setDifficulty] = useState<CourseDifficulty | 'all'>(options?.initialDifficulty || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>(options?.initialPriceRange || [0, 50000]);

  const courses = useMemo(() => {
    let filtered = [...COURSES];

    // Filter by difficulty
    if (difficulty !== 'all') {
      filtered = filtered.filter((course) => {
        // TODO: Add difficulty property to Course interface
        // For now, map by course level/price
        if (difficulty === 'beginner') return course.price <= 5000;
        if (difficulty === 'intermediate') return course.price > 5000 && course.price <= 15000;
        if (difficulty === 'advanced') return course.price > 15000 && course.price <= 30000;
        if (difficulty === 'professional') return course.price > 30000;
        return true;
      });
    }

    // Filter by price range
    filtered = filtered.filter((course) => course.price >= priceRange[0] && course.price <= priceRange[1]);

    return filtered;
  }, [difficulty, priceRange]);

  const resetFilters = () => {
    setDifficulty('all');
    setPriceRange([0, 50000]);
  };

  return {
    courses,
    difficulty,
    priceRange,
    setDifficulty,
    setPriceRange,
    resetFilters,
    filteredCount: courses.length,
    totalCount: COURSES.length,
  };
};

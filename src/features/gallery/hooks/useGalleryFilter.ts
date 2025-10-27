import { useMemo, useState } from 'react';
import { GALLERY_IMAGES, getImagesByCategory, type GalleryCategory } from '../../../config/constants/GALLERY';

export interface UseGalleryFilterOptions {
  initialCategory?: GalleryCategory | 'All';
  initialSortBy?: 'date' | 'title';
}

export interface UseGalleryFilterReturn {
  images: ReturnType<typeof getImagesByCategory>;
  category: GalleryCategory | 'All';
  sortBy: 'date' | 'title';
  setCategory: (category: GalleryCategory | 'All') => void;
  setSortBy: (sortBy: 'date' | 'title') => void;
  resetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

/**
 * useGalleryFilter Hook
 *
 * Custom hook for filtering and sorting gallery images.
 * Supports category filtering and date/title sorting.
 */
export const useGalleryFilter = (options?: UseGalleryFilterOptions): UseGalleryFilterReturn => {
  const [category, setCategory] = useState<GalleryCategory | 'All'>(options?.initialCategory || 'All');
  const [sortBy, setSortBy] = useState<'date' | 'title'>(options?.initialSortBy || 'date');

  const images = useMemo(() => {
    let filtered = getImagesByCategory(category);

    // Sort images
    if (sortBy === 'title') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Assume newest first by default
      filtered = [...filtered].reverse();
    }

    return filtered;
  }, [category, sortBy]);

  const resetFilters = () => {
    setCategory('All');
    setSortBy('date');
  };

  return {
    images,
    category,
    sortBy,
    setCategory,
    setSortBy,
    resetFilters,
    filteredCount: images.length,
    totalCount: GALLERY_IMAGES.length,
  };
};

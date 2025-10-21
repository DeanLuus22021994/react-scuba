import { describe, expect, it } from 'vitest';
import {
  FEATURED_IMAGES,
  filterImagesByCategory,
  GALLERY_CATEGORIES,
  GALLERY_IMAGES,
} from '../../../src/data/gallery';

describe('gallery', () => {
  it('should export GALLERY_IMAGES array', () => {
    expect(GALLERY_IMAGES).toBeDefined();
    expect(Array.isArray(GALLERY_IMAGES)).toBe(true);
    expect(GALLERY_IMAGES.length).toBeGreaterThan(0);
  });

  it('should export FEATURED_IMAGES array', () => {
    expect(FEATURED_IMAGES).toBeDefined();
    expect(Array.isArray(FEATURED_IMAGES)).toBe(true);
  });

  it('should export GALLERY_CATEGORIES array', () => {
    expect(GALLERY_CATEGORIES).toBeDefined();
    expect(Array.isArray(GALLERY_CATEGORIES)).toBe(true);
  });

  it('should have valid gallery image structure', () => {
    GALLERY_IMAGES.forEach((image) => {
      expect(image).toHaveProperty('id');
      expect(image).toHaveProperty('url');
      expect(image).toHaveProperty('thumbnail');
      expect(image).toHaveProperty('title');
      expect(image).toHaveProperty('description');
      expect(image).toHaveProperty('category');
    });
  });

  it('should export filterImagesByCategory function', () => {
    expect(filterImagesByCategory).toBeDefined();
    expect(typeof filterImagesByCategory).toBe('function');
  });
});

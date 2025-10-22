import { describe, expect, it } from 'vitest';
import { CATEGORIES, FEATURED_IMAGES, GALLERY_IMAGES, getImagesByCategory } from '@/data/gallery';

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

  it('should export CATEGORIES array', () => {
    expect(CATEGORIES).toBeDefined();
    expect(Array.isArray(CATEGORIES)).toBe(true);
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

  it('should export getImagesByCategory function', () => {
    expect(getImagesByCategory).toBeDefined();
    expect(typeof getImagesByCategory).toBe('function');
  });
});

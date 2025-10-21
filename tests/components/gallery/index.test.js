import { describe, expect, it } from 'vitest';
import * as galleryExports from '../../../src/components/gallery/index';

describe('components/gallery/index', () => {
  it('should export FeaturedCarousel', () => {
    expect(galleryExports.FeaturedCarousel).toBeDefined();
  });

  it('should export GalleryGrid', () => {
    expect(galleryExports.GalleryGrid).toBeDefined();
  });

  it('should export GalleryPage', () => {
    expect(galleryExports.GalleryPage).toBeDefined();
  });

  it('should export Lightbox', () => {
    expect(galleryExports.Lightbox).toBeDefined();
  });
});

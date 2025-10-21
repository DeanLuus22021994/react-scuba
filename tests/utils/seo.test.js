import { describe, expect, it } from 'vitest';
import { defaultMetaTags, generatePageMetaTags } from '@/utils/seo';

describe('seo', () => {
  it('should export defaultMetaTags', () => {
    expect(defaultMetaTags).toBeDefined();
    expect(typeof defaultMetaTags).toBe('object');
  });

  it('should have required default meta tags', () => {
    expect(defaultMetaTags).toHaveProperty('title');
    expect(defaultMetaTags).toHaveProperty('description');
    expect(defaultMetaTags).toHaveProperty('keywords');
  });

  it('should export generatePageMetaTags function', () => {
    expect(generatePageMetaTags).toBeDefined();
    expect(typeof generatePageMetaTags).toBe('function');
  });

  it('should generate meta tags for home page', () => {
    const meta = generatePageMetaTags('home');
    expect(meta).toHaveProperty('title');
    expect(meta).toHaveProperty('description');
    expect(meta).toHaveProperty('canonical');
  });

  it('should generate meta tags for about page', () => {
    const meta = generatePageMetaTags('about');
    expect(meta).toHaveProperty('title');
    expect(meta).toHaveProperty('description');
    expect(meta.title).toContain('About');
  });

  it('should generate meta tags for courses page', () => {
    const meta = generatePageMetaTags('courses');
    expect(meta).toHaveProperty('title');
    expect(meta.title).toContain('Courses');
  });

  it('should handle unknown page', () => {
    const meta = generatePageMetaTags('unknown');
    expect(meta).toHaveProperty('title');
    expect(meta).toHaveProperty('description');
  });
});

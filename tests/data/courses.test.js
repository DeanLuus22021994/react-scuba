import { describe, expect, it } from 'vitest';
import { COURSES, getCourseById } from '@/data/courses';

describe('courses', () => {
  it('should export COURSES array', () => {
    expect(COURSES).toBeDefined();
    expect(Array.isArray(COURSES)).toBe(true);
    expect(COURSES.length).toBeGreaterThan(0);
  });

  it('should have valid course structure', () => {
    COURSES.forEach((course) => {
      expect(course).toHaveProperty('id');
      expect(course).toHaveProperty('name');
      expect(course).toHaveProperty('tagline');
      expect(course).toHaveProperty('price');
      expect(course).toHaveProperty('duration');
      expect(course).toHaveProperty('minAge');
      expect(course).toHaveProperty('certification');
      expect(course).toHaveProperty('description');
      expect(course).toHaveProperty('included');
      expect(course).toHaveProperty('curriculum');
    });
  });

  it('should export getCourseById function', () => {
    expect(getCourseById).toBeDefined();
    expect(typeof getCourseById).toBe('function');
  });

  it('should find course by id', () => {
    const course = getCourseById('open-water');
    expect(course).toBeDefined();
    expect(course.id).toBe('open-water');
  });

  it('should return undefined for invalid id', () => {
    const course = getCourseById('invalid-id');
    expect(course).toBeUndefined();
  });
});

import { describe, expect, it } from 'vitest';
import * as coursesExports from '../../../src/components/courses/index';

describe('components/courses/index', () => {
  it('should export CourseCard', () => {
    expect(coursesExports.CourseCard).toBeDefined();
  });

  it('should export CourseComparison', () => {
    expect(coursesExports.CourseComparison).toBeDefined();
  });

  it('should export CoursesPage', () => {
    expect(coursesExports.CoursesPage).toBeDefined();
  });
});

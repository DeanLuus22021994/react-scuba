import * as coursesExports from '@features/courses/index';
import { describe, expect, it } from 'vitest';

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

import { describe, expect, it } from 'vitest';
import { BOOKING_TYPES } from '@/data/bookingTypes';

describe('bookingTypes', () => {
  it('should export BOOKING_TYPES', () => {
    expect(BOOKING_TYPES).toBeDefined();
  });

  it('should have course array', () => {
    expect(BOOKING_TYPES.course).toBeDefined();
    expect(Array.isArray(BOOKING_TYPES.course)).toBe(true);
  });

  it('should have dive array', () => {
    expect(BOOKING_TYPES.dive).toBeDefined();
    expect(Array.isArray(BOOKING_TYPES.dive)).toBe(true);
  });

  it('should have valid course structure', () => {
    BOOKING_TYPES.course.forEach((course) => {
      expect(course).toHaveProperty('id');
      expect(course).toHaveProperty('name');
      expect(course).toHaveProperty('duration');
      expect(course).toHaveProperty('price');
    });
  });

  it('should have valid dive structure', () => {
    BOOKING_TYPES.dive.forEach((dive) => {
      expect(dive).toHaveProperty('id');
      expect(dive).toHaveProperty('name');
      expect(dive).toHaveProperty('duration');
      expect(dive).toHaveProperty('price');
    });
  });
});

import { describe, expect, it } from 'vitest';
import { BOOKING_TYPES } from '../../../src/data/bookingTypes';

describe('bookingTypes', () => {
  it('should export BOOKING_TYPES', () => {
    expect(BOOKING_TYPES).toBeDefined();
  });

  it('should have courses array', () => {
    expect(BOOKING_TYPES.courses).toBeDefined();
    expect(Array.isArray(BOOKING_TYPES.courses)).toBe(true);
  });

  it('should have dives array', () => {
    expect(BOOKING_TYPES.dives).toBeDefined();
    expect(Array.isArray(BOOKING_TYPES.dives)).toBe(true);
  });

  it('should have valid course structure', () => {
    BOOKING_TYPES.courses.forEach((course) => {
      expect(course).toHaveProperty('id');
      expect(course).toHaveProperty('name');
      expect(course).toHaveProperty('duration');
      expect(course).toHaveProperty('price');
    });
  });

  it('should have valid dive structure', () => {
    BOOKING_TYPES.dives.forEach((dive) => {
      expect(dive).toHaveProperty('id');
      expect(dive).toHaveProperty('name');
      expect(dive).toHaveProperty('duration');
      expect(dive).toHaveProperty('price');
    });
  });
});

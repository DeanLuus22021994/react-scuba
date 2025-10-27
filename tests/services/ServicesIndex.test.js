import { describe, expect, it } from 'vitest';
import * as servicesExports from '../../src/services/index.js';

describe('services/index', () => {
  it('should export api functions', () => {
    expect(servicesExports).toBeDefined();
  });

  it('should have sendContactMessage', () => {
    expect(servicesExports.sendContactMessage).toBeDefined();
  });

  it('should have createCalendarBooking', () => {
    expect(servicesExports.createCalendarBooking).toBeDefined();
  });

  it('should have checkCalendarAvailability', () => {
    expect(servicesExports.checkCalendarAvailability).toBeDefined();
  });
});

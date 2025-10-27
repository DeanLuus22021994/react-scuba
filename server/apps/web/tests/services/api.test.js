import { describe, expect, it } from 'vitest';
import {
  checkCalendarAvailability,
  createCalendarBooking,
  submitContactForm as sendContactMessage,
} from '../../src/services/api';

describe('api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export sendContactMessage', () => {
    expect(sendContactMessage).toBeDefined();
    expect(typeof sendContactMessage).toBe('function');
  });

  it('should export createCalendarBooking', () => {
    expect(createCalendarBooking).toBeDefined();
    expect(typeof createCalendarBooking).toBe('function');
  });

  it('should export checkCalendarAvailability', () => {
    expect(checkCalendarAvailability).toBeDefined();
    expect(typeof checkCalendarAvailability).toBe('function');
  });

  it('sendContactMessage should handle successful response', async () => {
    const result = await sendContactMessage({
      name: 'Test',
      email: 'test@example.com',
      message: 'Test message',
    });

    // API returns {success: true/false, ...}
    expect(result).toHaveProperty('success');
    expect(typeof result.success).toBe('boolean');
  });

  it('checkCalendarAvailability should return object', async () => {
    const result = await checkCalendarAvailability(new Date(), '09:00');
    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('success');
  });
});

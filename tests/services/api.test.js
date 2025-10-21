import { describe, expect, it, vi } from 'vitest';
import {
  checkCalendarAvailability,
  createCalendarBooking,
  sendContactMessage,
} from '../../src/services/api';

// Mock fetch
global.fetch = vi.fn();

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
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await sendContactMessage({
      name: 'Test',
      email: 'test@example.com',
      message: 'Test message',
    });

    expect(result).toEqual({ success: true });
  });

  it('checkCalendarAvailability should return boolean', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => true,
    });

    const result = await checkCalendarAvailability(new Date(), '09:00');
    expect(typeof result).toBe('boolean');
  });
});

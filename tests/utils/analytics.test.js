import { describe, expect, it, vi } from 'vitest';
import {
  trackCalendarBookingComplete,
  trackFormAbandon,
  trackFormComplete,
  trackFormStart,
  trackPhoneClick,
  trackWhatsAppClick,
} from '@/utils/analytics';

describe('analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export trackFormStart', () => {
    expect(trackFormStart).toBeDefined();
    expect(typeof trackFormStart).toBe('function');
  });

  it('should export trackFormComplete', () => {
    expect(trackFormComplete).toBeDefined();
    expect(typeof trackFormComplete).toBe('function');
  });

  it('should export trackFormAbandon', () => {
    expect(trackFormAbandon).toBeDefined();
    expect(typeof trackFormAbandon).toBe('function');
  });

  it('should export trackPhoneClick', () => {
    expect(trackPhoneClick).toBeDefined();
    expect(typeof trackPhoneClick).toBe('function');
  });

  it('should export trackWhatsAppClick', () => {
    expect(trackWhatsAppClick).toBeDefined();
    expect(typeof trackWhatsAppClick).toBe('function');
  });

  it('should export trackCalendarBookingComplete', () => {
    expect(trackCalendarBookingComplete).toBeDefined();
    expect(typeof trackCalendarBookingComplete).toBe('function');
  });

  it('should call trackFormStart without errors', () => {
    expect(() => trackFormStart('test-source', 'test-form')).not.toThrow();
  });

  it('should call trackPhoneClick without errors', () => {
    expect(() => trackPhoneClick('test-source')).not.toThrow();
  });

  it('should call trackWhatsAppClick without errors', () => {
    expect(() => trackWhatsAppClick('test-source', 'test-type')).not.toThrow();
  });
});

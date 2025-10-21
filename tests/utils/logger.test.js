import { describe, expect, it, vi } from 'vitest';
import logger from '@/utils/logger';

describe('logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export logger object', () => {
    expect(logger).toBeDefined();
    expect(typeof logger).toBe('object');
  });

  it('should have info method', () => {
    expect(logger.info).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });

  it('should have error method', () => {
    expect(logger.error).toBeDefined();
    expect(typeof logger.error).toBe('function');
  });

  it('should have warn method', () => {
    expect(logger.warn).toBeDefined();
    expect(typeof logger.warn).toBe('function');
  });

  it('should have info method', () => {
    expect(logger.info).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });

  it('should call logger methods without errors', () => {
    expect(() => logger.info('test')).not.toThrow();
    expect(() => logger.error('test')).not.toThrow();
    expect(() => logger.warn('test')).not.toThrow();
    expect(() => logger.debug('test')).not.toThrow();
  });
});

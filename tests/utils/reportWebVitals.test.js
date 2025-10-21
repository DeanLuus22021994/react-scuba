import { describe, expect, it } from 'vitest';
import reportWebVitals from '../../src/utils/reportWebVitals';

describe('reportWebVitals', () => {
  it('should export reportWebVitals function', () => {
    expect(reportWebVitals).toBeDefined();
    expect(typeof reportWebVitals).toBe('function');
  });

  it('should accept callback function', () => {
    const callback = () => {};
    expect(() => reportWebVitals(callback)).not.toThrow();
  });

  it('should work without callback', () => {
    expect(() => reportWebVitals()).not.toThrow();
  });
});

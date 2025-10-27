import 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> {
    toBeInTheDocument(): void;
    toHaveValue(value: unknown): void;
    toBeDisabled(): void;
  }

  interface AsymmetricMatchers {
    toBeInTheDocument(): void;
    toHaveValue(value: unknown): void;
    toBeDisabled(): void;
  }
}

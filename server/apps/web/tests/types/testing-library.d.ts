import type { ReactNode } from 'react';

declare module '@testing-library/react' {
  interface RenderHookResult<Result, Props> {
    readonly result: { readonly current: Result };
    readonly rerender: (props?: Props) => void;
    readonly unmount: () => void;
  }

  interface RenderHookOptions<Props> {
    readonly initialProps?: Props;
    readonly wrapper?: (props: { children: ReactNode }) => ReactNode;
  }

  // Minimal typings covering current test usage.
  export function renderHook<Result, Props = undefined>(
    callback: (props: Props) => Result,
    options?: RenderHookOptions<Props>
  ): RenderHookResult<Result, Props>;
}

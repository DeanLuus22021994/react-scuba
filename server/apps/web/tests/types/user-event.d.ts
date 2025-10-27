declare module '@testing-library/user-event' {
  interface UserEventOptions {
    delay?: number;
  }

  interface UserEventInstance {
    clear(element: Element): Promise<void>;
    click(element: Element): Promise<void>;
    type(element: Element, text: string, options?: UserEventOptions): Promise<void>;
    selectOptions(element: Element, values: string | string[]): Promise<void>;
  }

  interface UserEventSetupOptions extends UserEventOptions {}

  function setup(options?: UserEventSetupOptions): UserEventInstance;

  const userEvent: UserEventInstance & {
    setup: typeof setup;
  };

  export { setup };
  export default userEvent;
}

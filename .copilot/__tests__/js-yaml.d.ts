// Type declarations for Node.js built-in modules and external dependencies
// Used in .copilot/__tests__/ to support test environment

declare var __dirname: string;

declare module 'js-yaml' {
  export function load(str: string): any;
  export function dump(obj: any): string;
}

/**
 * Module type declarations for TypeScript resolution
 * Handles legacy .js imports and modern .ts modules
 */

// Legacy JavaScript modules (for migration period)
declare module '*.js' {
  const content: any;
  export = content;
}

// Direct module path declarations for services
declare module '../services/api.ts' {
  export * from '../services/api';
}

declare module '../services/api.js' {
  export * from '../services/api';
}

declare module '../services/api' {
  export * from '../services/api';
}

// Utils module declarations
declare module '../utils/analytics.ts' {
  export * from '../utils/analytics';
}

declare module '../utils/analytics.js' {
  export * from '../utils/analytics';
}

declare module '../utils/analytics' {
  export * from '../utils/analytics';
}

declare module '../utils/logger.ts' {
  export * from '../utils/logger';
}

declare module '../utils/logger.js' {
  export * from '../utils/logger';
}

declare module '../utils/logger' {
  export * from '../utils/logger';
}

// Relative path patterns
declare module './services/api' {
  export * from '../services/api';
}

declare module './utils/analytics' {
  export * from '../utils/analytics';
}

declare module './utils/logger' {
  export * from '../utils/logger';
}

// Content package modules
declare module '@react-scuba/content' {
  export const getClientConfig: (clientId?: string) => Promise<any>;
  export const resolveClientFromRequest: (req: any) => Promise<string>;
  export const validateClientConfig: (config: any) => boolean;
  export interface ClientConfig {
    id: string;
    name: string;
    domain?: string;
    subdomain?: string;
    theme?: any;
    features?: any;
    contact?: any;
    social?: any;
  }
}

// UI package modules
declare module '@react-scuba/ui' {
  export * from '@react-scuba/ui/components';
}

// Utils package modules
declare module '@react-scuba/utils' {
  export * from '@react-scuba/utils/formatters';
  export * from '@react-scuba/utils/validators';
}

// Types package modules
declare module '@react-scuba/types' {
  export * from '@react-scuba/types/api';
  export * from '@react-scuba/types/booking';
  export * from '@react-scuba/types/client';
}

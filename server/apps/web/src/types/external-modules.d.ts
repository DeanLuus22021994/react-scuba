/**
 * Type declarations for external modules without TypeScript definitions
 */

declare module 'react-gtm-module' {
  interface GTMParams {
    gtmId: string;
    dataLayer?: Record<string, unknown>[];
    dataLayerName?: string;
    auth?: string;
    preview?: string;
  }

  interface TagManagerArgs {
    gtmId: string;
    dataLayer?: Record<string, unknown>[];
    dataLayerName?: string;
    auth?: string;
    preview?: string;
  }

  export function initialize(params: GTMParams): void;
  const TagManager: {
    initialize: (params: GTMParams) => void;
  };
  export default TagManager;
}


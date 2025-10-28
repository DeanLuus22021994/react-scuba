// Global type declarations for Node.js environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test';
      VITE_ANALYTICS_API_ENDPOINT?: string;
    }
  }

  var process: {
    env: NodeJS.ProcessEnv;
  };
}

export {};

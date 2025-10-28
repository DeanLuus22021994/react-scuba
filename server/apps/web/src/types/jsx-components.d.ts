/**
 * Global type declarations for JSX components and modules
 * Modernized module resolution for TypeScript strict mode
 */

/// <reference types="vite/client" />

declare module '*.jsx' {
  import React from 'react';

  interface ComponentProps {
    [key: string]: unknown;
  }

  const Component: React.ComponentType<ComponentProps>;
  export default Component;
}

declare module '*.js' {
  const content: any;
  export = content;
}

// Force TypeScript to recognize converted .ts files
declare module '*/logger' {
  export * from './logger';
}

declare module '*/api' {
  export * from './api';
}

declare module '*/analytics' {
  export * from './analytics';
}

declare module '*/currency' {
  export * from './currency';
}

declare module '*/env' {
  export * from './env';
}

declare module '*/scrollToAnchor' {
  export * from './scrollToAnchor';
}

declare module '*/seo' {
  export * from './seo';
}// Comprehensive API service declarations
declare module '**/services/api' {
  interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string | object;
  }

  export const createBooking: (data: unknown) => Promise<ApiResponse>;
  export const getExchangeRates: () => Promise<ApiResponse>;
  export const submitContactForm: (data: unknown) => Promise<ApiResponse>;
  export const submitBookingInquiry: (data: unknown) => Promise<ApiResponse>;
}

// Analytics service declarations
declare module '**/utils/analytics' {
  export const trackConversion: (name: string, params?: Record<string, unknown>) => void;
  export const initializeAnalytics: () => void;
  export const trackPageView: (path: string, title: string) => void;
  export const trackContactSubmit: (source: string, type: string) => void;
}

// Logger service declarations
declare module '**/utils/logger' {
  interface Logger {
    info: (message: string, extra?: Record<string, unknown>) => void;
    warn: (message: string, extra?: Record<string, unknown>) => void;
    error: (message: string, extra?: Record<string, unknown>) => void;
    debug: (message: string, extra?: Record<string, unknown>) => void;
    setCorrelationId: (id: string) => void;
    getCorrelationId: () => string;
  }

  const logger: Logger;
  export default logger;
}

// UI Component declarations
declare module '**/components/ui/BackToTop' {
  import React from 'react';
  const BackToTop: React.ComponentType<{ className?: string }>;
  export default BackToTop;
}

declare module '**/components/ui/Loading' {
  import React from 'react';
  const Loading: React.ComponentType<{ size?: string; className?: string }>;
  export default Loading;
}

declare module '**/components/ui/CurrencySelector' {
  import React from 'react';
  interface CurrencySelectorProps {
    onCurrencyChange?: (currency: string) => void;
    className?: string;
  }
  const CurrencySelector: React.ComponentType<CurrencySelectorProps>;
  export default CurrencySelector;
}

declare module '**/components/ui/ErrorBoundary' {
  import React from 'react';
  interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error }>;
  }
  const ErrorBoundary: React.ComponentType<ErrorBoundaryProps>;
  export default ErrorBoundary;
}

declare module '**/components/ui/PhoneLink' {
  import React from 'react';
  interface PhoneLinkProps {
    phone: string;
    children?: React.ReactNode;
    className?: string;
  }
  const PhoneLink: React.ComponentType<PhoneLinkProps>;
  export default PhoneLink;
}

declare module '**/components/ui/ScrollProgress' {
  import React from 'react';
  const ScrollProgress: React.ComponentType<{ className?: string }>;
  export default ScrollProgress;
}

declare module '**/components/ui/SEO' {
  import React from 'react';
  interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
  }
  const SEO: React.ComponentType<SEOProps>;
  export default SEO;
}

declare module '**/components/ui/WhatsAppButton' {
  import React from 'react';
  interface WhatsAppButtonProps {
    phone: string;
    message?: string;
    className?: string;
  }
  const WhatsAppButton: React.ComponentType<WhatsAppButtonProps>;
  export default WhatsAppButton;
}

declare module '**/components/ui/WhatsAppWidget' {
  import React from 'react';
  interface WhatsAppWidgetProps {
    phone: string;
    message?: string;
    position?: 'bottom-right' | 'bottom-left';
  }
  const WhatsAppWidget: React.ComponentType<WhatsAppWidgetProps>;
  export default WhatsAppWidget;
}

/**
 * Enhanced TypeScript module declarations for complete resolution
 * This file ensures all imports resolve correctly during the transition period
 */

/// <reference types="vite/client" />

// Override module resolution to force TypeScript to use .ts files instead of .js
declare module "*.ts" {
  const content: any;
  export = content;
}

// Specific overrides for converted utility modules
declare module "./logger" {
  export * from "./logger";
}

declare module "../utils/logger" {
  export * from "./logger";
}

declare module "./api" {
  export * from "./api";
}

declare module "../services/api" {
  export * from "./api";
}

declare module "../../services/api" {
  export * from "./api";
}

declare module "../../../services/api" {
  export * from "./api";
}

declare module "./analytics" {
  export * from "./analytics";
}

declare module "../utils/analytics" {
  export * from "./analytics";
}

declare module "../../utils/analytics" {
  export * from "./analytics";
}

declare module "../../../utils/analytics" {
  export * from "./analytics";
}

declare module "./currency" {
  export * from "./currency";
}

declare module "./env" {
  export * from "./env";
}

declare module "./scrollToAnchor" {
  export * from "./scrollToAnchor";
}

declare module "./seo" {
  export * from "./seo";
}

// Global JSX component declarations
declare module '*.jsx' {
  import React from 'react';
  const Component: React.ComponentType<any>;
  export = Component;
}

// TypeScript utility modules that were converted from .js
declare module '../utils/logger' {
  const logger: import('./logger').default;
  export = logger;
}

declare module '../services/api' {
  export * from './api';
}

declare module '../utils/analytics' {
  export * from './analytics';
}

declare module './currency' {
  export * from './currency';
}

declare module './env' {
  export * from './env';
}

declare module './scrollToAnchor' {
  export * from './scrollToAnchor';
}

declare module './seo' {
  export * from './seo';
}

// Relative service imports
declare module '../../services/api' {
  export * from '../services/api';
}

declare module '../../../services/api' {
  export * from '../services/api';
}

// Relative utils imports
declare module '../../utils/analytics' {
  export * from '../utils/analytics';
}

declare module '../../../utils/analytics' {
  export * from '../utils/analytics';
}

// JSX Component declarations for all UI components
declare module './BackToTop' {
  import React from 'react';
  const BackToTop: React.ComponentType<{ className?: string }>;
  export = BackToTop;
}

declare module './CurrencySelector' {
  import React from 'react';
  interface CurrencySelectorProps {
    onCurrencyChange?: (currency: string) => void;
    className?: string;
  }
  const CurrencySelector: React.ComponentType<CurrencySelectorProps>;
  export = CurrencySelector;
}

declare module './ErrorBoundary' {
  import React from 'react';
  interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error }>;
  }
  const ErrorBoundary: React.ComponentType<ErrorBoundaryProps>;
  export = ErrorBoundary;
}

declare module './Loading' {
  import React from 'react';
  const Loading: React.ComponentType<{ size?: string; className?: string }>;
  export = Loading;
}

declare module './PhoneLink' {
  import React from 'react';
  interface PhoneLinkProps {
    phone: string;
    children?: React.ReactNode;
    className?: string;
  }
  const PhoneLink: React.ComponentType<PhoneLinkProps>;
  export = PhoneLink;
}

declare module './ScrollProgress' {
  import React from 'react';
  const ScrollProgress: React.ComponentType<{ className?: string }>;
  export = ScrollProgress;
}

declare module './SEO' {
  import React from 'react';
  interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
  }
  const SEO: React.ComponentType<SEOProps>;
  export = SEO;
}

declare module './WhatsAppButton' {
  import React from 'react';
  interface WhatsAppButtonProps {
    phone: string;
    message?: string;
    className?: string;
  }
  const WhatsAppButton: React.ComponentType<WhatsAppButtonProps>;
  export = WhatsAppButton;
}

declare module './WhatsAppWidget' {
  import React from 'react';
  interface WhatsAppWidgetProps {
    phone: string;
    message?: string;
    position?: 'bottom-right' | 'bottom-left';
  }
  const WhatsAppWidget: React.ComponentType<WhatsAppWidgetProps>;
  export = WhatsAppWidget;
}

// Feature component declarations
declare module './components/CourseCard' {
  import React from 'react';
  const CourseCard: React.ComponentType<any>;
  export = CourseCard;
}

declare module './components/CourseComparison' {
  import React from 'react';
  const CourseComparison: React.ComponentType<any>;
  export = CourseComparison;
}

declare module './components/CoursesPage' {
  import React from 'react';
  const CoursesPage: React.ComponentType<any>;
  export = CoursesPage;
}

declare module './components/DiveMap' {
  import React from 'react';
  const DiveMap: React.ComponentType<any>;
  export = DiveMap;
}

declare module './components/DiveSiteCard' {
  import React from 'react';
  const DiveSiteCard: React.ComponentType<any>;
  export = DiveSiteCard;
}

declare module './components/DiveSitesPage' {
  import React from 'react';
  const DiveSitesPage: React.ComponentType<any>;
  export = DiveSitesPage;
}

declare module './components/FeaturedCarousel' {
  import React from 'react';
  const FeaturedCarousel: React.ComponentType<any>;
  export = FeaturedCarousel;
}

declare module './components/GalleryGrid' {
  import React from 'react';
  const GalleryGrid: React.ComponentType<any>;
  export = GalleryGrid;
}

declare module './components/GalleryPage' {
  import React from 'react';
  const GalleryPage: React.ComponentType<any>;
  export = GalleryPage;
}

declare module './components/Lightbox' {
  import React from 'react';
  const Lightbox: React.ComponentType<any>;
  export = Lightbox;
}

declare module './components/AboutPage' {
  import React from 'react';
  const AboutPage: React.ComponentType<any>;
  export = AboutPage;
}

declare module './components/CredentialCard' {
  import React from 'react';
  const CredentialCard: React.ComponentType<any>;
  export = CredentialCard;
}

declare module './components/TeamMember' {
  import React from 'react';
  const TeamMember: React.ComponentType<any>;
  export = TeamMember;
}

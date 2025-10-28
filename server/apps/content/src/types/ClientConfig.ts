/**
 * Multi-Tenant Content Management Types
 * Defines comprehensive client configuration schema for React Scuba Platform
 */

export interface ClientConfig {
  // Tenant Identification
  tenant: {
    id: string;
    slug: string; // URL-safe identifier (e.g., "ocean-spirit-mauritius")
    name: string; // Display name
    status: 'active' | 'inactive' | 'suspended';
    createdAt: string;
    updatedAt: string;
  };

  // Company Information
  company: {
    name: string;
    tagline: string;
    description: string;
    about: string;
    coreValues?: string[];
    certifications?: string[];
    established?: number;
  };

  // Contact Information
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: {
      street: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    businessHours: {
      [key: string]: { open: string; close: string; closed?: boolean };
    };
  };

  // Team Members
  team: TeamMember[];

  // Service Offerings (flexible for any business type)
  services?: Service[];

  // Products (optional)
  products?: Product[];

  // Course Offerings (diving/training specific - optional)
  courses?: Course[];

  // Dive Sites (diving specific - optional)
  diveSites?: DiveSite[];

  // Case Studies / Portfolio (software/agency specific - optional)
  caseStudies?: CaseStudy[];

  // Gallery
  gallery: GalleryImage[];

  // Testimonials
  testimonials?: Testimonial[];

  // Blog Posts
  blog?: BlogPost[];

  // Branding & Assets
  branding: {
    logo: string; // Path to logo image
    favicon: string;
    heroImage: string;
    bannerImage?: string;
    colors: {
      primary: string;
      secondary: string;
      accent?: string;
    };
  };

  // Social Media Links
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tripAdvisor?: string;
    google?: string;
    linkedin?: string;
  };

  // SEO Metadata
  seo: {
    title: string;
    description: string;
    keywords: string[];
    author?: string;
    baseUrl: string;
    ogImage?: string;
  };

  // Analytics
  analytics?: {
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    facebookPixelId?: string;
  };

  // Feature Toggles
  features: {
    booking: boolean;
    gallery: boolean;
    blog: boolean;
    testimonials: boolean;
    multiCurrency: boolean;
    whatsappWidget: boolean;
    liveChat?: boolean;
  };

  // Pricing & Currency
  pricing: {
    defaultCurrency: string;
    currencies: string[];
  };

  // Additional Configuration
  config?: {
    recaptchaSiteKey?: string;
    mapboxToken?: string;
    stripePublicKey?: string;
    [key: string]: any;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  certifications?: string[]; // Optional for non-certified roles
  image: string;
  languages?: string[];
  specialties?: string[];
  yearsExperience?: number;
  education?: string[];
  linkedin?: string;
}

export interface Course {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  price: number;
  currency: string;
  duration: string;
  maxStudents?: number;
  minAge?: number;
  prerequisites?: string[];
  description: string;
  curriculum?: string[];
  included?: string[];
  certificationBody?: string;
  image?: string;
}

export interface DiveSite {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  depth: {
    min: number;
    max: number;
    unit: 'meters' | 'feet';
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  marineLife: string[];
  features?: string[];
  bestSeason?: string;
  visibility?: string;
  current?: string;
  temperature?: string;
  image?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  thumbnail?: string;
  alt: string;
  title?: string;
  category: string;
  photographer?: string;
  date?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating?: number;
  date?: string;
  avatar?: string;
  location?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  category: string;
  tags?: string[];
  image?: string;
  url?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon?: string; // Icon identifier or path
  features?: string[];
  benefits?: string[];
  pricing?: {
    model: 'fixed' | 'hourly' | 'subscription' | 'custom';
    amount?: number;
    currency?: string;
    period?: string;
  };
  deliverables?: string[];
  timeline?: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  features?: string[];
  pricing?: {
    amount: number;
    currency: string;
    period?: string;
  };
  documentation?: string; // URL to docs
  demo?: string; // URL to demo
  image?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results?: string[];
  technologies?: string[];
  duration?: string;
  teamSize?: number;
  image?: string;
  url?: string;
}

// Tenant Resolution Context
export interface TenantContext {
  config: ClientConfig;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

// Tenant Resolution Strategy
export type TenantResolutionStrategy = 
  | 'subdomain'   // tenant.platform.com
  | 'domain'      // custom-domain.com
  | 'env'         // TENANT_SLUG environment variable
  | 'path';       // /tenant/slug/...

export interface TenantResolverOptions {
  strategy: TenantResolutionStrategy;
  fallbackSlug?: string; // Default tenant if resolution fails
  configPath?: string; // Path to client configs directory
}

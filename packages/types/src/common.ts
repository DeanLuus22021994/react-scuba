/**
 * Common types used throughout the application
 */

export type Currency = 'USD' | 'EUR' | 'GBP' | 'AUD';

export interface ExchangeRates {
  USD: number;
  EUR: number;
  GBP: number;
  AUD: number;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  prerequisites?: string;
  certification: string;
  price: number;
  maxDepth?: string;
  minAge: number;
  category: 'beginner' | 'advanced' | 'professional' | 'specialty';
}

export interface DiveSite {
  id: string;
  name: string;
  location: string;
  description: string;
  depth: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  highlights: string[];
  imageUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  certifications: string[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  thumbnail?: string;
}

export interface Booking {
  id?: string;
  type: 'course' | 'dive' | 'contact';
  name: string;
  email: string;
  phone: string;
  date?: string;
  participants?: number;
  message?: string;
  courseId?: string;
  diveSiteId?: string;
  createdAt?: Date;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

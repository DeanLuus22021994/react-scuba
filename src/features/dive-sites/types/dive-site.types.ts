/**
 * Dive Site Domain Types
 *
 * Extended type definitions for dive site entities and operations.
 */

export type DiveSiteType = 'reef' | 'wreck' | 'wall' | 'drift' | 'cavern' | 'shore' | 'boat';

export type MarineLifeCategory = 'fish' | 'coral' | 'macro' | 'pelagic' | 'turtle' | 'ray' | 'shark' | 'octopus' | 'moray';

export interface DiveSiteConditions {
  siteId: string;
  date: Date;
  visibility: number; // meters
  current: 'none' | 'light' | 'moderate' | 'strong';
  waveHeight: number; // meters
  waterTemp: number; // celsius
  entryDifficulty: 'easy' | 'moderate' | 'difficult';
  suitability: boolean;
  warnings?: string[];
}

export interface DiveLog {
  id: string;
  userId: string;
  siteId: string;
  date: Date;
  entryTime: string;
  exitTime: string;
  maxDepth: number;
  avgDepth: number;
  diveTime: number; // minutes
  waterTemp: number;
  visibility: number;
  rating: number;
  notes?: string;
  marineLifeSeen: string[];
  photos?: string[];
}

export interface DiveSiteReview {
  id: string;
  siteId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: Date;
  conditions: Pick<DiveSiteConditions, 'visibility' | 'current' | 'waterTemp'>;
  marineLifeSeen: string[];
  photos?: string[];
  helpful: number;
  verified: boolean;
}

export interface DiveSiteStatistics {
  siteId: string;
  totalDives: number;
  averageRating: number;
  averageVisibility: number;
  averageDepth: number;
  bestMonths: string[];
  popularMarineLife: MarineLifeCategory[];
  lastUpdated: Date;
}

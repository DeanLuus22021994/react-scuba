/**
 * Gallery Domain Types
 *
 * Extended type definitions for gallery and media management.
 */

export type ImageOrientation = 'landscape' | 'portrait' | 'square';

export type ImageQuality = 'thumbnail' | 'medium' | 'large' | 'original';

export interface ImageMetadata {
  id: string;
  width: number;
  height: number;
  orientation: ImageOrientation;
  aspectRatio: string;
  fileSize: number;
  format: 'jpg' | 'jpeg' | 'png' | 'webp';
  captureDate?: Date;
  camera?: string;
  lens?: string;
  settings?: CameraSettings;
  location?: ImageLocation;
}

export interface CameraSettings {
  aperture: string;
  shutterSpeed: string;
  iso: number;
  focalLength: string;
  flash: boolean;
  underwaterHousing?: string;
  strobes?: string[];
}

export interface ImageLocation {
  diveSite?: string;
  depth?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ImageVariant {
  url: string;
  quality: ImageQuality;
  width: number;
  height: number;
  fileSize: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  imageCount: number;
  category: string;
  date: Date;
  featured: boolean;
  slug: string;
}

export interface ImageComment {
  id: string;
  imageId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  comment: string;
  date: Date;
  likes: number;
}

export interface ImageLike {
  id: string;
  imageId: string;
  userId: string;
  date: Date;
}

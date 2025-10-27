/**
 * Component prop types
 */

import type { ReactNode } from 'react';
import type { Course, DiveSite, GalleryImage, TeamMember } from './common';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface CourseCardProps {
  course: Course;
  onEnrollClick?: (courseId: string) => void;
}

export interface DiveSiteCardProps {
  site: DiveSite;
  onBookClick?: (siteId: string) => void;
}

export interface TeamMemberCardProps {
  member: TeamMember;
}

export interface GalleryImageProps {
  image: GalleryImage;
  onClick?: (imageId: string) => void;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface BookingModalProps extends ModalProps {
  bookingType: 'course' | 'dive';
  preselectedId?: string;
}

export interface ContactModalProps extends ModalProps {
  initialSubject?: string;
}

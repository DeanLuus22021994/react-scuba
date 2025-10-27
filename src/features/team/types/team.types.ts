/**
 * Team Domain Types
 * 
 * Extended type definitions for team members and instructor profiles.
 */

export type InstructorLevel =
  | 'open-water-instructor'
  | 'advanced-instructor'
  | 'master-instructor'
  | 'course-director';

export type CertificationBody = 'PADI' | 'SSI' | 'NAUI' | 'BSAC' | 'CMAS';

export interface InstructorCertification {
  body: CertificationBody;
  level: InstructorLevel;
  number: string;
  issueDate: Date;
  expiryDate?: Date;
  specialties: string[];
}

export interface InstructorStats {
  instructorId: string;
  totalStudents: number;
  totalCourses: number;
  totalDives: number;
  yearsExperience: number;
  averageRating: number;
  reviewCount: number;
  certificationRate: number; // percentage
  specialties: string[];
}

export interface InstructorAvailability {
  instructorId: string;
  date: Date;
  timeSlots: {
    startTime: string;
    endTime: string;
    available: boolean;
    bookedBy?: string;
  }[];
}

export interface InstructorReview {
  id: string;
  instructorId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  rating: number;
  title: string;
  comment: string;
  date: Date;
  verified: boolean;
  helpful: number;
}

export interface InstructorProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string;
  phone: string;
  certifications: InstructorCertification[];
  specialties: string[];
  languages: string[];
  stats: InstructorStats;
  availability: InstructorAvailability[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

/**
 * Course Domain Types
 *
 * Extended type definitions for course-related entities.
 * Supplements the core COURSES constant types.
 */

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional';

export type CourseCertification = 'PADI' | 'SSI' | 'NAUI' | 'BSAC';

export interface CoursePrerequisite {
  certificationLevel: string;
  minimumAge: number;
  medicalClearance: boolean;
  swimTest: boolean;
}

export interface CourseSchedule {
  courseId: string;
  startDate: Date;
  endDate: Date;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  maxStudents: number;
  enrolledStudents: number;
  instructor: string;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  scheduleId: string;
  enrollmentDate: Date;
  status: 'enrolled' | 'in-progress' | 'completed' | 'withdrawn';
  progress: number;
  certificateIssued: boolean;
  certificateNumber?: string;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  type: 'manual' | 'video' | 'quiz' | 'practical';
  url?: string;
  order: number;
  required: boolean;
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
}

/**
 * Booking Domain Types
 *
 * Central type definitions for booking-related entities and operations.
 */

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type BookingType = 'dive' | 'course' | 'package';

export type ExperienceLevel = 'beginner' | 'discover-scuba' | 'open-water' | 'advanced-open-water' | 'rescue-diver' | 'divemaster';

export interface Booking {
  id: string;
  userId: string;
  bookingType: BookingType;
  status: BookingStatus;
  date: Date;
  participants: number;
  totalPrice: number;
  currency: string;
  experienceLevel: ExperienceLevel;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  bookingType: BookingType;
  date: Date;
  participants: number;
  experienceLevel: ExperienceLevel;
  specialRequests?: string;
  source?: string;
}

export interface BookingConfirmation {
  bookingId: string;
  confirmationCode: string;
  booking: Booking;
  emailSent: boolean;
}

export interface BookingAvailability {
  date: Date;
  availableSlots: number;
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
  capacity: number;
  booked: number;
}

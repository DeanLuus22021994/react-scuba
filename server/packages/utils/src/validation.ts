/**
 * Validation utilities for React Scuba
 * @packageDocumentation
 */

/**
 * Validate email address using RFC 5322 standard
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (international format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Accept phone numbers between 7-15 digits (international standard)
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * Validate date is in the future
 */
export function isValidFutureDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();

  // Set to start of day for comparison
  now.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);

  return dateObj >= now;
}

/**
 * Validate age for diving requirements
 */
export function isValidAge(birthDate: Date | string, minAge = 10): boolean {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= minAge;
}

/**
 * Validate dive site depth (in meters)
 */
export function isValidDepth(depth: number, maxDepth = 130): boolean {
  return depth > 0 && depth <= maxDepth;
}

/**
 * Validate course ID format
 */
export function isValidCourseId(courseId: string): boolean {
  // Course IDs should be lowercase with hyphens
  const courseIdRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return courseIdRegex.test(courseId);
}

/**
 * Validate booking type
 */
export function isValidBookingType(
  bookingType: string
): bookingType is 'dive' | 'course' | 'discover' | 'advanced' {
  return ['dive', 'course', 'discover', 'advanced'].includes(bookingType);
}

/**
 * Validate participant count for booking
 */
export function isValidParticipantCount(count: number, maxCount = 20): boolean {
  return Number.isInteger(count) && count >= 1 && count <= maxCount;
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 1000); // Limit length
}

/**
 * Validate and sanitize special requests text
 */
export function validateSpecialRequests(text: string): {
  isValid: boolean;
  sanitized: string;
  errors: string[];
} {
  const errors: string[] = [];

  if (text.length > 2000) {
    errors.push('Special requests must be less than 2000 characters');
  }

  const sanitized = sanitizeString(text);

  return {
    isValid: errors.length === 0,
    sanitized,
    errors,
  };
}

/**
 * Test suite for validation service
 * Tests input validation, business rules, and sanitization
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateBookingInput,
  validateBookingBusinessRules,
  sanitizeBookingInput
} from '../../services/validation.js';

describe('ValidationService', () => {
  describe('validateBookingInput', () => {
    const validInput = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      preferredDate: '2025-12-15T10:00:00Z',
      participants: 2,
      bookingType: 'dive',
      courseId: 'open-water',
      diveSiteId: 'reef-dive-1',
      specialRequests: 'Vegetarian meals please'
    };

    it('should validate correct input successfully', () => {
      const result = validateBookingInput(validInput);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject missing required fields', () => {
      const invalidInput = { name: 'John Doe' }; // Missing other required fields
      const result = validateBookingInput(invalidInput);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'email' })
      );
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'phone' })
      );
    });

    it('should validate email format', () => {
      const invalidEmail = { ...validInput, email: 'not-an-email' };
      const result = validateBookingInput(invalidEmail);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'email',
        message: 'Valid email address is required'
      });
    });

    it('should validate phone number length', () => {
      const shortPhone = { ...validInput, phone: '123' };
      const result = validateBookingInput(shortPhone);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'phone',
        message: 'Phone number must be between 8 and 50 characters'
      });
    });

    it('should validate participants range', () => {
      const tooManyParticipants = { ...validInput, participants: 25 };
      const result = validateBookingInput(tooManyParticipants);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'participants',
        message: 'Participants must be between 1 and 20'
      });
    });

    it('should validate booking type enum', () => {
      const invalidType = { ...validInput, bookingType: 'invalid-type' };
      const result = validateBookingInput(invalidType);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'bookingType',
        message: 'Valid booking type is required'
      });
    });

    it('should validate date format', () => {
      const invalidDate = { ...validInput, preferredDate: 'not-a-date' };
      const result = validateBookingInput(invalidDate);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'preferredDate',
        message: 'Valid date is required'
      });
    });

    it('should validate name length', () => {
      const longName = { ...validInput, name: 'a'.repeat(300) };
      const result = validateBookingInput(longName);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'name',
        message: 'Name must be between 2 and 255 characters'
      });
    });

    it('should validate special requests length', () => {
      const longRequests = { ...validInput, specialRequests: 'a'.repeat(2500) };
      const result = validateBookingInput(longRequests);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'specialRequests',
        message: 'Special requests must not exceed 2000 characters'
      });
    });
  });

  describe('validateBookingBusinessRules', () => {
    const validBooking = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      preferredDate: '2025-12-15T10:00:00Z',
      participants: 2,
      bookingType: 'dive',
      diveSiteId: 'reef-dive-1'
    };

    beforeEach(() => {
      // Mock current date to ensure consistent testing
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-10-29T10:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should pass valid business rules', () => {
      const result = validateBookingBusinessRules(validBooking);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject past dates', () => {
      const pastDate = { ...validBooking, preferredDate: '2025-10-28T10:00:00Z' };
      const result = validateBookingBusinessRules(pastDate);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'preferredDate',
        message: 'Booking date must be in the future'
      });
    });

    it('should reject dates too far in future', () => {
      const farFuture = { ...validBooking, preferredDate: '2027-01-01T10:00:00Z' };
      const result = validateBookingBusinessRules(farFuture);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'preferredDate',
        message: 'Booking date cannot be more than 1 year in advance'
      });
    });

    it('should reject bookings less than 24 hours in advance', () => {
      const tomorrow = new Date('2025-10-30T09:00:00Z'); // Less than 24 hours
      const tooSoon = { ...validBooking, preferredDate: tomorrow.toISOString() };
      const result = validateBookingBusinessRules(tooSoon);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'preferredDate',
        message: 'Bookings must be made at least 24 hours in advance'
      });
    });

    it('should require courseId for course bookings', () => {
      const courseBooking = { ...validBooking, bookingType: 'course', courseId: null };
      const result = validateBookingBusinessRules(courseBooking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'courseId',
        message: 'Course ID is required for course bookings'
      });
    });

    it('should limit participants for course bookings', () => {
      const largeCourse = {
        ...validBooking,
        bookingType: 'course',
        courseId: 'open-water',
        participants: 15
      };
      const result = validateBookingBusinessRules(largeCourse);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'participants',
        message: 'Course bookings are limited to 6 participants maximum'
      });
    });

    it('should validate weekend restrictions for discover bookings', () => {
      // Set date to a Tuesday (weekday)
      vi.setSystemTime(new Date('2025-12-09T10:00:00Z'));

      const weekdayDiscover = {
        ...validBooking,
        preferredDate: '2025-12-10T10:00:00Z', // Wednesday
        bookingType: 'discover'
      };
      const result = validateBookingBusinessRules(weekdayDiscover);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'preferredDate',
        message: 'Discover scuba sessions are only available on weekends'
      });
    });

    it('should allow discover bookings on weekends', () => {
      const weekendDiscover = {
        ...validBooking,
        preferredDate: '2025-12-13T10:00:00Z', // Saturday
        bookingType: 'discover'
      };
      const result = validateBookingBusinessRules(weekendDiscover);

      expect(result.isValid).toBe(true);
    });

    it('should accumulate multiple validation errors', () => {
      const multipleErrors = {
        ...validBooking,
        preferredDate: '2025-10-28T10:00:00Z', // Past date
        bookingType: 'course',
        courseId: null, // Missing course ID
        participants: 15 // Too many for course
      };
      const result = validateBookingBusinessRules(multipleErrors);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  describe('sanitizeBookingInput', () => {
    it('should sanitize string inputs', () => {
      const dirtyInput = {
        name: '  John <script>alert("xss")</script> Doe  ',
        email: ' JOHN@EXAMPLE.COM ',
        phone: '  +1-234-567-890  ',
        specialRequests: 'Please provide <b>vegetarian</b> meals & equipment'
      };

      const result = sanitizeBookingInput(dirtyInput);

      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.phone).toBe('+1-234-567-890');
      expect(result.specialRequests).toBe('Please provide vegetarian meals & equipment');
    });

    it('should preserve safe HTML in special requests', () => {
      const input = {
        name: 'John Doe',
        specialRequests: 'Need <strong>waterproof</strong> case and <em>extra</em> weights'
      };

      const result = sanitizeBookingInput(input);

      expect(result.specialRequests).toBe('Need waterproof case and extra weights');
    });

    it('should handle null and undefined values', () => {
      const input = {
        name: 'John Doe',
        courseId: null,
        diveSiteId: undefined,
        specialRequests: ''
      };

      const result = sanitizeBookingInput(input);

      expect(result.name).toBe('John Doe');
      expect(result.courseId).toBeNull();
      expect(result.diveSiteId).toBeUndefined();
      expect(result.specialRequests).toBe('');
    });

    it('should convert dates to proper format', () => {
      const input = {
        name: 'John Doe',
        preferredDate: '2025-12-15T10:00:00.000Z'
      };

      const result = sanitizeBookingInput(input);

      expect(result.preferredDate).toBeInstanceOf(Date);
      expect(result.preferredDate.toISOString()).toBe('2025-12-15T10:00:00.000Z');
    });

    it('should normalize participant count', () => {
      const input = {
        name: 'John Doe',
        participants: '5' // String number
      };

      const result = sanitizeBookingInput(input);

      expect(result.participants).toBe(5);
      expect(typeof result.participants).toBe('number');
    });

    it('should handle XSS attempts in various fields', () => {
      const maliciousInput = {
        name: '<img src=x onerror=alert(1)>John',
        email: 'test+<script>alert(1)</script>@example.com',
        phone: '123<iframe>456',
        specialRequests: 'javascript:alert("xss")'
      };

      const result = sanitizeBookingInput(maliciousInput);

      expect(result.name).not.toContain('<img');
      expect(result.name).not.toContain('onerror');
      expect(result.email).not.toContain('<script>');
      expect(result.phone).not.toContain('<iframe>');
      expect(result.specialRequests).not.toContain('javascript:');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete validation workflow', () => {
      const rawInput = {
        name: '  John Doe  ',
        email: ' JOHN@EXAMPLE.COM ',
        phone: '+1234567890',
        preferredDate: '2025-12-15T10:00:00Z',
        participants: '2',
        bookingType: 'dive',
        diveSiteId: 'reef-dive-1',
        specialRequests: 'Need <script>alert("xss")</script> vegetarian meals'
      };

      // Step 1: Sanitize input
      const sanitized = sanitizeBookingInput(rawInput);

      // Step 2: Validate input format
      const inputValidation = validateBookingInput(sanitized);
      expect(inputValidation.isValid).toBe(true);

      // Step 3: Validate business rules
      const businessValidation = validateBookingBusinessRules(sanitized);
      expect(businessValidation.isValid).toBe(true);

      // Verify sanitization worked
      expect(sanitized.name).toBe('John Doe');
      expect(sanitized.email).toBe('john@example.com');
      expect(sanitized.specialRequests).not.toContain('<script>');
    });

    it('should fail validation pipeline on any step', () => {
      const invalidInput = {
        name: '',
        email: 'invalid-email',
        preferredDate: '2025-10-28T10:00:00Z', // Past date
        participants: 0,
        bookingType: 'course'
      };

      const sanitized = sanitizeBookingInput(invalidInput);
      const inputValidation = validateBookingInput(sanitized);
      const businessValidation = validateBookingBusinessRules(sanitized);

      expect(inputValidation.isValid).toBe(false);
      expect(businessValidation.isValid).toBe(false);
    });
  });
});

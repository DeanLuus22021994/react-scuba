/**
 * Booking validation service
 * Handles all validation logic for booking operations
 */
import { body, query, validationResult } from 'express-validator';

/**
 * Validate booking input format and basic constraints
 * @param {object} input - Raw booking input data
 * @returns {object} Validation result with success flag and errors
 */
export const validateBookingInput = (input) => {
  const errors = [];

  // Required fields validation
  if (!input || typeof input !== 'object') {
    return {
      isValid: false,
      errors: [{ field: 'root', message: 'Invalid input data' }],
    };
  }

  if (
    !input.name ||
    typeof input.name !== 'string' ||
    input.name.trim().length < 2 ||
    input.name.trim().length > 255
  ) {
    errors.push({
      field: 'name',
      message: 'Name must be between 2 and 255 characters',
    });
  }

  if (
    !input.email ||
    typeof input.email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
  ) {
    errors.push({ field: 'email', message: 'Valid email address is required' });
  }

  if (
    !input.phone ||
    typeof input.phone !== 'string' ||
    input.phone.trim().length < 8 ||
    input.phone.trim().length > 50
  ) {
    errors.push({
      field: 'phone',
      message: 'Phone number must be between 8 and 50 characters',
    });
  }

  if (!input.preferredDate || isNaN(Date.parse(input.preferredDate))) {
    errors.push({ field: 'preferredDate', message: 'Valid date is required' });
  }

  if (
    !input.participants ||
    typeof input.participants !== 'number' ||
    input.participants < 1 ||
    input.participants > 20
  ) {
    errors.push({
      field: 'participants',
      message: 'Participants must be between 1 and 20',
    });
  }

  if (
    !input.bookingType ||
    !['dive', 'course', 'discover', 'advanced'].includes(input.bookingType)
  ) {
    errors.push({
      field: 'bookingType',
      message: 'Valid booking type is required',
    });
  }

  if (
    input.specialRequests &&
    typeof input.specialRequests === 'string' &&
    input.specialRequests.length > 2000
  ) {
    errors.push({
      field: 'specialRequests',
      message: 'Special requests must not exceed 2000 characters',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize booking input data
 * @param {object} input - Raw booking input data
 * @returns {object} Sanitized booking data
 */
export const sanitizeBookingInput = (input) => {
  if (!input || typeof input !== 'object') {
    return {};
  }

  // Helper function to strip HTML tags and malicious content
  const stripHTML = (str) => {
    if (!str) return '';
    return (
      String(str)
        // Remove script tags and their content completely
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove all other HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove javascript: protocols
        .replace(/javascript:/gi, '')
    );
  };

  const sanitized = {
    ...input,
    name: input.name ? stripHTML(String(input.name)).trim().replace(/\s+/g, ' ') : '',
    email: input.email ? stripHTML(String(input.email)).trim().toLowerCase() : '',
    phone: input.phone ? stripHTML(String(input.phone)).trim() : '',
    specialRequests: input.specialRequests
      ? stripHTML(String(input.specialRequests)).trim()
      : input.specialRequests === null || input.specialRequests === undefined
        ? input.specialRequests
        : '',
    participants: input.participants ? Math.floor(Number(input.participants)) : 1,
  }; // Convert date string to Date object if needed
  if (input.preferredDate) {
    if (typeof input.preferredDate === 'string') {
      sanitized.preferredDate = new Date(input.preferredDate);
    } else if (input.preferredDate instanceof Date) {
      sanitized.preferredDate = input.preferredDate;
    }
  }

  return sanitized;
};

export const bookingValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters')
    .escape(),
  body('email').isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('phone')
    .trim()
    .isLength({ min: 8, max: 50 })
    .withMessage('Phone number must be between 8 and 50 characters'),
  body('preferredDate').isISO8601().withMessage('Valid ISO date is required').toDate(),
  body('participants')
    .isInt({ min: 1, max: 20 })
    .withMessage('Participants must be between 1 and 20'),
  body('bookingType')
    .isIn(['dive', 'course', 'discover', 'advanced'])
    .withMessage('Valid booking type is required'),
  body('courseId')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Course ID must not exceed 255 characters'),
  body('diveSiteId')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Dive site ID must not exceed 255 characters'),
  body('specialRequests')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Special requests must not exceed 2000 characters'),
];

export const bookingStatusValidationRules = [
  body('status')
    .isIn(['pending', 'confirmed', 'cancelled'])
    .withMessage('Status must be pending, confirmed, or cancelled'),
];

export const bookingQueryValidationRules = [
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled'])
    .withMessage('Status filter must be pending, confirmed, or cancelled'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
];

/**
 * Middleware to handle validation errors
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Validate booking data for business rules
 * @param {object} bookingData - Booking data to validate
 * @returns {object} Validation result with success flag and errors
 */
export const validateBookingBusinessRules = (bookingData) => {
  const errors = [];

  if (!bookingData || !bookingData.preferredDate) {
    return {
      isValid: false,
      errors: [{ field: 'preferredDate', message: 'Preferred date is required' }],
    };
  }

  const preferredDate = new Date(bookingData.preferredDate);
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if preferred date is in the future
  if (preferredDate < today) {
    errors.push({
      field: 'preferredDate',
      message: 'Booking date must be in the future',
    });
  }

  // Check 24-hour advance booking requirement
  const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  if (preferredDate < twentyFourHoursFromNow && preferredDate >= today) {
    errors.push({
      field: 'preferredDate',
      message: 'Bookings must be made at least 24 hours in advance',
    });
  }

  // Check if preferred date is not too far in advance (1 year limit)
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  if (preferredDate > oneYearFromNow) {
    errors.push({
      field: 'preferredDate',
      message: 'Booking date cannot be more than 1 year in advance',
    });
  }

  // Validate course/dive site requirements based on booking type
  if (bookingData.bookingType === 'course' && !bookingData.courseId) {
    errors.push({
      field: 'courseId',
      message: 'Course ID is required for course bookings',
    });
  }

  if (
    ['dive', 'discover', 'advanced'].includes(bookingData.bookingType) &&
    !bookingData.diveSiteId
  ) {
    errors.push({
      field: 'diveSiteId',
      message: 'Dive site ID is required for dive bookings',
    });
  }

  // Validate participant limits for course bookings
  if (bookingData.bookingType === 'course' && bookingData.participants > 6) {
    errors.push({
      field: 'participants',
      message: 'Course bookings are limited to 6 participants maximum',
    });
  }

  // Validate weekend restrictions for discover scuba bookings
  if (bookingData.bookingType === 'discover') {
    const dayOfWeek = preferredDate.getDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      errors.push({
        field: 'preferredDate',
        message: 'Discover scuba sessions are only available on weekends',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

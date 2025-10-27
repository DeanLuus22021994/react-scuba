/**
 * Services barrel export
 * Centralized exports for all API and external service integrations
 */

export {
  checkCalendarAvailability,
  createCalendarBooking,
  default as api,
  submitContactForm as sendContactMessage,
} from './api';

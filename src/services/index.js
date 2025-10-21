/**
 * Services barrel export
 * Centralized exports for all API and external service integrations
 */

export {
  default as api,
  checkCalendarAvailability,
  createCalendarBooking,
  submitContactForm as sendContactMessage,
} from './api';

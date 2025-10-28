/**
 * Services barrel export
 * Centralized exports for all API and external service integrations
 */

export {
  checkCalendarAvailability,
  createBooking,
  createCalendarBooking,
  getExchangeRates,
  submitBookingInquiry,
  submitContactForm as sendContactMessage,
} from './api';

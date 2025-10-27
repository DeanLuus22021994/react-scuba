import axios from 'axios';
import logger from '../utils/logger';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3001/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle errors globally
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    logger.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

// API methods

/**
 * Submit contact form
 * @param {Object} data - Contact form data
 * @returns {Promise}
 */
export const submitContactForm = async (data) => {
  try {
    const response = await api.post('/contact', data);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

/**
 * Submit booking inquiry
 * @param {Object} data - Booking inquiry data
 * @returns {Promise}
 */
export const submitBookingInquiry = async (data) => {
  try {
    const response = await api.post('/booking/inquiry', data);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

/**
 * Check calendar availability
 * @param {string} date - Date to check (ISO format)
 * @param {string} courseId - Course or dive type ID
 * @returns {Promise}
 */
export const checkCalendarAvailability = async (date, courseId) => {
  try {
    const response = await api.get('/calendar/availability', {
      params: { date, courseId },
    });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

/**
 * Create calendar booking
 * @param {Object} bookingData - Booking details
 * @returns {Promise}
 */
export const createCalendarBooking = async (bookingData) => {
  try {
    const response = await api.post('/calendar/booking', bookingData);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

/**
 * Subscribe to newsletter
 * @param {string} email - Email address
 * @returns {Promise}
 */
export const subscribeNewsletter = async (email) => {
  try {
    const response = await api.post('/newsletter/subscribe', { email });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

/**
 * Get exchange rates
 * @returns {Promise}
 */
export const getExchangeRates = async () => {
  try {
    const response = await api.get('/exchange-rates');
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

/**
 * Create a new booking
 * @param {Object} bookingData - Booking details
 * @returns {Promise}
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return { success: true, ...response, bookingType: bookingData.bookingType, participants: bookingData.participants };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create booking');
  }
};

/**
 * Get booking by ID
 * @param {string|number} bookingId - Booking ID
 * @returns {Promise}
 */
export const getBooking = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    return { success: true, data: response };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get booking');
  }
};

/**
 * Get availability for date range
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @returns {Promise}
 */
export const getAvailability = async (startDate, endDate) => {
  try {
    const response = await api.get('/availability', {
      params: { startDate, endDate },
    });
    return { success: true, data: response };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get availability');
  }
};

/**
 * Get availability for specific date
 * @param {string} date - Date (ISO format)
 * @returns {Promise}
 */
export const getDateAvailability = async (date) => {
  try {
    const response = await api.get(`/availability/date/${date}`);
    return { success: true, data: response };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get date availability');
  }
};

export default api;

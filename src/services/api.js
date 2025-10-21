import axios from 'axios';
import logger from '../utils/logger';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:5000/api',
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

export default api;

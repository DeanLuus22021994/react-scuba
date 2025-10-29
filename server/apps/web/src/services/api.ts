import axios, { type AxiosError } from 'axios';

// Simple logger interface
interface SimpleLogger {
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}

const logger: SimpleLogger = {
  info: (message: string, ...args: unknown[]) => console.info(message, ...args),
  warn: (message: string, ...args: unknown[]) => console.warn(message, ...args),
  error: (message: string, ...args: unknown[]) => console.error(message, ...args),
};

// Types for API responses
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string | object;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

interface BookingInquiryData {
  name: string;
  email: string;
  phone?: string;
  preferredDate: string;
  participants: number;
  bookingType: string;
  specialRequests?: string;
}

interface BookingData {
  name: string;
  email: string;
  phone: string;
  preferredDate: Date | string;
  participants: number;
  bookingType: 'dive' | 'course' | 'discover' | 'advanced';
  courseId?: string;
  diveSiteId?: string;
  specialRequests?: string;
}

interface AvailabilityData {
  date: string;
  available: boolean;
  slots?: number;
  bookings?: number;
}

interface ExchangeRateData {
  rates: Record<string, number>;
  lastUpdated: string;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env['VITE_API_ENDPOINT'] || 'http://localhost:3001/api',
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
 */
export const submitContactForm = async (data: ContactFormData): Promise<ApiResponse> => {
  try {
    const response = await api.post('/contact', data);
    return { success: true, data: response };
  } catch (error) {
    const axiosError = error as AxiosError;
    return { success: false, error: (axiosError.response?.data as string | object) || axiosError.message };
  }
};

/**
 * Submit booking inquiry
 */
export const submitBookingInquiry = async (data: BookingInquiryData): Promise<ApiResponse> => {
  try {
    const response = await api.post('/booking/inquiry', data);
    return { success: true, data: response };
  } catch (error) {
    const axiosError = error as AxiosError;
    return { success: false, error: (axiosError.response?.data as string | object) || axiosError.message };
  }
};

/**
 * Check calendar availability
 */
export const checkCalendarAvailability = async (date: string, courseId: string): Promise<ApiResponse<AvailabilityData>> => {
  try {
    const response = await api.get('/calendar/availability', {
      params: { date, courseId },
    });
    return { success: true, data: response as unknown as AvailabilityData };
  } catch (error) {
    const axiosError = error as AxiosError;
    return { success: false, error: (axiosError.response?.data as string) || axiosError.message };
  }
};

/**
 * Create calendar booking
 */
export const createCalendarBooking = async (bookingData: BookingData): Promise<ApiResponse> => {
  try {
    const response = await api.post('/calendar/booking', bookingData);
    return { success: true, data: response };
  } catch (error) {
    const axiosError = error as AxiosError;
    return { success: false, error: (axiosError.response?.data as string | object) || axiosError.message };
  }
};

/**
 * Subscribe to newsletter
 */
export const subscribeNewsletter = async (email: string): Promise<ApiResponse> => {
  try {
    const response = await api.post('/newsletter/subscribe', { email });
    return { success: true, data: response };
  } catch (error) {
    const axiosError = error as AxiosError;
    return { success: false, error: (axiosError.response?.data as string | object) || axiosError.message };
  }
};

/**
 * Get exchange rates
 */
export const getExchangeRates = async (): Promise<ApiResponse<ExchangeRateData>> => {
  try {
    const response = await api.get('/exchange-rates');
    return { success: true, data: response as unknown as ExchangeRateData };
  } catch (error) {
    const axiosError = error as AxiosError;
    return { success: false, error: (axiosError.response?.data as string | object) || axiosError.message };
  }
};

/**
 * Create a new booking
 */
export const createBooking = async (bookingData: BookingData): Promise<ApiResponse> => {
  try {
    const response = await api.post('/bookings', bookingData);
    return {
      success: true,
      data: {
        ...response,
        bookingType: bookingData.bookingType,
        participants: bookingData.participants,
      },
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error((axiosError.response?.data as any)?.error || axiosError.message || 'Failed to create booking');
  }
};

/**
 * Get booking by ID
 */
export const getBooking = async (bookingId: string | number): Promise<ApiResponse> => {
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    return { success: true, data: response };
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error((axiosError.response?.data as any)?.error || axiosError.message || 'Failed to get booking');
  }
};

/**
 * Get availability for date range
 */
export const getAvailability = async (startDate: string, endDate: string): Promise<ApiResponse<AvailabilityData[]>> => {
  try {
    const response = await api.get('/availability', {
      params: { startDate, endDate },
    });
    return { success: true, data: response as unknown as AvailabilityData[] };
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error((axiosError.response?.data as any)?.error || axiosError.message || 'Failed to get availability');
  }
};

/**
 * Get availability for specific date
 */
export const getDateAvailability = async (date: string): Promise<ApiResponse<AvailabilityData>> => {
  try {
    const response = await api.get(`/availability/date/${date}`);
    return { success: true, data: response as unknown as AvailabilityData };
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error((axiosError.response?.data as any)?.error || axiosError.message || 'Failed to get date availability');
  }
};

export default api;

import { z } from 'zod';
import logger from './logger';

/**
 * Environment variable schema definition
 * Defines all expected environment variables and their validation rules
 */
const envSchema = z.object({
  // Analytics
  VITE_GTM_ID: z.string().optional(),
  VITE_GA4_ID: z.string().optional(),

  // Contact Information
  VITE_PHONE_NUMBER: z.string().optional().default('+230 2634468'),
  VITE_WHATSAPP_NUMBER: z.string().optional().default('+230 5255 2732'),
  VITE_EMAIL: z.string().email().or(z.literal('')).optional().default('info@osdiving.com'),

  // API Configuration
  VITE_API_ENDPOINT: z.string().url().or(z.literal('')).optional(),
  VITE_EXCHANGE_RATE_API_KEY: z.string().optional(),

  // ReCAPTCHA
  VITE_RECAPTCHA_SITE_KEY: z.string().optional(),

  // Google Calendar API (if needed)
  VITE_GOOGLE_CALENDAR_API_KEY: z.string().optional(),
  VITE_GOOGLE_CALENDAR_ID: z.string().optional(),
});

/**
 * Validates environment variables against the schema
 * Logs warnings for missing optional variables
 * @returns {boolean} True if validation passes
 */
export const validateEnvVars = () => {
  try {
    const result = envSchema.safeParse(import.meta.env);

    if (!result.success) {
      logger.error('Environment variable validation failed:', result.error.format());
      return false;
    }

    // Log warnings for missing optional but recommended variables
    const env = result.data;

    if (!env.VITE_GTM_ID && !env.VITE_GA4_ID) {
      logger.warn('No analytics tracking configured (GTM_ID or GA4_ID)');
    }

    if (!env.VITE_RECAPTCHA_SITE_KEY) {
      logger.warn('ReCAPTCHA is not configured - forms may be vulnerable to spam');
    }

    if (!env.VITE_API_ENDPOINT) {
      logger.warn('API endpoint not configured - using default');
    }

    logger.info('Environment variables validated successfully');
    return true;
  } catch (error) {
    logger.error('Environment variable validation error:', error);
    return false;
  }
};

/**
 * Gets a validated environment variable
 * @param {string} key - The environment variable key
 * @param {string} defaultValue - Optional default value
 * @returns {string|undefined} The environment variable value
 */
export const getEnvVar = (key, defaultValue = undefined) => {
  const value = import.meta.env[key];
  return value || defaultValue;
};

/**
 * Checks if running in production mode
 * @returns {boolean}
 */
export const isProduction = () => {
  return import.meta.env.MODE === 'production';
};

/**
 * Checks if running in development mode
 * @returns {boolean}
 */
export const isDevelopment = () => {
  return import.meta.env.MODE === 'development';
};

/**
 * Gets the API URL from environment variables
 * @returns {string}
 */
export const getApiUrl = () => {
  return getEnvVar('VITE_API_ENDPOINT', 'http://localhost:5000/api');
};

/**
 * Gets the calendar email from environment variables
 * @returns {string}
 */
export const getCalendarEmail = () => {
  return getEnvVar('VITE_GOOGLE_CALENDAR_ID', '');
};

/**
 * Gets the calendar API key from environment variables
 * @returns {string}
 */
export const getCalendarApiKey = () => {
  return getEnvVar('VITE_GOOGLE_CALENDAR_API_KEY', '');
};

/**
 * Formatting utilities for React Scuba
 * @packageDocumentation
 */

export type Currency = 'USD' | 'EUR' | 'GBP' | 'AUD';

/**
 * Format price with currency symbol and proper localization
 */
export function formatPrice(
  amount: number,
  currency: Currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date with proper localization
 */
export function formatDate(
  date: Date | string,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format duration from minutes to human readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Format based on length
  if (digits.length === 10) {
    // US format: (555) 123-4567
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    // US format with country code: +1 (555) 123-4567
    return digits.replace(/1(\d{3})(\d{3})(\d{4})/, '+1 ($1) $2-$3');
  }

  // International format with spaces every 3 digits
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ');
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Calculate price with exchange rate
 */
export function calculatePrice(
  basePrice: number,
  exchangeRate: number,
  currency: Currency
): { amount: number; formatted: string } {
  const convertedAmount = basePrice * exchangeRate;
  return {
    amount: convertedAmount,
    formatted: formatPrice(convertedAmount, currency),
  };
}

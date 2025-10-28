// Currency utilities and conversion

import logger from './logger';

export interface Currency {
  symbol: string;
  name: string;
  code: string;
}

export interface ExchangeRates {
  MUR: number;
  USD: number;
  EUR: number;
  GBP: number;
}

export const CURRENCIES: Record<string, Currency> = {
  MUR: { symbol: 'Rs', name: 'Mauritian Rupee', code: 'MUR' },
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
};

// Base exchange rates (MUR as base currency)
// These should be fetched from an API in production
export const DEFAULT_EXCHANGE_RATES: ExchangeRates = {
  MUR: 1,
  USD: 0.022, // 1 MUR = 0.022 USD
  EUR: 0.02, // 1 MUR = 0.020 EUR
  GBP: 0.017, // 1 MUR = 0.017 GBP
};

export const convertCurrency = (
  amount: number,
  fromCurrency: keyof ExchangeRates,
  toCurrency: keyof ExchangeRates,
  rates: ExchangeRates = DEFAULT_EXCHANGE_RATES
): number => {
  // Convert to MUR first (base currency)
  const amountInMUR = amount / rates[fromCurrency];
  // Then convert to target currency
  const convertedAmount = amountInMUR * rates[toCurrency];
  return convertedAmount;
};

export const formatCurrency = (amount: number, currencyCode: string, locale = 'en-MU'): string => {
  const currency = CURRENCIES[currencyCode];

  if (!currency) {
    return `${amount.toFixed(2)}`;
  }

  // Format with proper decimal places
  const formattedAmount = amount.toFixed(2);

  // For MUR, show as "Rs 1,500.00"
  // For others, show as "$1,500.00"
  if (currencyCode === 'MUR') {
    return `${currency.symbol} ${Number.parseFloat(formattedAmount).toLocaleString(locale)}`;
  }

  return `${currency.symbol}${Number.parseFloat(formattedAmount).toLocaleString(locale)}`;
};

export const getCurrencySymbol = (currencyCode: string): string => {
  return CURRENCIES[currencyCode]?.symbol || currencyCode;
};

export const getCurrencyName = (currencyCode: string): string => {
  return CURRENCIES[currencyCode]?.name || currencyCode;
};

interface ExchangeRateResponse {
  result: string;
  conversion_rates: Record<string, number>;
}

// Fetch live exchange rates from API
export const fetchExchangeRates = async (): Promise<ExchangeRates> => {
  const apiKey = import.meta.env['VITE_EXCHANGE_RATE_API_KEY'];

  if (!apiKey) {
    logger.warn('Exchange rate API key not found, using default rates');
    return DEFAULT_EXCHANGE_RATES;
  }

  try {
    // Example using exchangerate-api.com (free tier available)
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/MUR`);
    const data = await response.json() as ExchangeRateResponse;

    if (data.result === 'success') {
      return {
        MUR: 1,
        USD: data.conversion_rates['USD'] || DEFAULT_EXCHANGE_RATES.USD,
        EUR: data.conversion_rates['EUR'] || DEFAULT_EXCHANGE_RATES.EUR,
        GBP: data.conversion_rates['GBP'] || DEFAULT_EXCHANGE_RATES.GBP,
      };
    }

    return DEFAULT_EXCHANGE_RATES;
  } catch (error) {
    logger.error('Error fetching exchange rates:', {
      error: error instanceof Error ? error.message : String(error)
    });
    return DEFAULT_EXCHANGE_RATES;
  }
};

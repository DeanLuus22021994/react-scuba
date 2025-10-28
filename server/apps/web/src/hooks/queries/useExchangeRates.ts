/**
 * Exchange rates query using TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import { getExchangeRates } from '../../services/api';
import type { ExchangeRates } from '../../types';

const EXCHANGE_RATES_KEY = ['exchangeRates'] as const;

// Default fallback rates
const DEFAULT_RATES: ExchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  AUD: 1.52,
};

export function useExchangeRates() {
  return useQuery({
    queryKey: EXCHANGE_RATES_KEY,
    queryFn: async (): Promise<ExchangeRates> => {
      const result = await getExchangeRates();

      if (result.success && result.data?.rates) {
        return {
          USD: result.data.rates['USD'] || 1,
          EUR: result.data.rates['EUR'] || 0.85,
          GBP: result.data.rates['GBP'] || 0.73,
          AUD: result.data.rates['AUD'] || 1.35,
          ...result.data.rates
        } as ExchangeRates;
      }

      // Fallback to default rates if API fails
      return DEFAULT_RATES;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
    placeholderData: DEFAULT_RATES, // Show default rates immediately
    retry: 2,
  });
}

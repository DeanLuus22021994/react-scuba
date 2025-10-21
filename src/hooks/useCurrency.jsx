import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import { getExchangeRates } from '../services/api';
import { trackCurrencyChange } from '../utils/analytics';
import {
  CURRENCIES,
  DEFAULT_EXCHANGE_RATES,
  convertCurrency,
  formatCurrency,
} from '../utils/currency';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    // Get from localStorage or default to MUR
    return localStorage.getItem('selectedCurrency') || 'MUR';
  });

  const [exchangeRates, setExchangeRates] = useState(DEFAULT_EXCHANGE_RATES);
  const [loading, setLoading] = useState(false);

  // Fetch exchange rates on mount
  useEffect(() => {
    let isMounted = true;

    const fetchRates = async () => {
      if (!isMounted) return;
      setLoading(true);

      try {
        const result = await getExchangeRates();

        if (isMounted && result.success && result.data.rates) {
          setExchangeRates(result.data.rates);
        }
      } catch (_error) {
        // Silently fail and use default rates
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRates();

    // Refresh rates every hour
    const interval = setInterval(fetchRates, 3600000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const changeCurrency = (newCurrency) => {
    const oldCurrency = currency;
    setCurrency(newCurrency);
    localStorage.setItem('selectedCurrency', newCurrency);

    // Track currency change
    trackCurrencyChange(oldCurrency, newCurrency);
  };

  const convert = (amount, fromCurrency = 'MUR', toCurrency = currency) => {
    return convertCurrency(amount, fromCurrency, toCurrency, exchangeRates);
  };

  const format = (amount, currencyCode = currency) => {
    return formatCurrency(amount, currencyCode);
  };

  const value = {
    currency,
    setCurrency: changeCurrency,
    exchangeRates,
    convert,
    format,
    loading,
    availableCurrencies: Object.keys(CURRENCIES),
    currencyInfo: CURRENCIES[currency],
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }

  return context;
};

CurrencyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default useCurrency;

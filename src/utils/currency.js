// Currency utilities and conversion

export const CURRENCIES = {
  MUR: { symbol: "Rs", name: "Mauritian Rupee", code: "MUR" },
  USD: { symbol: "$", name: "US Dollar", code: "USD" },
  EUR: { symbol: "€", name: "Euro", code: "EUR" },
  GBP: { symbol: "£", name: "British Pound", code: "GBP" },
};

// Base exchange rates (MUR as base currency)
// These should be fetched from an API in production
export const DEFAULT_EXCHANGE_RATES = {
  MUR: 1,
  USD: 0.022, // 1 MUR = 0.022 USD
  EUR: 0.02, // 1 MUR = 0.020 EUR
  GBP: 0.017, // 1 MUR = 0.017 GBP
};

export const convertCurrency = (
  amount,
  fromCurrency,
  toCurrency,
  rates = DEFAULT_EXCHANGE_RATES
) => {
  // Convert to MUR first (base currency)
  const amountInMUR = amount / rates[fromCurrency];
  // Then convert to target currency
  const convertedAmount = amountInMUR * rates[toCurrency];
  return convertedAmount;
};

export const formatCurrency = (amount, currencyCode, locale = "en-MU") => {
  const currency = CURRENCIES[currencyCode];

  if (!currency) {
    return `${amount.toFixed(2)}`;
  }

  // Format with proper decimal places
  const formattedAmount = amount.toFixed(2);

  // For MUR, show as "Rs 1,500.00"
  // For others, show as "$1,500.00"
  if (currencyCode === "MUR") {
    return `${currency.symbol} ${parseFloat(formattedAmount).toLocaleString(
      locale
    )}`;
  }

  return `${currency.symbol}${parseFloat(formattedAmount).toLocaleString(
    locale
  )}`;
};

export const getCurrencySymbol = (currencyCode) => {
  return CURRENCIES[currencyCode]?.symbol || currencyCode;
};

export const getCurrencyName = (currencyCode) => {
  return CURRENCIES[currencyCode]?.name || currencyCode;
};

// Fetch live exchange rates from API
export const fetchExchangeRates = async () => {
  const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

  if (!apiKey) {
    console.warn("Exchange rate API key not found, using default rates");
    return DEFAULT_EXCHANGE_RATES;
  }

  try {
    // Example using exchangerate-api.com (free tier available)
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/MUR`
    );
    const data = await response.json();

    if (data.result === "success") {
      return {
        MUR: 1,
        USD: data.conversion_rates.USD,
        EUR: data.conversion_rates.EUR,
        GBP: data.conversion_rates.GBP,
      };
    }

    return DEFAULT_EXCHANGE_RATES;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return DEFAULT_EXCHANGE_RATES;
  }
};

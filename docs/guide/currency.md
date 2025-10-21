# Currency

<div class="feature-card">

Multi-currency support with real-time exchange rates, automatic conversion, and seamless user experience across different currencies.

</div>

## Overview

React Scuba implements comprehensive multi-currency support that allows users to view prices and make bookings in their preferred currency. The system includes real-time exchange rate updates, automatic conversion, and persistent currency preferences.

## Currency System Architecture

### Supported Currencies

The application supports four major currencies:

#### Mauritian Rupee (MUR) - Base Currency

- **Symbol**: Rs
- **Format**: Rs 1,500.00
- **Role**: Primary currency for all internal calculations

#### US Dollar (USD)

- **Symbol**: $
- **Format**: $1,500.00
- **Exchange Rate**: Dynamically fetched from API

#### Euro (EUR)

- **Symbol**: €
- **Format**: €1,500.00
- **Exchange Rate**: Dynamically fetched from API

#### British Pound (GBP)

- **Symbol**: £
- **Format**: £1,500.00
- **Exchange Rate**: Dynamically fetched from API

### Exchange Rate Management

#### Real-time Rate Updates

Exchange rates are fetched automatically:

```javascript
// Fetch rates on component mount
useEffect(() => {
  const fetchRates = async () => {
    try {
      const result = await getExchangeRates();
      if (result.success) {
        setExchangeRates(result.data.rates);
      }
    } catch (error) {
      // Fallback to default rates
    }
  };

  fetchRates();
  // Refresh every hour
  const interval = setInterval(fetchRates, 3600000);
}, []);
```

#### Fallback Rates

Default exchange rates ensure functionality even when API is unavailable:

```javascript
const DEFAULT_EXCHANGE_RATES = {
  MUR: 1,
  USD: 0.022, // 1 MUR = 0.022 USD
  EUR: 0.02, // 1 MUR = 0.020 EUR
  GBP: 0.017, // 1 MUR = 0.017 GBP
};
```

#### API Integration

Exchange rates fetched from reliable external APIs:

```javascript
// Using exchangerate-api.com
const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/MUR`);
const data = await response.json();

if (data.result === 'success') {
  return {
    MUR: 1,
    USD: data.conversion_rates.USD,
    EUR: data.conversion_rates.EUR,
    GBP: data.conversion_rates.GBP,
  };
}
```

## Currency Context & Hooks

### CurrencyProvider

Global currency state management:

```jsx
const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    // Persist user preference
    return localStorage.getItem('selectedCurrency') || 'MUR';
  });

  const [exchangeRates, setExchangeRates] = useState(DEFAULT_EXCHANGE_RATES);

  // ... rate fetching logic

  const changeCurrency = (newCurrency) => {
    const oldCurrency = currency;
    setCurrency(newCurrency);
    localStorage.setItem('selectedCurrency', newCurrency);

    // Track currency change for analytics
    trackCurrencyChange(oldCurrency, newCurrency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: changeCurrency,
        exchangeRates,
        convert,
        format,
        loading,
        availableCurrencies: Object.keys(CURRENCIES),
        currencyInfo: CURRENCIES[currency],
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
```

### useCurrency Hook

Access currency functionality throughout the app:

```jsx
const useCurrency = () => {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }

  return context;
};

// Usage in components
const { currency, setCurrency, convert, format } = useCurrency();
```

## Currency Conversion

### Conversion Logic

Bidirectional currency conversion using MUR as base:

```javascript
const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
  // Convert to MUR first (base currency)
  const amountInMUR = amount / rates[fromCurrency];
  // Then convert to target currency
  const convertedAmount = amountInMUR * rates[toCurrency];
  return convertedAmount;
};
```

### Usage Examples

```jsx
const { convert, format } = useCurrency();

// Convert 1000 MUR to USD
const usdAmount = convert(1000, 'MUR', 'USD');

// Format amount in current currency
const formatted = format(1500.5); // "$1,500.50" or "Rs 1,500.50"
```

## Currency Formatting

### Localized Formatting

Proper currency formatting for each locale:

```javascript
const formatCurrency = (amount, currencyCode, locale = 'en-MU') => {
  const currency = CURRENCIES[currencyCode];

  if (!currency) {
    return `${amount.toFixed(2)}`;
  }

  const formattedAmount = amount.toFixed(2);

  // MUR format: "Rs 1,500.00"
  if (currencyCode === 'MUR') {
    return `${currency.symbol} ${parseFloat(formattedAmount).toLocaleString(locale)}`;
  }

  // Other currencies: "$1,500.00"
  return `${currency.symbol}${parseFloat(formattedAmount).toLocaleString(locale)}`;
};
```

### Formatting Options

- **MUR**: Rs 1,500.00 (Mauritian Rupee)
- **USD**: $1,500.00 (US Dollar)
- **EUR**: €1,500.00 (Euro)
- **GBP**: £1,500.00 (British Pound)

## Currency Selector Component

### Component Implementation

Dropdown selector with smooth animations:

```jsx
const CurrencySelector = ({ className = '' }) => {
  const { currency, setCurrency, availableCurrencies } = useCurrency();

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <Menu.Button className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-ocean-600 transition-colors">
        <span>{CURRENCIES[currency].symbol}</span>
        <span>{currency}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {availableCurrencies.map((code) => (
          <Menu.Item key={code}>
            <button onClick={() => setCurrency(code)}>
              <span>{CURRENCIES[code].symbol}</span>
              <span>{code}</span>
              {currency === code && <span>✓</span>}
            </button>
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};
```

### Visual Design

- **Compact display**: Symbol + code (e.g., "Rs MUR")
- **Smooth transitions**: Headless UI animations
- **Active state**: Checkmark for selected currency
- **Hover states**: Ocean color theme integration

## User Experience

### Persistent Preferences

Currency choice persists across sessions:

```javascript
// Save to localStorage
localStorage.setItem('selectedCurrency', newCurrency);

// Restore on app load
const savedCurrency = localStorage.getItem('selectedCurrency') || 'MUR';
```

### Seamless Switching

Instant currency conversion without page reload:

```jsx
const handleCurrencyChange = (newCurrency) => {
  setCurrency(newCurrency);
  // All prices update immediately via context
  // Analytics tracking included
};
```

### Loading States

Graceful handling during rate updates:

```jsx
const { loading } = useCurrency();

if (loading) {
  return <div className="animate-pulse">Updating rates...</div>;
}
```

## Analytics Integration

### Currency Change Tracking

Track user currency preferences:

```javascript
const changeCurrency = (newCurrency) => {
  const oldCurrency = currency;
  setCurrency(newCurrency);

  // Analytics event
  trackCurrencyChange(oldCurrency, newCurrency);
};
```

### Conversion Events

Track pricing interactions:

```javascript
// Track course inquiries with currency context
trackCourseInquiry(courseName, coursePrice, currency);

// Track booking requests
trackBookingRequest(bookingType, value, currency);
```

## Configuration

### Environment Variables

API configuration for exchange rates:

```bash
# Exchange Rate API (optional)
VITE_EXCHANGE_RATE_API_KEY=your_api_key_here
```

### API Providers

Supported exchange rate APIs:

- **ExchangeRate-API**: Free tier available
- **Fallback**: Default rates when API unavailable
- **Caching**: Rates cached for 1 hour

## Error Handling

### API Failures

Graceful degradation when exchange rate API fails:

```javascript
try {
  const rates = await fetchExchangeRates();
  setExchangeRates(rates);
} catch (error) {
  logger.error('Exchange rate fetch failed:', error);
  // Continue with default rates
}
```

### Invalid Currencies

Validation and fallbacks:

```javascript
const format = (amount, currencyCode = currency) => {
  const validCurrency = CURRENCIES[currencyCode];
  if (!validCurrency) {
    return `${amount.toFixed(2)}`; // Fallback formatting
  }
  return formatCurrency(amount, currencyCode);
};
```

## Performance Considerations

### Rate Caching

Minimize API calls with intelligent caching:

- **Initial load**: Fetch rates on app start
- **Background updates**: Refresh every hour
- **Error resilience**: Use cached rates on failure

### Conversion Optimization

Efficient conversion calculations:

- **Base currency**: MUR for all internal math
- **Memoization**: Cache expensive conversions
- **Batch updates**: Update all prices simultaneously

## Testing Strategy

### Unit Tests

Comprehensive currency utility testing:

```javascript
describe('convertCurrency', () => {
  it('should convert MUR to USD correctly', () => {
    const result = convertCurrency(1000, 'MUR', 'USD', rates);
    expect(result).toBeCloseTo(22);
  });
});

describe('formatCurrency', () => {
  it('should format MUR correctly', () => {
    const result = formatCurrency(1500, 'MUR');
    expect(result).toBe('Rs 1,500.00');
  });
});
```

### Integration Tests

Currency context and component testing:

```jsx
describe('CurrencySelector', () => {
  it('should display current currency', () => {
    renderWithProvider(<CurrencySelector />);
    expect(screen.getByText('Rs')).toBeInTheDocument();
  });

  it('should change currency when option clicked', async () => {
    renderWithProvider(<CurrencySelector />);
    // Test currency switching
  });
});
```

## Best Practices

### Currency Handling

#### Consistent Formatting

- Always use the `format` function for display
- Never hardcode currency symbols
- Respect user locale preferences

#### Conversion Accuracy

- Use base currency (MUR) for calculations
- Round appropriately for display
- Handle edge cases (zero, negative values)

#### User Experience

- Show loading states during updates
- Persist user preferences
- Provide clear currency indicators

### API Integration

#### Rate Updates

- Implement retry logic for API failures
- Cache rates to reduce API calls
- Handle rate limit scenarios

#### Error Recovery

- Always have fallback rates
- Log errors for monitoring
- Graceful degradation

### Performance

#### Optimization

- Memoize expensive conversions
- Batch DOM updates
- Lazy load currency components

#### Monitoring

- Track conversion performance
- Monitor API response times
- Alert on rate fetch failures

This comprehensive currency system provides a seamless multi-currency experience while maintaining performance, reliability, and user satisfaction across different markets and currencies.

# useCurrency Hook

The useCurrency hook provides currency conversion, formatting, and state management for the Ocean Spirit Scuba website, with automatic exchange rate fetching and local storage persistence.

## Setup

### Provider Setup

```javascript
import { CurrencyProvider } from '@/hooks/useCurrency';

function App() {
  return <CurrencyProvider>{/* Your app components */}</CurrencyProvider>;
}
```

**Required:** Wrap your app with `CurrencyProvider` at the root level.

## Hook Usage

### Basic Currency Operations

```javascript
import { useCurrency } from '@/hooks/useCurrency';

function PriceDisplay({ priceInMUR }) {
  const { currency, convert, format, loading } = useCurrency();

  if (loading) return <div>Loading...</div>;

  const convertedPrice = convert(priceInMUR);
  const formattedPrice = format(convertedPrice);

  return (
    <div>
      <span>{formattedPrice}</span>
      <span className="text-sm text-gray-500">({currency})</span>
    </div>
  );
}
```

### Currency Selection

```javascript
import { useCurrency } from '@/hooks/useCurrency';

function CurrencySelector() {
  const { currency, setCurrency, availableCurrencies, currencyInfo } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      className="currency-selector"
    >
      {availableCurrencies.map((code) => (
        <option key={code} value={code}>
          {code} - {currencyInfo?.symbol || code}
        </option>
      ))}
    </select>
  );
}
```

## Hook API

### Return Values

```javascript
const {
  currency, // Current selected currency code (string)
  setCurrency, // Function to change currency
  exchangeRates, // Current exchange rates object
  convert, // Currency conversion function
  format, // Currency formatting function
  loading, // Loading state for rate fetching
  availableCurrencies, // Array of available currency codes
  currencyInfo, // Current currency information object
} = useCurrency();
```

### Currency Conversion

```javascript
const convert = (amount, fromCurrency = 'MUR', toCurrency = currency) => {
  // Convert amount from one currency to another
  const price = convert(1000); // MUR to current currency
  const usdPrice = convert(1000, 'MUR', 'USD'); // MUR to USD
  const backToMUR = convert(usdPrice, 'USD', 'MUR'); // USD to MUR
};
```

**Parameters:**

- `amount` (number): Amount to convert
- `fromCurrency` (string): Source currency code (default: 'MUR')
- `toCurrency` (string): Target currency code (default: current currency)

### Currency Formatting

```javascript
const format = (amount, currencyCode = currency) => {
  // Format amount with currency symbol and proper locale
  const formatted = format(1234.56); // "$1,234.56" or "₨1,234.56" etc.
  const murFormatted = format(1234.56, 'MUR'); // "₨1,234.56"
};
```

**Parameters:**

- `amount` (number): Amount to format
- `currencyCode` (string): Currency code for formatting (default: current currency)

## Available Currencies

The hook supports the following currencies:

```javascript
const CURRENCIES = {
  MUR: { name: 'Mauritian Rupee', symbol: '₨', locale: 'en-MU' },
  USD: { name: 'US Dollar', symbol: '$', locale: 'en-US' },
  EUR: { name: 'Euro', symbol: '€', locale: 'en-EU' },
  GBP: { name: 'British Pound', symbol: '£', locale: 'en-GB' },
  ZAR: { name: 'South African Rand', symbol: 'R', locale: 'en-ZA' },
  INR: { name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
};
```

## State Management

### Automatic Persistence

Currency selection is automatically saved to localStorage:

```javascript
// On currency change
localStorage.setItem('selectedCurrency', newCurrency);
```

### Default Currency

Defaults to MUR (Mauritian Rupee) if no saved preference exists.

## Exchange Rates

### Automatic Fetching

Exchange rates are fetched automatically on app initialization and refreshed every hour:

```javascript
// Fetched from API endpoint
const rates = await getExchangeRates();
// { USD: 0.022, EUR: 0.019, GBP: 0.016, ... }
```

### Fallback Rates

Uses default exchange rates if API fails:

```javascript
const DEFAULT_EXCHANGE_RATES = {
  USD: 0.022,
  EUR: 0.019,
  GBP: 0.016,
  ZAR: 0.25,
  INR: 1.65,
};
```

## Analytics Integration

Currency changes are automatically tracked:

```javascript
// Tracks when user changes currency
trackCurrencyChange(oldCurrency, newCurrency);
```

## Error Handling

The hook includes robust error handling:

- Graceful fallback to default exchange rates if API fails
- Silent error handling for network issues
- Component unmount protection to prevent state updates after cleanup

## React Integration Examples

### Price Component

```javascript
import { useCurrency } from '@/hooks/useCurrency';

function CoursePrice({ basePrice }) {
  const { convert, format, currency, loading } = useCurrency();

  if (loading) {
    return <div className="animate-pulse">Loading price...</div>;
  }

  return (
    <div className="price-display">
      <span className="text-2xl font-bold">{format(convert(basePrice))}</span>
      <span className="text-sm text-gray-600 ml-1">({currency})</span>
    </div>
  );
}
```

### Currency Switcher Component

```javascript
import { useCurrency } from '@/hooks/useCurrency';

function CurrencySwitcher() {
  const { currency, setCurrency, availableCurrencies } = useCurrency();

  return (
    <div className="currency-switcher">
      <label htmlFor="currency-select">Currency:</label>
      <select
        id="currency-select"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="ml-2 p-1 border rounded"
      >
        {availableCurrencies.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Booking Form with Currency

```javascript
import { useCurrency } from '@/hooks/useCurrency';

function BookingForm() {
  const { convert, format, currency } = useCurrency();
  const coursePrice = 450; // Base price in MUR

  const handleSubmit = (formData) => {
    // Convert price to selected currency for payment processing
    const paymentAmount = convert(coursePrice);

    submitBooking({
      ...formData,
      amount: paymentAmount,
      currency: currency,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="price-summary">
        <h3>Total: {format(convert(coursePrice))}</h3>
        <p>Price in {currency}</p>
      </div>
      {/* Form fields */}
      <button type="submit">Book Now</button>
    </form>
  );
}
```

## Performance Considerations

- Exchange rates cached in component state
- Automatic refresh every hour to keep rates current
- Lazy loading of currency utilities
- Minimal re-renders through optimized state management

## Testing

```javascript
import { render } from '@testing-library/react';
import { CurrencyProvider, useCurrency } from '@/hooks/useCurrency';

// Test component that uses the hook
function TestComponent() {
  const { currency, convert } = useCurrency();
  return <div>{convert(100)}</div>;
}

// Test with provider
test('useCurrency works within provider', () => {
  render(
    <CurrencyProvider>
      <TestComponent />
    </CurrencyProvider>
  );
});
```

```

## Related

- [Currency Utils](/api/currency.md)
- [Analytics Utils](/api/analytics.md)
- [API Client](/api/client.md)

```

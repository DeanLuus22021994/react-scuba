# Currency

The currency utilities provide comprehensive currency conversion, formatting, and exchange rate management for the Ocean Spirit Scuba application.

## Supported Currencies

The system supports the following currencies:

```javascript
const CURRENCIES = {
  MUR: { symbol: 'Rs', name: 'Mauritian Rupee', code: 'MUR' },
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
};
```

## Currency Conversion

### Convert Between Currencies

```javascript
import { convertCurrency } from '@/utils/currency';

// Convert 1000 MUR to USD
const usdAmount = convertCurrency(1000, 'MUR', 'USD');
console.log(usdAmount); // ~22.00

// Convert 50 USD to EUR
const eurAmount = convertCurrency(50, 'USD', 'EUR');
console.log(eurAmount); // ~45.45
```

**Parameters:**

- `amount` (number): Amount to convert
- `fromCurrency` (string): Source currency code
- `toCurrency` (string): Target currency code
- `rates` (object): Exchange rates object (optional, uses defaults)

**Returns:** Converted amount as a number

### Custom Exchange Rates

```javascript
import { convertCurrency } from '@/utils/currency';

// Use custom exchange rates
const customRates = {
  MUR: 1,
  USD: 0.025,
  EUR: 0.022,
  GBP: 0.019,
};

const amount = convertCurrency(2000, 'MUR', 'USD', customRates);
```

## Currency Formatting

### Format Currency Amounts

```javascript
import { formatCurrency } from '@/utils/currency';

// Format MUR amount
formatCurrency(1500.5, 'MUR'); // "Rs 1,500.50"

// Format USD amount
formatCurrency(250.75, 'USD'); // "$250.75"

// Format EUR amount
formatCurrency(180.25, 'EUR'); // "€180.25"
```

**Parameters:**

- `amount` (number): Amount to format
- `currencyCode` (string): Currency code
- `locale` (string): Locale for formatting (default: 'en-MU')

**Returns:** Formatted currency string

### Get Currency Symbols

```javascript
import { getCurrencySymbol } from '@/utils/currency';

getCurrencySymbol('MUR'); // "Rs"
getCurrencySymbol('USD'); // "$"
getCurrencySymbol('EUR'); // "€"
```

**Parameters:**

- `currencyCode` (string): Currency code

**Returns:** Currency symbol string

### Get Currency Names

```javascript
import { getCurrencyName } from '@/utils/currency';

getCurrencyName('MUR'); // "Mauritian Rupee"
getCurrencyName('USD'); // "US Dollar"
getCurrencyName('EUR'); // "Euro"
```

**Parameters:**

- `currencyCode` (string): Currency code

**Returns:** Full currency name string

## Exchange Rate Management

### Fetch Live Exchange Rates

```javascript
import { fetchExchangeRates } from '@/utils/currency';

// Fetch current exchange rates from API
const rates = await fetchExchangeRates();
console.log(rates);
// {
//   MUR: 1,
//   USD: 0.022,
//   EUR: 0.020,
//   GBP: 0.017
// }
```

**Environment Variable:** `VITE_EXCHANGE_RATE_API_KEY` - API key for exchangerate-api.com

**Returns:** Promise resolving to exchange rates object with MUR as base currency

### Default Exchange Rates

The system includes fallback exchange rates when the API is unavailable:

```javascript
const DEFAULT_EXCHANGE_RATES = {
  MUR: 1,
  USD: 0.022, // 1 MUR = 0.022 USD
  EUR: 0.02, // 1 MUR = 0.020 EUR
  GBP: 0.017, // 1 MUR = 0.017 GBP
};
```

## Integration with useCurrency Hook

The currency utilities are designed to work seamlessly with the `useCurrency` hook:

```javascript
import { useCurrency } from '@/hooks/useCurrency';

function PriceDisplay({ amount, currency }) {
  const { formatPrice, convertPrice } = useCurrency();

  return (
    <div>
      <span>{formatPrice(amount, currency)}</span>
      <span className="text-sm text-gray-500">
        ({formatPrice(convertPrice(amount, currency, 'USD'), 'USD')})
      </span>
    </div>
  );
}
```

## Error Handling

- Currency conversion gracefully handles invalid currency codes
- Exchange rate fetching includes error handling with fallback to default rates
- All functions include proper logging for debugging

## Environment Configuration

Set the exchange rate API key for live rates:

```bash
# .env
VITE_EXCHANGE_RATE_API_KEY=your_api_key_here
```

```

## Related

- [API Reference](/api/)
- [useCurrency Hook](/api/use-currency.md)
- [Guide](/guide/currency.md)

```

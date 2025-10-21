import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { CurrencyProvider } from './hooks/useCurrency';

test('renders app with currency provider', () => {
  render(
    <HelmetProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </HelmetProvider>
  );
  // Check if app renders without crashing
  const appElement = screen.getByRole('banner'); // header/nav should be present
  expect(appElement).toBeDefined();
});

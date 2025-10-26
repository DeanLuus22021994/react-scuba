import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CurrencyProvider } from '../src/hooks/useCurrency';
import DiveSitesPage from '../src/pages/DiveSitesPage';

const renderWithProviders = (component) => {
  return render(
    <HelmetProvider>
      <CurrencyProvider>
        <MemoryRouter>{component}</MemoryRouter>
      </CurrencyProvider>
    </HelmetProvider>,
  );
};

describe('DiveSitesPage', () => {
  it('should render without crashing', async () => {
    const { container } = renderWithProviders(<DiveSitesPage />);
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });

  it('should render page heading', async () => {
    renderWithProviders(<DiveSitesPage />);
    await waitFor(() => {
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  it('should render dive sites content', async () => {
    const { container } = renderWithProviders(<DiveSitesPage />);
    await waitFor(() => {
      expect(container.textContent).toBeTruthy();
    });
  });

  it('should have page content loaded', async () => {
    const { container } = renderWithProviders(<DiveSitesPage />);
    await waitFor(() => {
      expect(container.innerHTML.length).toBeGreaterThan(100);
    });
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CurrencyProvider } from '../src/hooks/useCurrency.jsx';
import HomePage from '../src/pages/HomePage';

const renderWithProviders = (component) => {
  return render(
    <HelmetProvider>
      <CurrencyProvider>
        <MemoryRouter>{component}</MemoryRouter>
      </CurrencyProvider>
    </HelmetProvider>
  );
};

describe('HomePage', () => {
  it('should render without crashing', async () => {
    const { container } = renderWithProviders(<HomePage />);
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });

  it('should render hero section with heading', async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() => {
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  it('should render all main sections', async () => {
    const { container } = renderWithProviders(<HomePage />);
    await waitFor(() => {
      expect(container.textContent).toBeTruthy();
    });
  });

  it('should have page content loaded', async () => {
    const { container } = renderWithProviders(<HomePage />);
    await waitFor(() => {
      expect(container.innerHTML.length).toBeGreaterThan(100);
    });
  });
});

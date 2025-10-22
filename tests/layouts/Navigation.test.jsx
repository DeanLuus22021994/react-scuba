import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CurrencyProvider } from '@/hooks/useCurrency';
import Navigation from '@/layouts/Navigation';

describe('Navigation', () => {
  const renderWithProviders = (component) => {
    return render(
      <CurrencyProvider>
        <BrowserRouter>{component}</BrowserRouter>
      </CurrencyProvider>
    );
  };

  it('should render without crashing', () => {
    renderWithProviders(<Navigation />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithProviders(<Navigation />);
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Courses/i })).toBeInTheDocument();
  });

  it('should have proper navigation structure', () => {
    const { container } = renderWithProviders(<Navigation />);
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });
});

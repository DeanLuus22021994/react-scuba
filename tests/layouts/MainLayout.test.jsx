import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CurrencyProvider } from '@/hooks';
import MainLayout from '@/layouts/MainLayout';

describe('MainLayout', () => {
  const renderWithProviders = (content) => {
    return render(
      <CurrencyProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={content} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CurrencyProvider>
    );
  };

  it('should render without crashing', () => {
    renderWithProviders(<div>Test content</div>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render children', () => {
    renderWithProviders(<div>Child content</div>);
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should contain header', () => {
    const { container } = renderWithProviders(<div>Test</div>);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('should contain footer', () => {
    const { container } = renderWithProviders(<div>Test</div>);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CurrencyProvider } from '@/hooks/useCurrency';
import Header from '@/layouts/Header';

describe('Header', () => {
    const renderWithProviders = (component) => {
        return render(
            <CurrencyProvider>
                <BrowserRouter>{component}</BrowserRouter>
            </CurrencyProvider>
        );
    };

    it('should render without crashing', () => {
        renderWithProviders(<Header />);
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
    });

    it('should contain navigation', () => {
        const { container } = renderWithProviders(<Header />);
        const nav = container.querySelector('nav');
        expect(nav).toBeInTheDocument();
    });

    it('should have proper structure', () => {
        const { container } = renderWithProviders(<Header />);
        const header = container.querySelector('header');
        expect(header).toBeInTheDocument();
    });
});

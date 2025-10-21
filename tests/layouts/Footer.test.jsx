import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CurrencyProvider } from '../../../src/hooks/useCurrency';
import Footer from '../../../src/layouts/Footer';

describe('Footer', () => {
    const renderWithProviders = (component) => {
        return render(
            <CurrencyProvider>
                <BrowserRouter>{component}</BrowserRouter>
            </CurrencyProvider>
        );
    };

    it('should render without crashing', () => {
        renderWithProviders(<Footer />);
        expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    });

    it('should display copyright text', () => {
        renderWithProviders(<Footer />);
        expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    });

    it('should render footer links', () => {
        renderWithProviders(<Footer />);
        const aboutLink = screen.getByRole('link', { name: /About/i });
        expect(aboutLink).toBeInTheDocument();
    });

    it('should have proper structure', () => {
        const { container } = renderWithProviders(<Footer />);
        const footer = container.querySelector('footer');
        expect(footer).toBeInTheDocument();
    });
});

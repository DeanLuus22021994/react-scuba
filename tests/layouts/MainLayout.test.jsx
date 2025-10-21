import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CurrencyProvider } from '../../src/hooks/useCurrency';
import MainLayout from '../../src/layouts/MainLayout';

describe('MainLayout', () => {
    const renderWithProviders = (component) => {
        return render(
            <CurrencyProvider>
                <BrowserRouter>{component}</BrowserRouter>
            </CurrencyProvider>
        );
    };

    it('should render without crashing', () => {
        renderWithProviders(
            <MainLayout>
                <div>Test content</div>
            </MainLayout>
        );
        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render children', () => {
        renderWithProviders(
            <MainLayout>
                <div>Child content</div>
            </MainLayout>
        );
        expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should contain header', () => {
        const { container } = renderWithProviders(
            <MainLayout>
                <div>Test</div>
            </MainLayout>
        );
        const header = container.querySelector('header');
        expect(header).toBeInTheDocument();
    });

    it('should contain footer', () => {
        const { container } = renderWithProviders(
            <MainLayout>
                <div>Test</div>
            </MainLayout>
        );
        const footer = container.querySelector('footer');
        expect(footer).toBeInTheDocument();
    });
});

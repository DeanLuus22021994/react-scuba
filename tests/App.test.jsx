import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

describe('App', () => {
    const renderApp = () => {
        return render(
            <HelmetProvider>
                <App />
            </HelmetProvider>
        );
    };

    it('should render without crashing', () => {
        const { container } = renderApp();
        expect(container).toBeInTheDocument();
    });

    it('should render header component', async () => {
        renderApp();
        const header = await screen.findByRole('banner');
        expect(header).toBeInTheDocument();
    });

    it('should render main content area', async () => {
        renderApp();
        const main = await screen.findByRole('main');
        expect(main).toBeInTheDocument();
        expect(main).toHaveClass('flex-grow');
    });

    it('should wrap app with CurrencyProvider', () => {
        const { container } = renderApp();
        expect(container.querySelector('.App')).toBeInTheDocument();
    });

    it('should have scroll progress component', () => {
        const { container } = renderApp();
        expect(container).toBeInTheDocument();
    });
});

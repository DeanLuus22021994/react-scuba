import { CurrencyProvider } from '@/hooks/useCurrency';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

// Import pages directly
import AboutPageComponent from '@/pages/AboutPage';
import CoursesPageComponent from '@/pages/CoursesPage';
import DiveSitesPageComponent from '@/pages/DiveSitesPage';
import GalleryPageComponent from '@/pages/GalleryPage';
import HomePageComponent from '@/pages/HomePage';

const renderWithProviders = (component) => {
    return render(
        <HelmetProvider>
            <CurrencyProvider>
                <BrowserRouter>{component}</BrowserRouter>
            </CurrencyProvider>
        </HelmetProvider>
    );
};

describe('pages/AboutPage', () => {
    it('should render without crashing', () => {
        renderWithProviders(<AboutPageComponent />);
        expect(screen.getByText(/About Our Dive Center/i)).toBeInTheDocument();
    });
});

describe('pages/CoursesPage', () => {
    it('should render without crashing', () => {
        renderWithProviders(<CoursesPageComponent />);
        expect(screen.getByText(/Diving Courses/i)).toBeInTheDocument();
    });
});

describe('pages/DiveSitesPage', () => {
    it('should render without crashing', () => {
        const renderWithMemory = (component) => {
            return render(
                <HelmetProvider>
                    <CurrencyProvider>
                        <MemoryRouter>{component}</MemoryRouter>
                    </CurrencyProvider>
                </HelmetProvider>
            );
        };
        renderWithMemory(<DiveSitesPageComponent />);
        expect(screen.getByText(/Dive Sites of Mauritius/i)).toBeInTheDocument();
    });
});

describe('pages/GalleryPage', () => {
    it('should render without crashing', () => {
        renderWithProviders(<GalleryPageComponent />);
        expect(screen.getByText(/Dive Gallery/i)).toBeInTheDocument();
    });
});

describe('pages/HomePage', () => {
    it('should render without crashing', () => {
        renderWithProviders(<HomePageComponent />);
        expect(screen.getByText('Welcome to Ocean Spirit Scuba Diving Mauritius')).toBeInTheDocument();
    });
});

import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CurrencyProvider } from '../../../src/hooks/useCurrency';

// Import pages directly
import AboutPageComponent from '../../../src/pages/AboutPage';
import CoursesPageComponent from '../../../src/pages/CoursesPage';
import DiveSitesPageComponent from '../../../src/pages/DiveSitesPage';
import GalleryPageComponent from '../../../src/pages/GalleryPage';
import HomePageComponent from '../../../src/pages/HomePage';

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
        expect(screen.getByText(/About/i)).toBeInTheDocument();
    });
});

describe('pages/CoursesPage', () => {
    it('should render without crashing', () => {
        renderWithProviders(<CoursesPageComponent />);
        expect(screen.getByText(/Courses/i)).toBeInTheDocument();
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
        expect(screen.getByText(/Dive Sites/i)).toBeInTheDocument();
    });
});

describe('pages/GalleryPage', () => {
    it('should render without crashing', () => {
        renderWithProviders(<GalleryPageComponent />);
        expect(screen.getByText(/Gallery/i)).toBeInTheDocument();
    });
});

describe('pages/HomePage', () => {
    it('should render without crashing', () => {
        renderWithProviders(<HomePageComponent />);
        expect(screen.getByText(/Discover/i)).toBeInTheDocument();
    });
});

import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CurrencyProvider } from '../../src/hooks/useCurrency.jsx';

// Import pages directly
import AboutPageComponent from '../../src/pages/AboutPage.jsx';
import CoursesPageComponent from '../../src/pages/CoursesPage.jsx';
import DiveSitesPageComponent from '../../src/pages/DiveSitesPage.jsx';
import GalleryPageComponent from '../../src/pages/GalleryPage.jsx';
import HomePageComponent from '../../src/pages/HomePage.jsx';

const renderWithProviders = (component) => {
  return render(
    <HelmetProvider>
      <CurrencyProvider>
        <BrowserRouter>{component}</BrowserRouter>
      </CurrencyProvider>
    </HelmetProvider>,
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
        </HelmetProvider>,
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

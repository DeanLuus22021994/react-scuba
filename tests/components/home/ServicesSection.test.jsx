import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ServicesSection from '@/components/home/ServicesSection';

describe('ServicesSection', () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render without crashing', () => {
    renderWithRouter(<ServicesSection />);
    expect(screen.getByText('Our Services')).toBeInTheDocument();
  });

  it('should display main heading', () => {
    renderWithRouter(<ServicesSection />);
    expect(screen.getByText('Our Services')).toBeInTheDocument();
  });

  it('should display all service cards', () => {
    renderWithRouter(<ServicesSection />);
    expect(screen.getByText('PADI Courses')).toBeInTheDocument();
    expect(screen.getByText('Guided Dives')).toBeInTheDocument();
    expect(screen.getByText('Photo Dives')).toBeInTheDocument();
  });

  it('should render service links', () => {
    renderWithRouter(<ServicesSection />);
    const coursesLink = screen.getByRole('link', { name: /View Courses/i });
    const sitesLink = screen.getByRole('link', { name: /Explore Sites/i });
    const galleryLink = screen.getByRole('link', { name: /View Gallery/i });

    expect(coursesLink).toHaveAttribute('href', '/courses');
    expect(sitesLink).toHaveAttribute('href', '/dive-sites');
    expect(galleryLink).toHaveAttribute('href', '/gallery');
  });

  it('should display service descriptions', () => {
    renderWithRouter(<ServicesSection />);
    expect(screen.getByText(/comprehensive PADI courses/i)).toBeInTheDocument();
    expect(screen.getByText(/best dive sites/i)).toBeInTheDocument();
    expect(screen.getByText(/photography dive packages/i)).toBeInTheDocument();
  });
});

import HeroSection from '@/components/home/HeroSection';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

describe('HeroSection', () => {
  const mockOnBookClick = vi.fn();

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render without crashing', () => {
    renderWithRouter(<HeroSection onBookClick={mockOnBookClick} />);
    expect(screen.getByText('Welcome to Ocean Spirit Scuba Diving Mauritius')).toBeInTheDocument();
  });

  it('should display main heading', () => {
    renderWithRouter(<HeroSection onBookClick={mockOnBookClick} />);
    expect(screen.getByText('Welcome to Ocean Spirit Scuba Diving Mauritius')).toBeInTheDocument();
  });

  it('should display subtitle', () => {
    renderWithRouter(<HeroSection onBookClick={mockOnBookClick} />);
    expect(screen.getByText(/PADI 5 Star ECO Green Fins/i)).toBeInTheDocument();
  });

  it('should render Book Your Dive button', () => {
    renderWithRouter(<HeroSection onBookClick={mockOnBookClick} />);
    expect(screen.getByRole('button', { name: 'Book Your Dive' })).toBeInTheDocument();
  });

  it('should render View Courses link', () => {
    renderWithRouter(<HeroSection onBookClick={mockOnBookClick} />);
    const link = screen.getByRole('link', { name: 'View Courses' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/courses');
  });

  it('should display scroll indicator', () => {
    renderWithRouter(<HeroSection onBookClick={mockOnBookClick} />);
    expect(screen.getByText('Scroll to explore')).toBeInTheDocument();
  });
});

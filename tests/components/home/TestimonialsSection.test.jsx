import TestimonialsSection from '@/components/home/TestimonialsSection';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('TestimonialsSection', () => {
  it('should render without crashing', () => {
    render(<TestimonialsSection />);
    expect(screen.getByText('What Our Divers Say')).toBeInTheDocument();
  });

  it('should display main heading', () => {
    render(<TestimonialsSection />);
    expect(screen.getByText('What Our Divers Say')).toBeInTheDocument();
  });

  it('should display all testimonials', () => {
    render(<TestimonialsSection />);
    expect(screen.getByText('Sarah Mitchell')).toBeInTheDocument();
    expect(screen.getByText('David Chen')).toBeInTheDocument();
    expect(screen.getByText('Emma Laurent')).toBeInTheDocument();
  });

  it('should display testimonial locations', () => {
    render(<TestimonialsSection />);
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    expect(screen.getByText('Singapore')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
  });

  it('should display testimonial text', () => {
    render(<TestimonialsSection />);
    expect(screen.getByText(/From the day I arrived/i)).toBeInTheDocument();
    expect(screen.getByText(/Best dive center in Pereybere/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed my Advanced certification/i)).toBeInTheDocument();
  });

  it('should render star ratings', () => {
    const { container } = render(<TestimonialsSection />);
    const stars = container.querySelectorAll('.text-yellow-400');
    expect(stars.length).toBeGreaterThan(0);
  });
});

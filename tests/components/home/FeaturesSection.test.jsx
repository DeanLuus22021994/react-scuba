import FeaturesSection from '@/components/home/FeaturesSection';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('FeaturesSection', () => {
  it('should render without crashing', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Why Choose Us')).toBeInTheDocument();
  });

  it('should display main heading', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Why Choose Us')).toBeInTheDocument();
  });

  it('should display subtitle', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/committed to providing the best/i)).toBeInTheDocument();
  });

  it('should display all features', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('PADI 5 Star ECO')).toBeInTheDocument();
    expect(screen.getByText('Dive Sites')).toBeInTheDocument();
    expect(screen.getByText('Own Facility')).toBeInTheDocument();
    expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
  });

  it('should display feature stats', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('5★')).toBeInTheDocument();
    expect(screen.getByText('65')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('☕')).toBeInTheDocument();
  });
});

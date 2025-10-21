import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FeaturesSection from '../../src/components/home/FeaturesSection';

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
        expect(screen.getByText('PADI 5 Star Certified')).toBeInTheDocument();
        expect(screen.getByText('Years of Experience')).toBeInTheDocument();
        expect(screen.getByText('Successful Dives')).toBeInTheDocument();
        expect(screen.getByText('Perfect Safety Record')).toBeInTheDocument();
    });

    it('should display feature stats', () => {
        render(<FeaturesSection />);
        expect(screen.getByText('5★')).toBeInTheDocument();
        expect(screen.getByText('10+')).toBeInTheDocument();
        expect(screen.getByText('5000+')).toBeInTheDocument();
        expect(screen.getByText('100%')).toBeInTheDocument();
    });
});

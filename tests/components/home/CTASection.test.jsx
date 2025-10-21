import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CTASection from '../../src/components/home/CTASection';

describe('CTASection', () => {
    const mockOnContactClick = vi.fn();

    it('should render without crashing', () => {
        render(<CTASection onContactClick={mockOnContactClick} />);
        expect(screen.getByText('Ready to Dive In?')).toBeInTheDocument();
    });

    it('should display main heading', () => {
        render(<CTASection onContactClick={mockOnContactClick} />);
        expect(screen.getByText('Ready to Dive In?')).toBeInTheDocument();
    });

    it('should display description', () => {
        render(<CTASection onContactClick={mockOnContactClick} />);
        expect(screen.getByText(/unforgettable underwater adventure/i)).toBeInTheDocument();
    });

    it('should render Contact Us button', () => {
        render(<CTASection onContactClick={mockOnContactClick} />);
        expect(screen.getByRole('button', { name: 'Contact Us Today' })).toBeInTheDocument();
    });

    it('should render Call Us link', () => {
        render(<CTASection onContactClick={mockOnContactClick} />);
        const link = screen.getByRole('link', { name: 'Call Us Now' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', expect.stringContaining('tel:'));
    });
});

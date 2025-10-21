import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ContactModal from '../../../src/components/modals/ContactModal';

// Mock dependencies
vi.mock('../../../src/services/api', () => ({
    sendContactMessage: vi.fn(() => Promise.resolve({ success: true })),
}));

vi.mock('../../../src/utils/analytics', () => ({
    trackFormComplete: vi.fn(),
    trackFormAbandon: vi.fn(),
    trackFormStart: vi.fn(),
}));

describe('ContactModal', () => {
    const mockOnClose = vi.fn();

    it('should render when open', () => {
        render(<ContactModal isOpen={true} onClose={mockOnClose} />);
        expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
    });

    it('should not render when closed', () => {
        render(<ContactModal isOpen={false} onClose={mockOnClose} />);
        expect(screen.queryByText(/Contact Us/i)).not.toBeInTheDocument();
    });

    it('should display form fields', () => {
        render(<ContactModal isOpen={true} onClose={mockOnClose} />);
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    });

    it('should have submit button', () => {
        render(<ContactModal isOpen={true} onClose={mockOnClose} />);
        expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
    });
});

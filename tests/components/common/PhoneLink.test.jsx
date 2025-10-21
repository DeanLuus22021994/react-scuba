import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import PhoneLink from '@/components/common/PhoneLink';

vi.mock('../../../src/utils/analytics', () => ({
    trackPhoneClick: vi.fn(),
}));

describe('PhoneLink', () => {
    it('should render without crashing', () => {
        render(<PhoneLink />);
        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
    });

    it('should display phone number by default', () => {
        render(<PhoneLink />);
        expect(screen.getByText(/\+230/)).toBeInTheDocument();
    });

    it('should display custom children when provided', () => {
        render(<PhoneLink>Call Now</PhoneLink>);
        expect(screen.getByText('Call Now')).toBeInTheDocument();
    });

    it('should have correct tel href', () => {
        render(<PhoneLink />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', expect.stringContaining('tel:'));
    });

    it('should render phone icon', () => {
        const { container } = render(<PhoneLink />);
        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();
    });

    it('should have aria-label', () => {
        render(<PhoneLink />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('aria-label', 'Call us');
    });

    it('should apply custom className', () => {
        render(<PhoneLink className="custom-class" />);
        const link = screen.getByRole('link');
        expect(link).toHaveClass('custom-class');
    });

    it('should call trackPhoneClick on click', async () => {
        const user = userEvent.setup();
        const { trackPhoneClick } = await import('../../../src/utils/analytics');

        render(<PhoneLink source="test-source" />);
        const link = screen.getByRole('link');
        await user.click(link);

        expect(trackPhoneClick).toHaveBeenCalledWith('test-source');
    });
});

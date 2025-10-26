import WhatsAppButton from '@/components/common/WhatsAppButton';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../src/utils/analytics', () => ({
  trackWhatsAppClick: vi.fn(),
}));

describe('WhatsAppButton', () => {
  it('should render without crashing', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('should render button variant by default', () => {
    render(<WhatsAppButton />);
    expect(screen.getByText('Chat on WhatsApp')).toBeInTheDocument();
  });

  it('should render icon variant correctly', () => {
    render(<WhatsAppButton variant="icon" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label', 'Chat on WhatsApp');
    expect(screen.queryByText('Chat on WhatsApp')).not.toBeInTheDocument();
  });

  it('should render floating variant with fixed positioning', () => {
    render(<WhatsAppButton variant="floating" />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('fixed', 'bottom-6', 'right-6');
  });

  it('should have correct WhatsApp URL', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', expect.stringContaining('wa.me'));
  });

  it('should encode custom message in URL', () => {
    const customMessage = 'Test message';
    render(<WhatsAppButton message={customMessage} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining(encodeURIComponent(customMessage)),
    );
  });

  it('should open in new tab', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render WhatsApp icon', () => {
    const { container } = render(<WhatsAppButton />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should call trackWhatsAppClick on click', async () => {
    const user = userEvent.setup();
    const { trackWhatsAppClick } = await import('../../../src/utils/analytics');

    render(<WhatsAppButton source="test-source" messageType="test-type" />);
    const link = screen.getByRole('link');
    await user.click(link);

    expect(trackWhatsAppClick).toHaveBeenCalledWith('test-source', 'test-type');
  });

  it('should apply custom className', () => {
    render(<WhatsAppButton className="custom-class" />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-class');
  });
});

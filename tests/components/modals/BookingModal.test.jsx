import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BookingModal from '@/components/modals/BookingModal';
import { CurrencyProvider } from '@/hooks/useCurrency';

// Mock dependencies
vi.mock('../../../src/services/api', () => ({
  checkCalendarAvailability: vi.fn(() => Promise.resolve(true)),
  createCalendarBooking: vi.fn(() => Promise.resolve({ success: true })),
}));

vi.mock('../../../src/utils/analytics', () => ({
  trackCalendarBookingComplete: vi.fn(),
  trackFormAbandon: vi.fn(),
  trackFormStart: vi.fn(),
}));

describe('BookingModal', () => {
  const mockOnClose = vi.fn();

  const renderWithProvider = (component) => {
    return render(<CurrencyProvider>{component}</CurrencyProvider>);
  };

  it('should render when open', async () => {
    renderWithProvider(<BookingModal isOpen onClose={mockOnClose} />);
    await waitFor(() => {
      expect(screen.getByText(/Book a Dive/i)).toBeInTheDocument();
    });
  });

  it('should not render when closed', () => {
    renderWithProvider(<BookingModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText(/Book a Dive/i)).not.toBeInTheDocument();
  });

  it('should display booking type options', async () => {
    renderWithProvider(<BookingModal isOpen onClose={mockOnClose} bookingType="dive" />);
    await waitFor(() => {
      expect(screen.getByText(/Single Dive/i)).toBeInTheDocument();
    });
  });

  it('should accept preSelectedItem prop', async () => {
    const preSelected = 'single-dive';
    renderWithProvider(
      <BookingModal isOpen onClose={mockOnClose} preSelectedItem={preSelected} />,
    );
    await waitFor(() => {
      expect(screen.getByText(/Book a Dive/i)).toBeInTheDocument();
      expect(screen.getByText(/Single Dive/i)).toBeInTheDocument();
    });
  });
});

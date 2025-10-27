import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BookingForm from '../../../src/features/booking/components/BookingForm';

describe('BookingForm', () => {
  const mockSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render booking form', () => {
    render(<BookingForm onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/participants/i)).toBeInTheDocument();
  });

  it('should initialize with provided booking type', () => {
    render(<BookingForm onSubmit={mockSubmit} bookingType="course" />);

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should validate required name field', async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockSubmit} />);

    // Fill other required fields to pass HTML5 validation
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/phone/i), '12345678');

    // Leave name with just one character (less than 2)
    await user.type(screen.getByLabelText(/full name/i), 'A');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/phone/i), '12345678');

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Valid email is required')).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should validate phone number', async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');

    const phoneInput = screen.getByLabelText(/phone/i);
    await user.type(phoneInput, '123');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Valid phone number is required')).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid form data', async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          participants: 1,
        }),
      );
    });
  });

  it('should update participants count', async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockSubmit} />);

    const participantsInput = screen.getByLabelText(/participants/i);
    await user.clear(participantsInput);
    await user.type(participantsInput, '4');

    expect(participantsInput).toHaveValue(4);
  });

  it('should validate minimum participants', async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/phone/i), '12345678');

    const participantsInput = screen.getByLabelText(/number of participants/i);
    await user.clear(participantsInput);
    await user.type(participantsInput, '0');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Participants must be between 1 and 20')).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should disable submit button when loading', () => {
    render(<BookingForm onSubmit={mockSubmit} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should include courseId when provided', async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockSubmit} bookingType="course" courseId="open-water" />);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          courseId: 'open-water',
          bookingType: 'course',
        }),
      );
    });
  });

  it('should include diveSiteId when provided', async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockSubmit} bookingType="dive" diveSiteId="cathedral" />);

    await user.type(screen.getByLabelText(/name/i), 'Jane Smith');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+9876543210');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          diveSiteId: 'cathedral',
          bookingType: 'dive',
        }),
      );
    });
  });

  it('should handle special requests', async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockSubmit} />);

    const specialRequestsField = screen.getByLabelText(/special requests/i);
    await user.type(specialRequestsField, 'Need vegetarian meal');

    expect(specialRequestsField).toHaveValue('Need vegetarian meal');
  });

  it('should clear errors on valid input', async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockSubmit} />);

    // Fill fields to pass HTML5 validation but fail custom validation
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/phone/i), '12345678');
    await user.type(screen.getByLabelText(/full name/i), 'A'); // Too short

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/full name/i);
    await user.type(nameInput, 'lan Turing'); // Make it "Alan Turing"

    await waitFor(() => {
      expect(screen.queryByText('Name must be at least 2 characters')).not.toBeInTheDocument();
    });
  });
});

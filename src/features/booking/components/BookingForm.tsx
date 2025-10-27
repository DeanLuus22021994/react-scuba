import { FC } from 'react';

export interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  isLoading?: boolean;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  date: Date;
  participants: number;
  bookingType: 'dive' | 'course';
  specialRequests?: string;
}

/**
 * BookingForm Component
 * 
 * Reusable booking form component for dive and course bookings.
 * Includes validation, date picker, and participant selection.
 */
const BookingForm: FC<BookingFormProps> = ({ onSubmit, isLoading = false }) => {
  // TODO: Implement booking form with react-hook-form + zod validation
  // TODO: Add date picker integration
  // TODO: Add participant count selector
  // TODO: Add booking type selector
  // TODO: Add special requests textarea
  
  const handleSubmit = () => {
    // Placeholder implementation
    onSubmit({
      name: '',
      email: '',
      phone: '',
      date: new Date(),
      participants: 1,
      bookingType: 'dive',
    });
  };
  
  return (
    <div className="booking-form">
      <p className="text-gray-500">BookingForm component - Coming soon</p>
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default BookingForm;

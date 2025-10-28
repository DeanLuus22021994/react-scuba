import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { createBooking } from '../../../services/api';
import { trackConversion } from '../../../utils/analytics';
import type { BookingFormData } from '../components/BookingForm';

export interface UseBookingFormOptions {
  onSuccess?: (bookingId: number) => void;
  onError?: (error: Error) => void;
}

export interface UseBookingFormReturn {
  isSubmitting: boolean;
  error: Error | null;
  submitBooking: (data: BookingFormData) => Promise<void>;
  resetForm: () => void;
  isSuccess: boolean;
}

/**
 * useBookingForm Hook
 *
 * Custom hook for managing booking form state and submission.
 * Handles validation, API calls, and error states.
 */
export const useBookingForm = (options?: UseBookingFormOptions): UseBookingFormReturn => {
  const [error, setError] = useState<Error | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await createBooking(data);
      return response;
    },
    onSuccess: (data) => {
      // Track conversion in analytics
      trackConversion('booking_submitted', {
        booking_type: (data.data as any)?.bookingType || 'unknown',
        value: ((data.data as any)?.participants || 1) * 100, // Estimated value
      });

      // Call user-provided success handler
      if (options?.onSuccess && (data.data as any)?.bookingId) {
        options.onSuccess((data.data as any).bookingId);
      }
    },
    onError: (err: Error) => {
      setError(err);

      // Call user-provided error handler
      if (options?.onError) {
        options.onError(err);
      }
    },
  });

  const submitBooking = async (data: BookingFormData) => {
    setError(null);
    await mutation.mutateAsync(data);
  };

  const resetForm = () => {
    setError(null);
    mutation.reset();
  };

  return {
    isSubmitting: mutation.isPending,
    error: error || (mutation.error as Error | null),
    submitBooking,
    resetForm,
    isSuccess: mutation.isSuccess,
  };
};

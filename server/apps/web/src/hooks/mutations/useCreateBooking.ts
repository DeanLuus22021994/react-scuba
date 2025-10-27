/**
 * Booking mutation using TanStack Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '../../services/api';
import type { ApiResponse, BookingRequest, BookingResponse } from '../../types';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BookingRequest): Promise<ApiResponse<BookingResponse>> => {
      return await createBooking(data);
    },
    onSuccess: () => {
      // Invalidate relevant queries on success
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    retry: 1,
  });
}

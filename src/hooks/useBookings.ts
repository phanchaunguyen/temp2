import { useCallback, useEffect, useState } from 'react';
import { bookingService } from '@/services/booking.service';
import {
  Booking,
  CreateBookingRequest,
  MyBookingsQuery,
  UpdateBookingRequest,
} from '@/types/booking.types';
import { PaginatedResponse } from '@/types/common.types';

export function useMyBookings(initialQuery: MyBookingsQuery = { page: 1, limit: 10 }) {
  const [query, setQuery] = useState<MyBookingsQuery>(initialQuery);
  const [result, setResult] = useState<PaginatedResponse<Booking> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getMyBookings(query);
      setResult(data);
    } catch {
      setError('Không thể tải danh sách đặt sân của bạn.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { bookings: result?.data ?? [], total: result?.total ?? 0, query, setQuery, isLoading, error, refetch };
}

export function useBookingActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflict, setConflict] = useState<string | null>(null);

  const createBooking = useCallback(async (payload: CreateBookingRequest) => {
    setIsSubmitting(true);
    setConflict(null);
    try {
      return await bookingService.createBooking(payload);
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setConflict(err.response.data?.detail ?? 'Khung giờ này vừa được đặt bởi người khác.');
      }
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateBooking = useCallback((bookingId: string, payload: UpdateBookingRequest) => {
    return bookingService.updateBooking(bookingId, payload);
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    return bookingService.cancelBooking(bookingId);
  }, []);

  return { createBooking, updateBooking, cancelBooking, isSubmitting, conflict };
}

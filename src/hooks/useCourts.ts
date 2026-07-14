import { useCallback, useEffect, useState } from 'react';
import { bookingService } from '@/services/booking.service';
import { Court, CourtAvailabilityResponse, CourtSearchQuery } from '@/types/booking.types';
import { PaginatedResponse } from '@/types/common.types';

export function useCourts(initialQuery: CourtSearchQuery = { page: 1, limit: 8 }) {
  const [query, setQuery] = useState<CourtSearchQuery>(initialQuery);
  const [result, setResult] = useState<PaginatedResponse<Court> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourts = useCallback(async (q: CourtSearchQuery) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.searchCourts(q);
      setResult(data);
    } catch (err) {
      setError('Không thể tải danh sách sân. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourts(query);
  }, [query, fetchCourts]);

  return { courts: result?.data ?? [], total: result?.total ?? 0, query, setQuery, isLoading, error };
}

export function useCourtAvailability(courtId: string | undefined, date: string) {
  const [availability, setAvailability] = useState<CourtAvailabilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courtId || !date) return;
    setIsLoading(true);
    setError(null);
    bookingService
      .getAvailability(courtId, date)
      .then(setAvailability)
      .catch(() => setError('Không thể tải lịch trống của sân.'))
      .finally(() => setIsLoading(false));
  }, [courtId, date]);

  return { availability, isLoading, error };
}

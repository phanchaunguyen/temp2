import { apiClient } from './api';
import { mockBookingService } from '@/mocks/mockBookingService';
import { PaginatedResponse } from '@/types/common.types';
import {
  Booking,
  Court,
  CourtAvailabilityResponse,
  CourtSearchQuery,
  CreateBookingRequest,
  CreateBookingResponse,
  MyBookingsQuery,
  UpdateBookingRequest,
} from '@/types/booking.types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

const realBookingService = {
  // 1. GET /api/v1/courts
  searchCourts: (query: CourtSearchQuery) =>
    apiClient.get<PaginatedResponse<Court>>('/courts', { params: query }).then((r) => r.data),

  // 2. GET /api/v1/courts/{court_id}/availability
  getAvailability: (courtId: string, date: string) =>
    apiClient
      .get<CourtAvailabilityResponse>(`/courts/${courtId}/availability`, { params: { date } })
      .then((r) => r.data),

  // 3. POST /api/v1/bookings — may reject with 409 Conflict (row-level lock)
  createBooking: (payload: CreateBookingRequest) =>
    apiClient.post<CreateBookingResponse>('/bookings', payload).then((r) => r.data),

  // 4. PUT /api/v1/bookings/{booking_id} — PENDING only, re-runs overlap check
  updateBooking: (bookingId: string, payload: UpdateBookingRequest) =>
    apiClient.put<Booking>(`/bookings/${bookingId}`, payload).then((r) => r.data),

  // 5. DELETE /api/v1/bookings/{booking_id} — 204, status -> CANCELLED
  cancelBooking: (bookingId: string) => apiClient.delete<void>(`/bookings/${bookingId}`).then(() => undefined),

  // 6. GET /api/v1/bookings/me — user_id derived from JWT
  getMyBookings: (query: MyBookingsQuery) =>
    apiClient.get<PaginatedResponse<Booking>>('/bookings/me', { params: query }).then((r) => r.data),
};

export const bookingService = USE_MOCK ? mockBookingService : realBookingService;

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
import { bookingStore, delay, MOCK_COURTS, newId, paginate, seedBookedSlots } from './mockData';

function getCurrentUserId(): string {
  const raw = localStorage.getItem('user_data');
  if (!raw) throw { response: { status: 401, data: { detail: 'Chưa đăng nhập.' } } };
  return JSON.parse(raw).user_id;
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);
}

export const mockBookingService = {
  searchCourts: async (query: CourtSearchQuery): Promise<PaginatedResponse<Court>> => {
    let filtered = MOCK_COURTS;
    if (query.sport_type) filtered = filtered.filter((c) => c.sport_type === query.sport_type);
    if (query.address) {
      const q = query.address.toLowerCase();
      filtered = filtered.filter((c) => c.address.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    }
    return delay(paginate(filtered, query.page, query.limit));
  },

  getAvailability: async (courtId: string, date: string): Promise<CourtAvailabilityResponse> => {
    const existingBookings = bookingStore
      .all()
      .filter((b) => b.court_id === courtId && b.start_time.startsWith(date) && b.status !== 'CANCELLED')
      .map((b) => ({ start_time: b.start_time, end_time: b.end_time }));
    return delay({ court_id: courtId, date, booked_slots: [...seedBookedSlots(courtId, date), ...existingBookings] });
  },

  createBooking: async (payload: CreateBookingRequest): Promise<CreateBookingResponse> => {
    const userId = getCurrentUserId();
    const court = MOCK_COURTS.find((c) => c.court_id === payload.court_id);
    const all = bookingStore.all();

    const conflict = all.some(
      (b) =>
        b.court_id === payload.court_id &&
        b.status !== 'CANCELLED' &&
        overlaps(payload.start_time, payload.end_time, b.start_time, b.end_time)
    );
    const seeded = seedBookedSlots(payload.court_id, payload.start_time.slice(0, 10));
    const seedConflict = seeded.some((s) => overlaps(payload.start_time, payload.end_time, s.start_time, s.end_time));

    if (conflict || seedConflict) {
      return Promise.reject({ response: { status: 409, data: { detail: 'Khung giờ này vừa được đặt bởi người khác.' } } });
    }

    const hours =
      (new Date(payload.end_time).getTime() - new Date(payload.start_time).getTime()) / (1000 * 60 * 60);
    const total_amount = Math.round((court?.price_per_hour ?? 0) * hours);

    const booking: Booking = {
      booking_id: newId('booking'),
      court_id: payload.court_id,
      court_name: court?.name,
      user_id: userId,
      start_time: payload.start_time,
      end_time: payload.end_time,
      note: payload.note,
      total_amount,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    bookingStore.save([...all, booking]);
    return delay({ booking_id: booking.booking_id, total_amount, status: 'PENDING' });
  },

  updateBooking: async (bookingId: string, payload: UpdateBookingRequest): Promise<Booking> => {
    const all = bookingStore.all();
    const idx = all.findIndex((b) => b.booking_id === bookingId);
    if (idx === -1) return Promise.reject({ response: { status: 404, data: { detail: 'Không tìm thấy booking.' } } });
    if (all[idx].status !== 'PENDING') {
      return Promise.reject({ response: { status: 400, data: { detail: 'Chỉ có thể sửa booking đang chờ thanh toán.' } } });
    }
    all[idx] = { ...all[idx], start_time: payload.start_time, end_time: payload.end_time };
    bookingStore.save(all);
    return delay(all[idx]);
  },

  cancelBooking: async (bookingId: string): Promise<void> => {
    const all = bookingStore.all();
    const idx = all.findIndex((b) => b.booking_id === bookingId);
    if (idx !== -1) {
      all[idx] = { ...all[idx], status: 'CANCELLED' };
      bookingStore.save(all);
    }
    return delay(undefined, 300);
  },

  getMyBookings: async (query: MyBookingsQuery): Promise<PaginatedResponse<Booking>> => {
    const userId = getCurrentUserId();
    let mine = bookingStore.forUser(userId).sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (query.status) mine = mine.filter((b) => b.status === query.status);
    return delay(paginate(mine, query.page, query.limit));
  },
};

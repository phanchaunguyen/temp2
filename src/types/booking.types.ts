export type SportType = 'badminton' | 'tennis' | 'pickleball' | 'futsal';

export interface Court {
  court_id: string;
  name: string;
  sport_type: SportType;
  address: string;
  price_per_hour: number;
  rating: number;
  review_count: number;
  image_url: string;
  is_active: boolean;
}

// 1. GET /api/v1/courts
export interface CourtSearchQuery {
  sport_type?: SportType;
  address?: string;
  page?: number;
  limit?: number;
}

// 2. GET /api/v1/courts/{court_id}/availability
export interface TimeSlot {
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
}
export interface CourtAvailabilityResponse {
  court_id: string;
  date: string; // YYYY-MM-DD
  booked_slots: TimeSlot[];
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  booking_id: string;
  court_id: string;
  court_name?: string;
  user_id: string;
  start_time: string;
  end_time: string;
  note?: string;
  total_amount: number;
  status: BookingStatus;
  created_at: string;
}

// 3. POST /api/v1/bookings
export interface CreateBookingRequest {
  court_id: string;
  start_time: string;
  end_time: string;
  note?: string;
}
export interface CreateBookingResponse {
  booking_id: string;
  total_amount: number;
  status: 'PENDING';
}
// 409 Conflict shape (row-level lock collision / overlap)
export interface BookingConflictError {
  detail: string; // e.g. "Slot already booked"
}

// 4. PUT /api/v1/bookings/{booking_id}
export interface UpdateBookingRequest {
  start_time: string;
  end_time: string;
}

// 6. GET /api/v1/bookings/me
export interface MyBookingsQuery {
  status?: BookingStatus;
  page?: number;
  limit?: number;
}

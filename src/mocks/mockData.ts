// Demo data layer — simulates the FastAPI backend entirely in the browser
// (localStorage), so the UI can be exercised end-to-end without Cognito/RDS.
// Enabled by VITE_USE_MOCK_API=true in .env — see services/*.service.ts.

import { Court, Booking, BookingStatus, TimeSlot } from '@/types/booking.types';
import { Payment, PaymentStatus } from '@/types/payment.types';
import { User } from '@/types/auth.types';

const KEYS = {
  users: 'mock_users',
  bookings: 'mock_bookings',
  payments: 'mock_payments',
} as const;

function read<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// ---- Seed courts (static demo catalogue, mirrors GET /courts shape) ----
export const MOCK_COURTS: Court[] = [
  {
    court_id: 'court-1',
    name: 'Yêu Cầu Badminton Club',
    sport_type: 'badminton',
    address: 'Quận 7, TP. HCM',
    price_per_hour: 80000,
    rating: 4.9,
    review_count: 128,
    image_url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
    is_active: true,
  },
  {
    court_id: 'court-2',
    name: 'Victor Arena Phú Nhuận',
    sport_type: 'badminton',
    address: 'Phú Nhuận, TP. HCM',
    price_per_hour: 120000,
    rating: 4.7,
    review_count: 95,
    image_url: 'https://images.unsplash.com/photo-1613918431703-aa50889a63f6?w=800&q=80',
    is_active: false,
  },
  {
    court_id: 'court-3',
    name: 'Sunrise Badminton Center',
    sport_type: 'badminton',
    address: 'Quận 2, TP. HCM',
    price_per_hour: 100000,
    rating: 4.8,
    review_count: 210,
    image_url: 'https://images.unsplash.com/photo-1591491719779-e2c9a24e8e97?w=800&q=80',
    is_active: true,
  },
  {
    court_id: 'court-4',
    name: 'The Lab Badminton',
    sport_type: 'badminton',
    address: 'Bình Thạnh, TP. HCM',
    price_per_hour: 95000,
    rating: 4.9,
    review_count: 154,
    image_url: 'https://images.unsplash.com/photo-1592656094267-764a45160876?w=800&q=80',
    is_active: true,
  },
  {
    court_id: 'court-5',
    name: 'Sao Việt Tennis & Badminton',
    sport_type: 'tennis',
    address: 'Quận 1, TP. HCM',
    price_per_hour: 150000,
    rating: 4.6,
    review_count: 61,
    image_url: 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=800&q=80',
    is_active: true,
  },
  {
    court_id: 'court-6',
    name: 'Pickle Zone HCMC',
    sport_type: 'pickleball',
    address: 'Thủ Đức, TP. HCM',
    price_per_hour: 90000,
    rating: 4.5,
    review_count: 40,
    image_url: 'https://images.unsplash.com/photo-1622279457486-28f993f37f47?w=800&q=80',
    is_active: true,
  },
];

// A couple of already-booked slots today, so the availability grid has something to show.
export function seedBookedSlots(courtId: string, date: string): TimeSlot[] {
  return [
    { start_time: `${date}T09:00:00`, end_time: `${date}T10:00:00` },
    { start_time: `${date}T18:00:00`, end_time: `${date}T19:00:00` },
  ].filter(() => courtId != null);
}

// ---- Users ----
interface StoredUser extends User {
  password: string;
}

export const userStore = {
  all: (): StoredUser[] => read(KEYS.users, []),
  save: (users: StoredUser[]) => write(KEYS.users, users),
  findByEmail: (email: string) => userStore.all().find((u) => u.email === email),
};

// ---- Bookings ----
export const bookingStore = {
  all: (): Booking[] => read(KEYS.bookings, []),
  save: (bookings: Booking[]) => write(KEYS.bookings, bookings),
  forUser: (userId: string) => bookingStore.all().filter((b) => b.user_id === userId),
};

// ---- Payments ----
export const paymentStore = {
  all: (): Payment[] => read(KEYS.payments, []),
  save: (payments: Payment[]) => write(KEYS.payments, payments),
};

export function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

// Seed one ready-to-use demo account so login works immediately without registering first.
(function seedDemoUser() {
  const existing = userStore.all();
  if (!existing.some((u) => u.email === 'demo@bookingcourts.vn')) {
    userStore.save([
      ...existing,
      {
        user_id: 'user-demo',
        cognito_sub: 'sub-demo',
        email: 'demo@bookingcourts.vn',
        full_name: 'Người dùng Demo',
        password: 'demo123456',
      },
    ]);
  }
})();


export function paginate<T>(items: T[], page = 1, limit = 10) {
  const start = (page - 1) * limit;
  return { data: items.slice(start, start + limit), total: items.length, page, limit };
}

export type { BookingStatus, PaymentStatus };

import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import CourtSearchPage from '@/pages/courts/CourtSearchPage';
import CourtDetailPage from '@/pages/courts/CourtDetailPage';
import MyBookingsPage from '@/pages/bookings/MyBookingsPage';
import BookingCheckoutPage from '@/pages/bookings/BookingCheckoutPage';
import PaymentHistoryPage from '@/pages/payments/PaymentHistoryPage';
import PaymentDetailPage from '@/pages/payments/PaymentDetailPage';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/courts" element={<CourtSearchPage />} />
      <Route path="/courts/:courtId" element={<CourtDetailPage />} />

      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/:bookingId/checkout"
        element={
          <ProtectedRoute>
            <BookingCheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <PaymentHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments/:paymentId"
        element={
          <ProtectedRoute>
            <PaymentDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

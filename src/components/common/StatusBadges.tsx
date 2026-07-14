import { BookingStatus } from '@/types/booking.types';
import { PaymentStatus } from '@/types/payment.types';

const bookingStyles: Record<BookingStatus, string> = {
  PENDING: 'bg-warning-container text-warning',
  CONFIRMED: 'bg-primary-container/30 text-primary',
  CANCELLED: 'bg-error-container text-error',
  COMPLETED: 'bg-surface-container-high text-on-surface-variant',
};

const bookingLabels: Record<BookingStatus, string> = {
  PENDING: 'Chờ thanh toán',
  CONFIRMED: 'Đã xác nhận',
  CANCELLED: 'Đã hủy',
  COMPLETED: 'Đã hoàn thành',
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`px-3 py-1 rounded-full text-label-sm font-bold ${bookingStyles[status]}`}>
      {bookingLabels[status]}
    </span>
  );
}

const paymentStyles: Record<PaymentStatus, string> = {
  PENDING: 'bg-warning-container text-warning',
  SUCCESS: 'bg-primary-container/30 text-primary',
  FAILED: 'bg-error-container text-error',
  REFUNDED: 'bg-surface-container-high text-on-surface-variant',
};

const paymentLabels: Record<PaymentStatus, string> = {
  PENDING: 'Đang xử lý',
  SUCCESS: 'Thành công',
  FAILED: 'Thất bại',
  REFUNDED: 'Đã hoàn tiền',
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`px-3 py-1 rounded-full text-label-sm font-bold ${paymentStyles[status]}`}>
      {paymentLabels[status]}
    </span>
  );
}

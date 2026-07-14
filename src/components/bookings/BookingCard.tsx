import { Booking } from '@/types/booking.types';
import { BookingStatusBadge } from '@/components/common/StatusBadges';

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
  onEdit: (booking: Booking) => void;
  onPay: (booking: Booking) => void;
}

function formatRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const date = s.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = `${s.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${e.toLocaleTimeString(
    'vi-VN',
    { hour: '2-digit', minute: '2-digit' }
  )}`;
  return `${date} · ${time}`;
}

export function BookingCard({ booking, onCancel, onEdit, onPay }: BookingCardProps) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-primary-container/20 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-2xl">stadium</span>
        </div>
        <div>
          <p className="text-label-md font-bold text-on-surface">{booking.court_name ?? booking.court_id}</p>
          <p className="text-body-md text-on-surface-variant">{formatRange(booking.start_time, booking.end_time)}</p>
          {booking.note && <p className="text-label-sm text-on-surface-variant italic">"{booking.note}"</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <BookingStatusBadge status={booking.status} />
          <p className="text-label-md font-bold text-primary mt-1">
            {booking.total_amount.toLocaleString('vi-VN')}đ
          </p>
        </div>

        {booking.status === 'PENDING' && (
          <div className="flex gap-2">
            <button
              onClick={() => onPay(booking)}
              className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-sm font-bold hover:opacity-90"
            >
              Thanh toán
            </button>
            <button
              onClick={() => onEdit(booking)}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              title="Đổi giờ"
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button
              onClick={() => onCancel(booking.booking_id)}
              className="p-2 text-on-surface-variant hover:text-error transition-colors"
              title="Hủy đặt sân"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

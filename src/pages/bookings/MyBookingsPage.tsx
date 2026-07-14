import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { BookingCard } from '@/components/bookings/BookingCard';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner, ErrorBanner, EmptyState } from '@/components/common/Feedback';
import { useMyBookings, useBookingActions } from '@/hooks/useBookings';
import { Booking, BookingStatus } from '@/types/booking.types';

const statusTabs: { value: BookingStatus | ''; label: string }[] = [
  { value: '', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ thanh toán' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'COMPLETED', label: 'Đã hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

export default function MyBookingsPage() {
  const { bookings, total, query, setQuery, isLoading, error, refetch } = useMyBookings({ page: 1, limit: 10 });
  const { cancelBooking, updateBooking } = useBookingActions();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<Booking | null>(null);
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Bạn có chắc muốn hủy đặt sân này?')) return;
    await cancelBooking(bookingId);
    refetch();
  };

  const handleEditSubmit = async () => {
    if (!editing) return;
    await updateBooking(editing.booking_id, { start_time: newStart, end_time: newEnd });
    setEditing(null);
    refetch();
  };

  return (
    <MainLayout>
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-headline-lg font-bold text-on-surface">Đặt sân của tôi</h2>
          <p className="text-body-md text-on-surface-variant">Quản lý lịch đặt sân và lịch sử của bạn</p>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setQuery({ ...query, status: (tab.value || undefined) as BookingStatus | undefined, page: 1 })}
              className={`px-4 py-2 rounded-full text-label-sm font-bold whitespace-nowrap transition-colors ${
                (query.status ?? '') === tab.value
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading && <LoadingSpinner label="Đang tải lịch đặt sân..." />}
        {error && <ErrorBanner message={error} />}

        {!isLoading && !error && bookings.length === 0 && (
          <EmptyState
            icon="event_busy"
            title="Chưa có lịch đặt sân nào"
            description="Tìm một sân yêu thích và đặt ngay hôm nay."
          />
        )}

        {!isLoading && !error && bookings.length > 0 && (
          <>
            <div className="flex flex-col gap-4">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.booking_id}
                  booking={booking}
                  onCancel={handleCancel}
                  onEdit={(b) => {
                    setEditing(b);
                    setNewStart(b.start_time.slice(0, 16));
                    setNewEnd(b.end_time.slice(0, 16));
                  }}
                  onPay={(b) => navigate(`/bookings/${b.booking_id}/checkout`, { state: { booking: b } })}
                />
              ))}
            </div>
            <Pagination
              page={query.page ?? 1}
              limit={query.limit ?? 10}
              total={total}
              onPageChange={(page) => setQuery({ ...query, page })}
            />
          </>
        )}
      </section>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm flex flex-col gap-4">
            <h3 className="text-headline-md font-bold text-on-surface">Đổi khung giờ</h3>
            <div>
              <label className="text-label-sm text-on-surface-variant">Bắt đầu</label>
              <input
                type="datetime-local"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-lg border border-outline-variant"
              />
            </div>
            <div>
              <label className="text-label-sm text-on-surface-variant">Kết thúc</label>
              <input
                type="datetime-local"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-lg border border-outline-variant"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 py-2.5 rounded-lg border border-outline-variant font-bold text-label-md"
              >
                Hủy
              </button>
              <button
                onClick={handleEditSubmit}
                className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary font-bold text-label-md"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

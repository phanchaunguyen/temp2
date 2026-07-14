import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AvailabilityGrid } from '@/components/courts/AvailabilityGrid';
import { LoadingSpinner, ErrorBanner } from '@/components/common/Feedback';
import { useCourtAvailability } from '@/hooks/useCourts';
import { useBookingActions } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { Court } from '@/types/booking.types';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function CourtDetailPage() {
  const { courtId } = useParams<{ courtId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // The API only exposes GET /courts (list) and GET /courts/{id}/availability —
  // there's no GET /courts/{id}, so we carry the court summary via navigation state.
  const court = (location.state as { court?: Court } | null)?.court;

  const [date, setDate] = useState(todayIso());
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
  const [note, setNote] = useState('');

  const { availability, isLoading, error } = useCourtAvailability(courtId, date);
  const { createBooking, isSubmitting, conflict } = useBookingActions();

  const handleBook = async () => {
    if (!courtId || !selectedSlot) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await createBooking({
        court_id: courtId,
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
        note: note || undefined,
      });
      navigate(`/bookings/${res.booking_id}/checkout`, { state: { booking: res, court } });
    } catch {
      // conflict message is surfaced via the `conflict` state below
    }
  };

  return (
    <MainLayout>
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
          <button onClick={() => navigate('/courts')} className="hover:text-primary">
            Tìm kiếm
          </button>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span>{court?.name ?? courtId}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="rounded-xl overflow-hidden h-72">
              <img
                src={court?.image_url ?? 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&q=80'}
                alt={court?.name ?? 'court'}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-headline-lg font-bold text-on-surface">{court?.name ?? 'Sân cầu lông'}</h2>
              <div className="flex items-center gap-1 mt-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span className="text-label-md">{court?.address}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-outline-variant p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-headline-md font-bold text-on-surface">Chọn khung giờ</h3>
                <input
                  type="date"
                  value={date}
                  min={todayIso()}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="px-3 py-2 rounded-lg border border-outline-variant"
                />
              </div>

              {isLoading && <LoadingSpinner label="Đang tải lịch trống..." />}
              {error && <ErrorBanner message={error} />}
              {!isLoading && !error && (
                <AvailabilityGrid
                  date={date}
                  bookedSlots={availability?.booked_slots ?? []}
                  selectedSlot={selectedSlot}
                  onSelectSlot={(start, end) => setSelectedSlot({ start, end })}
                />
              )}

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú cho chủ sân (tuỳ chọn)"
                className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none resize-none"
                rows={2}
              />
            </div>
          </div>

          {/* Booking summary sidebar */}
          <div className="bg-surface-container-highest rounded-xl p-6 flex flex-col gap-4 border border-outline-variant h-fit sticky top-24">
            <h3 className="text-headline-md font-bold text-on-surface">Tóm tắt đặt sân</h3>
            <div className="flex justify-between text-body-md">
              <span className="text-on-surface-variant">Giá / giờ</span>
              <span className="font-bold">{(court?.price_per_hour ?? 0).toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between text-body-md">
              <span className="text-on-surface-variant">Khung giờ</span>
              <span className="font-bold">
                {selectedSlot
                  ? `${new Date(selectedSlot.start).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(
                      selectedSlot.end
                    ).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
                  : 'Chưa chọn'}
              </span>
            </div>
            <div className="h-px bg-outline-variant" />
            <div className="flex justify-between text-label-md font-bold">
              <span>Tổng cộng</span>
              <span className="text-primary">{(court?.price_per_hour ?? 0).toLocaleString('vi-VN')}đ</span>
            </div>

            {conflict && <ErrorBanner message={conflict} />}

            <button
              disabled={!selectedSlot || isSubmitting}
              onClick={handleBook}
              className="bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Đặt sân ngay'}
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ErrorBanner } from '@/components/common/Feedback';
import { useCreatePayment } from '@/hooks/usePayments';
import { Booking } from '@/types/booking.types';
import { Court } from '@/types/booking.types';
import { PaymentMethod } from '@/types/payment.types';

const methods: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'momo', label: 'Ví MoMo', icon: 'account_balance_wallet' },
  { value: 'vnpay', label: 'VNPay', icon: 'qr_code_2' },
  { value: 'zalopay', label: 'ZaloPay', icon: 'account_balance_wallet' },
  { value: 'credit_card', label: 'Thẻ tín dụng', icon: 'credit_card' },
];

export default function BookingCheckoutPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { booking?: Partial<Booking> & { total_amount?: number }; court?: Court } | null;
  const booking = state?.booking;
  const court = state?.court;

  const [method, setMethod] = useState<PaymentMethod>('momo');
  const [error, setError] = useState<string | null>(null);
  const { createPayment, isSubmitting } = useCreatePayment();

  const amount = booking?.total_amount ?? court?.price_per_hour ?? 0;

  const handlePay = async () => {
    if (!bookingId) return;
    setError(null);
    try {
      const res = await createPayment({ booking_id: bookingId, amount, payment_method: method });
      // In production: window.location.href = res.checkout_url;
      navigate(`/payments/${res.payment_id}`);
    } catch {
      setError('Không thể khởi tạo thanh toán. Vui lòng thử lại.');
    }
  };

  return (
    <MainLayout>
      <section className="max-w-xl mx-auto w-full flex flex-col gap-6">
        <div>
          <h2 className="text-headline-lg font-bold text-on-surface">Xác nhận thanh toán</h2>
          <p className="text-body-md text-on-surface-variant">Đặt sân #{bookingId?.slice(0, 8)}</p>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant p-6 flex flex-col gap-4">
          <div className="flex justify-between text-body-md">
            <span className="text-on-surface-variant">Sân</span>
            <span className="font-bold">{court?.name ?? 'Sân cầu lông'}</span>
          </div>
          <div className="h-px bg-outline-variant" />
          <div className="flex justify-between text-label-md font-bold">
            <span>Tổng cộng</span>
            <span className="text-primary">{amount.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-label-md font-bold text-on-surface">Phương thức thanh toán</h3>
          {methods.map((m) => (
            <button
              key={m.value}
              onClick={() => setMethod(m.value)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                method === m.value ? 'border-primary bg-primary-container/10' : 'border-outline-variant hover:border-primary'
              }`}
            >
              <span className="material-symbols-outlined text-primary">{m.icon}</span>
              <span className="text-label-md font-bold text-on-surface">{m.label}</span>
              {method === m.value && (
                <span className="material-symbols-outlined text-primary ml-auto">check_circle</span>
              )}
            </button>
          ))}
        </div>

        {error && <ErrorBanner message={error} />}

        <button
          onClick={handlePay}
          disabled={isSubmitting}
          className="bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? 'Đang khởi tạo...' : `Thanh toán ${amount.toLocaleString('vi-VN')}đ`}
        </button>
      </section>
    </MainLayout>
  );
}

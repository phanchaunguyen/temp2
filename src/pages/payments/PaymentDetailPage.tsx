import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner, ErrorBanner } from '@/components/common/Feedback';
import { PaymentStatusBadge } from '@/components/common/StatusBadges';
import { usePayment } from '@/hooks/usePayments';

const statusCopy: Record<string, { icon: string; title: string; description: string }> = {
  PENDING: {
    icon: 'hourglass_top',
    title: 'Đang xử lý thanh toán',
    description: 'Cổng thanh toán đang xác nhận giao dịch. Trang này sẽ tự cập nhật khi có kết quả.',
  },
  SUCCESS: {
    icon: 'check_circle',
    title: 'Thanh toán thành công',
    description: 'Sân của bạn đã được xác nhận. Hẹn gặp bạn trên sân!',
  },
  FAILED: {
    icon: 'cancel',
    title: 'Thanh toán thất bại',
    description: 'Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức khác.',
  },
  REFUNDED: {
    icon: 'undo',
    title: 'Đã hoàn tiền',
    description: 'Khoản thanh toán này đã được hoàn lại vào tài khoản của bạn.',
  },
};

export default function PaymentDetailPage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();
  const { payment, isLoading, error } = usePayment(paymentId);

  // The gateway confirms asynchronously via POST /api/v1/payments/webhook (API Gateway ->
  // Lambda -> RDS -> SNS). While PENDING we poll GET /payments/{id} for the update.
  useEffect(() => {
    if (payment?.status !== 'PENDING') return;
    const interval = setInterval(() => window.location.reload(), 5000);
    return () => clearInterval(interval);
  }, [payment?.status]);

  return (
    <MainLayout>
      <section className="max-w-xl mx-auto w-full flex flex-col gap-6">
        {isLoading && <LoadingSpinner label="Đang tải trạng thái thanh toán..." />}
        {error && <ErrorBanner message={error} />}

        {payment && (
          <div className="bg-white rounded-xl border border-outline-variant p-8 flex flex-col items-center gap-4 text-center">
            <span
              className={`material-symbols-outlined text-6xl ${
                payment.status === 'SUCCESS'
                  ? 'text-primary'
                  : payment.status === 'FAILED'
                  ? 'text-error'
                  : 'text-warning'
              }`}
            >
              {statusCopy[payment.status].icon}
            </span>
            <h2 className="text-headline-md font-bold text-on-surface">{statusCopy[payment.status].title}</h2>
            <p className="text-body-md text-on-surface-variant">{statusCopy[payment.status].description}</p>
            <PaymentStatusBadge status={payment.status} />

            <div className="w-full mt-4 flex flex-col gap-2 text-left bg-surface-container-low rounded-lg p-4">
              <div className="flex justify-between text-label-sm">
                <span className="text-on-surface-variant">Mã giao dịch</span>
                <span className="font-bold">{payment.transaction_id ?? '—'}</span>
              </div>
              <div className="flex justify-between text-label-sm">
                <span className="text-on-surface-variant">Số tiền</span>
                <span className="font-bold">{payment.amount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/bookings')}
              className="mt-4 w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95"
            >
              Xem lịch đặt sân
            </button>
          </div>
        )}
      </section>
    </MainLayout>
  );
}

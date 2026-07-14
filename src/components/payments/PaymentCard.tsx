import { Payment } from '@/types/payment.types';
import { PaymentStatusBadge } from '@/components/common/StatusBadges';
import { useNavigate } from 'react-router-dom';

const methodLabel: Record<string, string> = {
  momo: 'MoMo',
  vnpay: 'VNPay',
  zalopay: 'ZaloPay',
  credit_card: 'Thẻ tín dụng',
};

export function PaymentCard({ payment }: { payment: Payment }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/payments/${payment.payment_id}`)}
      className="bg-white rounded-xl border border-outline-variant p-5 flex items-center justify-between gap-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-secondary-container/50 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-on-secondary-container">receipt_long</span>
        </div>
        <div>
          <p className="text-label-md font-bold text-on-surface">Đặt sân #{payment.booking_id.slice(0, 8)}</p>
          <p className="text-label-sm text-on-surface-variant">
            {methodLabel[payment.payment_method] ?? payment.payment_method} ·{' '}
            {new Date(payment.created_at).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
      <div className="text-right">
        <PaymentStatusBadge status={payment.status} />
        <p className="text-label-md font-bold text-on-surface mt-1">{payment.amount.toLocaleString('vi-VN')}đ</p>
      </div>
    </div>
  );
}

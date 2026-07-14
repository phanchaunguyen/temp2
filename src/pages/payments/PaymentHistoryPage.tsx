import { MainLayout } from '@/components/layout/MainLayout';
import { PaymentCard } from '@/components/payments/PaymentCard';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner, ErrorBanner, EmptyState } from '@/components/common/Feedback';
import { usePaymentHistory } from '@/hooks/usePayments';

export default function PaymentHistoryPage() {
  const { payments, total, query, setQuery, isLoading, error } = usePaymentHistory({ page: 1, limit: 10 });

  return (
    <MainLayout>
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-headline-lg font-bold text-on-surface">Lịch sử thanh toán</h2>
          <p className="text-body-md text-on-surface-variant">Toàn bộ giao dịch thanh toán của bạn</p>
        </div>

        {isLoading && <LoadingSpinner label="Đang tải lịch sử thanh toán..." />}
        {error && <ErrorBanner message={error} />}

        {!isLoading && !error && payments.length === 0 && (
          <EmptyState
            icon="receipt_long"
            title="Chưa có giao dịch nào"
            description="Lịch sử thanh toán của bạn sẽ xuất hiện tại đây."
          />
        )}

        {!isLoading && !error && payments.length > 0 && (
          <>
            <div className="flex flex-col gap-4">
              {payments.map((payment) => (
                <PaymentCard key={payment.payment_id} payment={payment} />
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
    </MainLayout>
  );
}

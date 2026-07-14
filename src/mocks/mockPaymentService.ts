import { PaginatedResponse } from '@/types/common.types';
import { CreatePaymentRequest, CreatePaymentResponse, Payment, PaymentHistoryQuery } from '@/types/payment.types';
import { bookingStore, delay, newId, paginate, paymentStore } from './mockData';

export const mockPaymentService = {
  createPayment: async (payload: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
    const payment: Payment = {
      payment_id: newId('payment'),
      booking_id: payload.booking_id,
      amount: payload.amount,
      payment_method: payload.payment_method,
      status: 'PENDING',
      checkout_url: '#mock-checkout',
      created_at: new Date().toISOString(),
    };
    paymentStore.save([...paymentStore.all(), payment]);

    // Simulate the gateway calling POST /payments/webhook a few seconds later,
    // which in the real system flips status to SUCCESS and confirms the booking.
    setTimeout(() => {
      const all = paymentStore.all();
      const idx = all.findIndex((p) => p.payment_id === payment.payment_id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], status: 'SUCCESS', transaction_id: newId('txn') };
        paymentStore.save(all);
      }
      const bookings = bookingStore.all();
      const bIdx = bookings.findIndex((b) => b.booking_id === payload.booking_id);
      if (bIdx !== -1) {
        bookings[bIdx] = { ...bookings[bIdx], status: 'CONFIRMED' };
        bookingStore.save(bookings);
      }
    }, 4000);

    return delay({ payment_id: payment.payment_id, checkout_url: payment.checkout_url!, status: 'PENDING' });
  },

  getPayment: async (paymentId: string): Promise<Payment> => {
    const payment = paymentStore.all().find((p) => p.payment_id === paymentId);
    if (!payment) return Promise.reject({ response: { status: 404, data: { detail: 'Không tìm thấy giao dịch.' } } });
    return delay(payment, 200);
  },

  getMyPayments: async (query: PaymentHistoryQuery): Promise<PaginatedResponse<Payment>> => {
    const all = paymentStore.all().sort((a, b) => b.created_at.localeCompare(a.created_at));
    return delay(paginate(all, query.page, query.limit));
  },
};

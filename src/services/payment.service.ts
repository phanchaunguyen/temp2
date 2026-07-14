import { apiClient } from './api';
import { mockPaymentService } from '@/mocks/mockPaymentService';
import { PaginatedResponse } from '@/types/common.types';
import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  Payment,
  PaymentHistoryQuery,
} from '@/types/payment.types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

const realPaymentService = {
  // 1. POST /api/v1/payments
  createPayment: (payload: CreatePaymentRequest) =>
    apiClient.post<CreatePaymentResponse>('/payments', payload).then((r) => r.data),

  // 2. POST /api/v1/payments/webhook — gateway callback, not called from the SPA directly,
  // kept here for completeness / documentation purposes only.
  // handled server-side by API Gateway -> Lambda -> RDS -> SNS.

  // 3. GET /api/v1/payments/{payment_id}
  getPayment: (paymentId: string) =>
    apiClient.get<Payment>(`/payments/${paymentId}`).then((r) => r.data),

  // 4. GET /api/v1/payments
  getMyPayments: (query: PaymentHistoryQuery) =>
    apiClient.get<PaginatedResponse<Payment>>('/payments', { params: query }).then((r) => r.data),
};

export const paymentService = USE_MOCK ? mockPaymentService : realPaymentService;

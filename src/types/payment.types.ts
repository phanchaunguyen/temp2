export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'momo' | 'vnpay' | 'zalopay' | 'credit_card';

export interface Payment {
  payment_id: string;
  booking_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  checkout_url?: string;
  created_at: string;
}

// 1. POST /api/v1/payments
export interface CreatePaymentRequest {
  booking_id: string;
  amount: number;
  payment_method: PaymentMethod;
}
export interface CreatePaymentResponse {
  payment_id: string;
  checkout_url: string;
  status: 'PENDING';
}

// 2. POST /api/v1/payments/webhook (gateway -> API Gateway -> Lambda -> RDS -> SNS)
export interface PaymentWebhookRequest {
  payment_id: string;
  transaction_id: string;
  status: PaymentStatus;
  gateway_data: Record<string, unknown>;
}
export interface PaymentWebhookResponse {
  success: boolean;
}

// 4. GET /api/v1/payments
export interface PaymentHistoryQuery {
  page?: number;
  limit?: number;
}

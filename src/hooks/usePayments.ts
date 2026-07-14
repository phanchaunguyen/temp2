import { useCallback, useEffect, useState } from 'react';
import { paymentService } from '@/services/payment.service';
import { CreatePaymentRequest, Payment, PaymentHistoryQuery } from '@/types/payment.types';
import { PaginatedResponse } from '@/types/common.types';

export function usePaymentHistory(initialQuery: PaymentHistoryQuery = { page: 1, limit: 10 }) {
  const [query, setQuery] = useState<PaymentHistoryQuery>(initialQuery);
  const [result, setResult] = useState<PaginatedResponse<Payment> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    paymentService
      .getMyPayments(query)
      .then(setResult)
      .catch(() => setError('Không thể tải lịch sử thanh toán.'))
      .finally(() => setIsLoading(false));
  }, [query]);

  return { payments: result?.data ?? [], total: result?.total ?? 0, query, setQuery, isLoading, error };
}

export function usePayment(paymentId: string | undefined) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId) return;
    setIsLoading(true);
    paymentService
      .getPayment(paymentId)
      .then(setPayment)
      .catch(() => setError('Không thể tải trạng thái thanh toán.'))
      .finally(() => setIsLoading(false));
  }, [paymentId]);

  return { payment, isLoading, error };
}

export function useCreatePayment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createPayment = useCallback(async (payload: CreatePaymentRequest) => {
    setIsSubmitting(true);
    try {
      return await paymentService.createPayment(payload);
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  return { createPayment, isSubmitting };
}

import { authFetch, createApiError, readJson } from '@/shared/api';

export interface CreateOrderDetails {
  customerName: string;
  customerPhone: string;
  customerComment?: string;
  items: { productId: number; quantity: number; unitPrice: number }[];
}

export interface CreateOrderRequest extends CreateOrderDetails {
  idempotencyKey: string;
}

export interface CreatedOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
}

export const createOrder = async (request: CreateOrderRequest): Promise<CreatedOrder> => {
  const response = await authFetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) throw await createApiError(response);

  return readJson<CreatedOrder>(response);
};

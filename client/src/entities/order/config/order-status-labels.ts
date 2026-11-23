import type { OrderStatus } from '../api/order.types';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Оформлен',
  accepted: 'Принят',
  ready: 'Готов к выдаче',
  completed: 'Завершён',
  cancelled: 'Отменён',
};

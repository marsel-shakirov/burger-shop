import { useId } from 'react';

import { formatPrice } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { FormAlert } from '@/shared/ui/form-alert';

import type { CreatedOrder } from '../api/create-order';
import type { useCheckoutSubmission } from '../model/use-checkout-submission';
import { PickupDetails } from './checkout-contacts';

type Submission = ReturnType<typeof useCheckoutSubmission>;

const getErrorMessage = ({ confirmation, conflictCode, refreshStatus }: Submission) => {
  if (confirmation.needsRetry) {
    return 'Не удалось получить ответ. Повторите отправку того же заказа.';
  }
  if (conflictCode === 'cart_changed') {
    return refreshStatus === 'failed'
      ? 'Не удалось обновить корзину и цены. Попробуйте обновить их ещё раз.'
      : 'Состав или цены изменились. Проверьте обновлённый итог и подтвердите заказ ещё раз.';
  }
  if (conflictCode === 'order_total_too_large') {
    return 'Сумма заказа слишком большая. Вернитесь в корзину и уменьшите количество товаров.';
  }
  return 'Не удалось оформить заказ. Проверьте корзину и контакты.';
};

export const CheckoutIssue = ({ submission }: { submission: Submission }) => {
  const errorId = useId();

  if (submission.refreshStatus === 'pending') {
    return <p role="status">Обновляем корзину и цены…</p>;
  }

  if (!submission.isError || submission.conflictCode === 'cart_empty') return null;

  return (
    <>
      <FormAlert id={errorId}>{getErrorMessage(submission)}</FormAlert>
      {submission.confirmation.needsRetry && (
        <Button onClick={submission.retry}>Повторить отправку</Button>
      )}
      {submission.refreshStatus === 'failed' && (
        <Button onClick={() => void submission.refreshOrder()}>Обновить корзину и цены</Button>
      )}
    </>
  );
};

interface CheckoutResultProps {
  order: CreatedOrder;
  cartRefreshStatus: Submission['cartRefreshStatus'];
  onRefreshCart: () => void;
}

export const CheckoutResult = ({
  order,
  cartRefreshStatus,
  onRefreshCart,
}: CheckoutResultProps) => {
  const cartErrorId = useId();

  return (
    <section className="flex w-full max-w-lg flex-col gap-4 rounded-xl bg-white p-5 shadow-(--shadow-base)">
      <h2 role="status" className="text-xl font-bold">
        Заказ №{order.orderNumber} оформлен
      </h2>
      <p className="flex items-baseline justify-between gap-3">
        <span>Итого</span>
        <data value={order.totalPrice} className="font-display text-2xl font-bold tabular-nums">
          {formatPrice(order.totalPrice)}
        </data>
      </p>
      <PickupDetails />
      {cartRefreshStatus === 'pending' && <p role="status">Обновляем корзину…</p>}
      {cartRefreshStatus === 'failed' && (
        <>
          <FormAlert id={cartErrorId}>Заказ оформлен. Не удалось обновить корзину.</FormAlert>
          <Button onClick={onRefreshCart}>Обновить корзину</Button>
        </>
      )}
    </section>
  );
};

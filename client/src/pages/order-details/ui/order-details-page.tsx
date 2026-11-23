import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';

import {
  formatOrderDate,
  ORDER_STATUS_LABELS,
  type OrderDetails,
  orderDetailsQueryOptions,
} from '@/entities/order';
import { useSessionUser } from '@/entities/session';
import { isApiError } from '@/shared/api';
import { routes } from '@/shared/config';
import { formatPrice } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { PageMeta } from '@/shared/ui/page-meta';
import { Receipt } from '@/shared/ui/receipt';

const orderIdPattern =
  /^[\da-f]{8}-[\da-f]{4}-[1-8][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$|^00000000-0000-0000-0000-000000000000$|^ffffffff-ffff-ffff-ffff-ffffffffffff$/i;

const headingClassName = 'font-display text-3xl font-bold wrap-anywhere sm:text-4xl';

const OrderNotFound = () => <h1 className={headingClassName}>Заказ не найден</h1>;

const OrderReceipt = ({ order }: { order: OrderDetails }) => (
  <div className="max-w-2xl space-y-6">
    <header className="space-y-2">
      <h1 className={headingClassName}>Заказ №{order.orderNumber}</h1>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <time dateTime={order.createdAt} className="text-stone-600">
          {formatOrderDate(order.createdAt)}
        </time>
        <span className="rounded-md bg-pickle/60 px-2.5 py-1 font-semibold">
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>
    </header>
    <Receipt.Root>
      <Receipt.Body className="pt-5 pb-7">
        <h2 className="text-lg font-bold">Состав заказа</h2>
        <ul role="list" className="divide-y divide-stone-200">
          {order.items.map((item) => (
            <li
              key={item.lineNumber}
              className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 py-3 first:pt-0 last:pb-0"
            >
              <span className="min-w-0 flex-1 basis-40 font-semibold wrap-anywhere">
                {item.productName}
              </span>
              <span className="text-sm whitespace-nowrap text-stone-600 tabular-nums">
                {item.quantity} × {formatPrice(item.unitPrice)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-dashed border-stone-300 pt-4">
          <span className="font-bold">Итого</span>
          <data value={order.totalPrice} className="font-display text-2xl font-bold tabular-nums">
            {formatPrice(order.totalPrice)}
          </data>
        </div>
      </Receipt.Body>
    </Receipt.Root>
  </div>
);

const OrderDetailsContent = ({ userId, orderId }: { userId: string; orderId: string }) => {
  const query = useQuery(orderDetailsQueryOptions(userId, orderId));

  if (query.isPending) {
    return (
      <div className="space-y-3">
        <h1 className={headingClassName}>Заказ</h1>
        <p role="status">Загружаем заказ…</p>
      </div>
    );
  }

  if (query.isError) {
    if (isApiError(query.error) && query.error.status === 404) return <OrderNotFound />;

    return (
      <div className="space-y-3">
        <h1 className={headingClassName}>Заказ</h1>
        <p role="alert">Не удалось загрузить заказ.</p>
        <Button
          pending={query.isFetching}
          onClick={() => void query.refetch({ cancelRefetch: false })}
        >
          Повторить
        </Button>
      </div>
    );
  }

  return <OrderReceipt order={query.data} />;
};

export const OrderDetailsPage = () => {
  const user = useSessionUser();
  const { id } = useParams<'id'>();

  if (!user) return null;

  return (
    <main className="flex flex-1 bg-paper text-stone-900">
      <PageMeta title="Заказ" noindex />
      <Container className="max-w-260 space-y-3 px-4 pt-7 pb-10 sm:px-8 md:pt-16 md:pb-20">
        <Link
          to={routes.orders}
          className="inline-block rounded-sm text-sm font-semibold underline focus-ring"
        >
          К покупкам
        </Link>
        {id?.length === 36 && orderIdPattern.test(id) ? (
          <OrderDetailsContent userId={user.id} orderId={id} />
        ) : (
          <OrderNotFound />
        )}
      </Container>
    </main>
  );
};

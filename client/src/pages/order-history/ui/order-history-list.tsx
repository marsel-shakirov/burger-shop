import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router';

import { formatOrderDate, ORDER_STATUS_LABELS, orderHistoryQueryOptions } from '@/entities/order';
import { getOrderPath } from '@/shared/config';
import { formatPrice } from '@/shared/lib';
import { Button } from '@/shared/ui/button';

export const OrderHistoryList = ({ userId }: { userId: string }) => {
  const history = useInfiniteQuery(orderHistoryQueryOptions(userId));

  if (!history.data) {
    if (!history.isError) return <p role="status">Загружаем заказы…</p>;

    return (
      <div className="space-y-3">
        <p role="alert">Не удалось загрузить заказы.</p>
        <Button pending={history.isFetching} onClick={() => void history.refetch()}>
          Повторить
        </Button>
      </div>
    );
  }

  const orders = history.data.pages.flatMap((page) => page.items);

  return (
    <div className="max-w-2xl space-y-4">
      {orders.length === 0 ? (
        <p>У вас пока нет заказов.</p>
      ) : (
        <ul
          role="list"
          className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white"
        >
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                to={getOrderPath(order.id)}
                className="group relative flex flex-wrap justify-between gap-x-6 gap-y-2 rounded-lg p-4 focus-ring hover:bg-stone-50 focus-visible:z-10 sm:px-5"
              >
                <div>
                  <h2 className="font-bold group-hover:underline">Заказ №{order.orderNumber}</h2>
                  <time dateTime={order.createdAt} className="text-sm text-stone-600">
                    {formatOrderDate(order.createdAt)}
                  </time>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold tabular-nums">
                    {formatPrice(order.totalPrice)}
                  </p>
                  <p className="text-sm text-stone-600">{ORDER_STATUS_LABELS[order.status]}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {history.isRefetchError && (
        <div className="space-y-3">
          <p role="alert">Не удалось обновить заказы.</p>
          <Button pending={history.isFetching} onClick={() => void history.refetch()}>
            Повторить
          </Button>
        </div>
      )}

      {history.isFetchNextPageError && <p role="alert">Не удалось загрузить следующие заказы.</p>}

      {history.hasNextPage && !history.isRefetchError && (
        <Button
          disabled={history.isFetching}
          pending={history.isFetchingNextPage}
          onClick={() => void history.fetchNextPage({ cancelRefetch: false })}
        >
          {history.isFetchingNextPage
            ? 'Загружаем…'
            : history.isFetchNextPageError
              ? 'Повторить'
              : 'Показать ещё'}
        </Button>
      )}
    </div>
  );
};

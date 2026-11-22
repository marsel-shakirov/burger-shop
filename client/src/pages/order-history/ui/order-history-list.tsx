import { useInfiniteQuery } from '@tanstack/react-query';

import { orderHistoryQueryOptions } from '@/entities/order';
import { formatPrice } from '@/shared/lib';
import { Button } from '@/shared/ui/button';

const statusLabels = {
  new: 'Оформлен',
  accepted: 'Принят',
  ready: 'Готов к выдаче',
  completed: 'Завершён',
  cancelled: 'Отменён',
};

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' });

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
            <li
              key={order.id}
              className="flex flex-wrap justify-between gap-x-6 gap-y-2 p-4 sm:px-5"
            >
              <div>
                <h2 className="font-bold">Заказ №{order.orderNumber}</h2>
                <time dateTime={order.createdAt} className="text-sm text-stone-600">
                  {dateFormatter.format(new Date(order.createdAt))}
                </time>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-bold tabular-nums">
                  {formatPrice(order.totalPrice)}
                </p>
                <p className="text-sm text-stone-600">{statusLabels[order.status]}</p>
              </div>
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

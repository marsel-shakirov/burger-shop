import type { CartEntry } from '@/entities/cart';
import { useProductsById } from '@/entities/product';
import { useSessionUser } from '@/entities/session';
import { LoadError } from '@/shared/ui/load-error';

import type { OrderConfirmation } from '../model/use-checkout-submission';
import { CheckoutContacts, type CheckoutDraft } from './checkout-contacts';
import { type CheckoutLine, CheckoutSummary } from './checkout-summary';

interface CheckoutOrderProps {
  items: CartEntry[];
  onRefreshCart: () => void;
  confirmation: OrderConfirmation;
  draft: CheckoutDraft;
}

export const CheckoutOrder = ({
  items,
  onRefreshCart,
  confirmation,
  draft,
}: CheckoutOrderProps) => {
  const user = useSessionUser();
  const products = useProductsById();

  if (products.isPending || (products.isError && products.isFetching)) {
    return <p role="status">Загружаем состав заказа…</p>;
  }

  if (products.isError) {
    return (
      <LoadError message="Не удалось загрузить товары" onRetry={() => void products.refetch()} />
    );
  }

  const lines = items.flatMap(({ productId, quantity }): CheckoutLine[] => {
    const product = products.data.get(productId);

    return product ? [{ product, quantity, lineTotal: product.price * quantity }] : [];
  });

  if (lines.length !== items.length) {
    if (products.isFetching) return <p role="status">Обновляем состав заказа…</p>;

    return (
      <LoadError
        message="Некоторые товары не найдены в меню. Обновите состав заказа или вернитесь в корзину."
        onRetry={() => {
          onRefreshCart();
          void products.refetch();
        }}
      />
    );
  }

  return (
    <div className="grid w-full max-w-lg gap-5 md:max-w-5xl md:grid-cols-2 md:items-start md:gap-8">
      <CheckoutSummary lines={lines} />
      {user && (
        <CheckoutContacts
          key={user.id}
          userId={user.id}
          isPending={confirmation.isPending}
          needsRetry={confirmation.needsRetry}
          isBlocked={confirmation.isBlocked}
          draft={draft}
          onConfirm={(contacts) =>
            confirmation.submit({
              customerName: contacts.customerName,
              customerPhone: contacts.customerPhone,
              customerComment: contacts.customerComment || undefined,
              items: lines.map(({ product, quantity }) => ({
                productId: product.id,
                quantity,
                unitPrice: product.price,
              })),
            })
          }
        />
      )}
    </div>
  );
};

import { useState } from 'react';
import { Link } from 'react-router';

import { useCartItems, useGuestCartMerge } from '@/entities/cart';
import { useSessionUser } from '@/entities/session';
import { routes } from '@/shared/config';
import { buttonClass } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { LoadError } from '@/shared/ui/load-error';
import { PageMeta } from '@/shared/ui/page-meta';

import { type OrderConfirmation, useCheckoutSubmission } from '../model/use-checkout-submission';
import type { CheckoutDraft } from '../model/use-contact-fields';
import { CheckoutIssue, CheckoutResult } from './checkout-feedback';
import { CheckoutOrder } from './checkout-order';

const CheckoutEmptyCart = () => (
  <>
    <p className="text-stone-600">В корзине пока пусто</p>
    <Link className={buttonClass} to={routes.home}>
      Открыть меню
    </Link>
  </>
);

const CheckoutCart = ({
  confirmation,
  draft,
}: {
  confirmation: OrderConfirmation;
  draft: CheckoutDraft;
}) => {
  const cart = useCartItems();

  if (cart.isPending) return <p role="status">Загружаем корзину…</p>;

  if (cart.isError) {
    return <LoadError message="Не удалось загрузить корзину" onRetry={cart.refetch} />;
  }

  if (cart.items.length === 0) return <CheckoutEmptyCart />;

  return (
    <>
      <CheckoutOrder
        items={cart.items}
        onRefreshCart={cart.refetch}
        confirmation={confirmation}
        draft={draft}
      />
      <Link className={buttonClass} to={routes.cart}>
        Вернуться в корзину
      </Link>
    </>
  );
};

const CheckoutSession = ({ userId }: { userId: string }) => {
  const merge = useGuestCartMerge();
  const submission = useCheckoutSubmission(userId);
  const [draftValues, setDraftValues] = useState<CheckoutDraft['values']>({});
  const draft: CheckoutDraft = {
    values: draftValues,
    updateField: (field, value) => setDraftValues((previous) => ({ ...previous, [field]: value })),
  };

  return (
    <main className="flex flex-1">
      <PageMeta title="Оформление заказа" noindex />
      <Container className="flex flex-col items-start gap-5 pt-4 pb-8 sm:pt-7">
        <h1 className="text-2xl font-bold sm:text-4xl">Оформление заказа</h1>
        <CheckoutIssue submission={submission} />
        {submission.order ? (
          <CheckoutResult
            order={submission.order}
            cartRefreshStatus={submission.cartRefreshStatus}
            onRefreshCart={() => void submission.refreshConfirmedCart()}
          />
        ) : submission.conflictCode === 'cart_empty' ? (
          <CheckoutEmptyCart />
        ) : submission.refreshStatus === 'pending' ||
          submission.refreshStatus === 'failed' ? null : merge.isFetching || merge.isPending ? (
          <p role="status">Подготавливаем корзину…</p>
        ) : merge.isError ? (
          <LoadError
            message="Не удалось перенести гостевую корзину"
            onRetry={() => void merge.refetch()}
          />
        ) : (
          <CheckoutCart confirmation={submission.confirmation} draft={draft} />
        )}
      </Container>
    </main>
  );
};

export const CheckoutPage = () => {
  const user = useSessionUser();

  return user ? <CheckoutSession key={user.id} userId={user.id} /> : null;
};

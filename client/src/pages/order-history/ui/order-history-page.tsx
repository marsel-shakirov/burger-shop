import { Link } from 'react-router';

import { useSessionUser } from '@/entities/session';
import { routes } from '@/shared/config';
import { Container } from '@/shared/ui/container';
import { PageMeta } from '@/shared/ui/page-meta';

import { OrderHistoryList } from './order-history-list';

export const OrderHistoryPage = () => {
  const user = useSessionUser();
  if (!user) return null;

  return (
    <main className="flex flex-1 bg-paper text-stone-900">
      <PageMeta title="Покупки" noindex />
      <Container className="max-w-260 px-4 pt-7 pb-10 sm:px-8 md:pt-16 md:pb-20">
        <Link to={routes.profile} className="rounded-sm text-sm font-semibold underline focus-ring">
          В профиль
        </Link>
        <h1 className="mt-3 mb-6 font-display text-3xl font-bold sm:text-4xl">Покупки</h1>
        <OrderHistoryList key={user.id} userId={user.id} />
      </Container>
    </main>
  );
};

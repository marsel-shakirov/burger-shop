import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link, Navigate } from 'react-router';

import { selectIsGuest, selectUser, useSessionStore } from '@/entities/session';
import { routes } from '@/shared/config';
import { Container } from '@/shared/ui/container';
import { ArrowIcon } from '@/shared/ui/icon';
import { PageMeta } from '@/shared/ui/page-meta';
import { ReceiptCard } from '@/shared/ui/receipt-card';

import { ProfileEditContent } from './profile-edit-content';
import { ProfileEditSkeleton } from './profile-edit-skeleton';
import { ProfileError } from './profile-error';

export const ProfileEditPage = () => {
  const isGuest = useSessionStore(selectIsGuest);
  const user = useSessionStore(selectUser);
  const { reset } = useQueryErrorResetBoundary();

  if (isGuest) {
    return <Navigate to={routes.login} replace />;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-1">
      <PageMeta title="Личные данные" noindex />
      <Container className="flex flex-1 flex-col items-center gap-y-5 pt-14 pb-8 sm:pt-20 sm:pb-12">
        <ReceiptCard className="w-full max-w-sm">
          <Link
            to={routes.profile}
            className="flex items-center gap-x-2 self-start rounded-md px-2 py-1 text-sm font-bold text-stone-500 focus-ring transition-colors duration-150 hover:text-stone-900"
          >
            <ArrowIcon className="size-3" />
            Вернуться
          </Link>
          <ErrorBoundary onReset={reset} resetKeys={[user.id]} FallbackComponent={ProfileError}>
            <Suspense fallback={<ProfileEditSkeleton />}>
              <ProfileEditContent userId={user.id} email={user.email} />
            </Suspense>
          </ErrorBoundary>
        </ReceiptCard>
      </Container>
    </main>
  );
};

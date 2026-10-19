import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { selectUser, useSessionStore } from '@/entities/session';
import { SignOutButton } from '@/features/sign-out';
import { Container } from '@/shared/ui/container';
import { PageMeta } from '@/shared/ui/page-meta';
import { ReceiptCard } from '@/shared/ui/receipt-card';

import { ProfileContent } from './profile-content';
import { ProfileError } from './profile-error';
import { ProfileSkeleton } from './profile-skeleton';

export const ProfilePage = () => {
  const user = useSessionStore(selectUser);
  const { reset } = useQueryErrorResetBoundary();

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-1">
      <PageMeta title="Профиль" noindex />
      <Container className="flex flex-1 flex-col items-center pt-14 pb-8 sm:pt-20 sm:pb-12">
        <ReceiptCard className="w-full max-w-sm" footer={<SignOutButton />}>
          <ErrorBoundary onReset={reset} resetKeys={[user.id]} FallbackComponent={ProfileError}>
            <Suspense fallback={<ProfileSkeleton />}>
              <ProfileContent userId={user.id} />
            </Suspense>
          </ErrorBoundary>
        </ReceiptCard>
      </Container>
    </main>
  );
};

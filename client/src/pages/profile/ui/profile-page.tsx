import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useSessionUser } from '@/entities/session';
import { SignOutButton } from '@/features/sign-out';
import { Container } from '@/shared/ui/container';
import { PageMeta } from '@/shared/ui/page-meta';

import { ProfileContent } from './profile-content';
import { ProfileError } from './profile-error';
import { ProfileSkeleton } from './profile-skeleton';

export const ProfilePage = () => {
  const user = useSessionUser();
  const { reset } = useQueryErrorResetBoundary();

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-1 bg-paper text-stone-900">
      <PageMeta title="Профиль" noindex />
      <Container className="max-w-260 px-4 pt-7 pb-10 sm:px-8 md:pt-16 md:pb-20">
        <ErrorBoundary
          onReset={reset}
          resetKeys={[user.id]}
          fallbackRender={(props) => (
            <div className="max-w-md rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
              <ProfileError {...props} />
            </div>
          )}
        >
          <Suspense fallback={<ProfileSkeleton />}>
            <ProfileContent userId={user.id} />
          </Suspense>
        </ErrorBoundary>
        <SignOutButton className="mt-5 items-start md:mt-7" />
      </Container>
    </main>
  );
};

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router';

import { useSessionUser } from '@/entities/session';
import { routes } from '@/shared/config';
import { Container } from '@/shared/ui/container';
import { ArrowIcon } from '@/shared/ui/icon';
import { PageMeta } from '@/shared/ui/page-meta';

import { ProfileEditContent } from './profile-edit-content';
import { ProfileEditSkeleton } from './profile-edit-skeleton';
import { ProfileError } from './profile-error';

export const ProfileEditPage = () => {
  const user = useSessionUser();
  const { reset } = useQueryErrorResetBoundary();

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-1 bg-paper text-stone-900">
      <PageMeta title="Личные данные" noindex />
      <Container className="max-w-260 px-4 pt-5 pb-10 sm:px-8 md:pt-9 md:pb-20">
        <Link
          to={routes.profile}
          className="mb-3 inline-flex min-h-10 items-center gap-x-2 rounded-sm text-sm font-bold text-stone-600 focus-ring transition-colors duration-150 hover:text-stone-900 md:mb-3.5"
        >
          <ArrowIcon className="size-3" />К профилю
        </Link>
        <ErrorBoundary
          onReset={reset}
          resetKeys={[user.id]}
          fallbackRender={(props) => (
            <div className="max-w-md rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
              <ProfileError {...props} />
            </div>
          )}
        >
          <Suspense fallback={<ProfileEditSkeleton />}>
            <ProfileEditContent userId={user.id} email={user.email} />
          </Suspense>
        </ErrorBoundary>
      </Container>
    </main>
  );
};

import { Navigate } from 'react-router';

import { selectIsAuthenticated, selectIsGuest, useSessionStore } from '@/entities/session';
import { SignOutButton } from '@/features/sign-out';
import { routes } from '@/shared/config';
import { Container } from '@/shared/ui/container';
import { PageMeta } from '@/shared/ui/page-meta';

export const Profile = () => {
  const isGuest = useSessionStore(selectIsGuest);
  const isAuthenticated = useSessionStore(selectIsAuthenticated);

  if (isGuest) {
    return <Navigate to={routes.login} replace />;
  }

  return (
    <main className="flex flex-1">
      <PageMeta title="Профиль" noindex />
      <Container className="flex flex-1 flex-col items-center gap-y-8 py-8 sm:py-12">
        {isAuthenticated && <SignOutButton className="w-full max-w-xs" />}
      </Container>
    </main>
  );
};

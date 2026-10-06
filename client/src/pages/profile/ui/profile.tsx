import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router';

import { profileQueryOptions } from '@/entities/profile';
import { selectIsGuest, selectUser, useSessionStore } from '@/entities/session';
import { EditProfile } from '@/features/edit-profile/ui/edit-profile';
import { SignOutButton } from '@/features/sign-out';
import { routes } from '@/shared/config';
import { Container } from '@/shared/ui/container';
import { PageMeta } from '@/shared/ui/page-meta';

export const Profile = () => {
  const isGuest = useSessionStore(selectIsGuest);
  const user = useSessionStore(selectUser);
  const {
    data: profile,
    isPending,
    isError,
    refetch,
  } = useQuery({
    ...profileQueryOptions(user?.id ?? ''),
    enabled: Boolean(user),
  });

  if (isGuest) {
    return <Navigate to={routes.login} replace />;
  }

  if (!user || isPending) {
    return <div>Loading</div>;
  }

  if (isError) {
    return (
      <div role="alert">
        Не удалось загрузить профиль
        <button type="button" onClick={() => refetch()}>
          Повторить
        </button>
      </div>
    );
  }

  return (
    <main className="flex flex-1">
      <PageMeta title="Профиль" noindex />
      <Container className="flex flex-1 flex-col items-center gap-y-8 py-8 sm:py-12">
        <EditProfile userId={user.id} profile={profile} />
        <SignOutButton className="w-full max-w-xs" />
      </Container>
    </main>
  );
};

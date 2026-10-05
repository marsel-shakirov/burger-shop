import { Navigate } from 'react-router';

import { selectIsGuest, useSessionStore } from '@/entities/session';
import { routes } from '@/shared/config';
import { PageMeta } from '@/shared/ui/page-meta';
import { UnderConstruction } from '@/shared/ui/under-construction';

export const Profile = () => {
  const isGuest = useSessionStore(selectIsGuest);

  if (isGuest) {
    return <Navigate to={routes.login} replace />;
  }

  return (
    <>
      <PageMeta title="Профиль" noindex />
      <UnderConstruction />
    </>
  );
};

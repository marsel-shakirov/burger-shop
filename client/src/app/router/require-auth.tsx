import { Navigate, Outlet } from 'react-router';

import { selectIsGuest, useSessionStore } from '@/entities/session';
import { routes } from '@/shared/config';

export const RequireAuth = () => {
  const isGuest = useSessionStore(selectIsGuest);

  if (isGuest) {
    return <Navigate to={routes.login} replace />;
  }

  return <Outlet />;
};

import { Navigate, Outlet } from 'react-router';

import { selectIsAuthenticated, useSessionStore } from '@/entities/session';
import { routes } from '@/shared/config';

export const RequireGuest = () => {
  const isAuthenticated = useSessionStore(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={routes.profile} replace />;
  }

  return <Outlet />;
};

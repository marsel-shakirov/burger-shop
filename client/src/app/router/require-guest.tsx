import { Navigate, Outlet } from 'react-router';

import { useIsAuthenticated } from '@/entities/session';
import { routes } from '@/shared/config';

export const RequireGuest = () => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to={routes.profile} replace />;
  }

  return <Outlet />;
};

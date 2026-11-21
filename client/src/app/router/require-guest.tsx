import { Navigate, Outlet, useSearchParams } from 'react-router';

import { useSessionStatus } from '@/entities/session';
import { routes } from '@/shared/config';

export const RequireGuest = () => {
  const status = useSessionStatus();
  const [searchParams] = useSearchParams();

  if (status === 'loading') {
    return null;
  }

  if (status === 'authenticated') {
    const next = searchParams.get('next') === 'checkout' ? routes.checkout : routes.profile;
    return <Navigate to={next} replace />;
  }

  return <Outlet />;
};

import { useQuery } from '@tanstack/react-query';

import { useSessionStatus, useSessionUser } from '@/entities/session/@x/bonus';

import { bonusQueryOptions } from '../api/bonus-query-options';

export const useBonus = () => {
  const status = useSessionStatus();
  const user = useSessionUser();
  const query = useQuery({
    ...bonusQueryOptions(user?.id ?? ''),
    enabled: status === 'authenticated',
  });

  if (status === 'guest') {
    return { bonus: undefined, isPending: false, isError: false };
  }

  return { bonus: query.data, isPending: query.isPending, isError: query.isLoadingError };
};

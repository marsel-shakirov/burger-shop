import { queryOptions } from '@tanstack/react-query';

import { getProfile } from './get-profile';

export const profileQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['profile', userId],
    queryFn: ({ signal }) => getProfile({ signal }),
    staleTime: 1000 * 60 * 5,
  });

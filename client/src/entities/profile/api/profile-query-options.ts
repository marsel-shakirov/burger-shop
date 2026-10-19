import { queryOptions } from '@tanstack/react-query';

import { getProfile } from './get-profile';

export const PROFILE_QUERY_KEY = ['profile'] as const;

export const profileQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: [...PROFILE_QUERY_KEY, userId],
    queryFn: ({ signal }) => getProfile({ signal }),
    staleTime: 1000 * 60 * 5,
  });

import { type QueryClient, queryOptions } from '@tanstack/react-query';

import { authFetch, createApiError, readJson, type RequestOptions } from '@/shared/api';

import type { Profile } from '../model/profile.types';

const PROFILE_QUERY_KEY = ['profile'] as const;

const getProfile = async ({ signal }: RequestOptions = {}): Promise<Profile> => {
  const response = await authFetch('/api/profile', { signal });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return readJson<Profile>(response);
};

export const profileQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: [...PROFILE_QUERY_KEY, userId],
    queryFn: ({ signal }) => getProfile({ signal }),
    staleTime: 1000 * 60 * 5,
  });

export const removeProfileQueries = (queryClient: QueryClient) =>
  queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });

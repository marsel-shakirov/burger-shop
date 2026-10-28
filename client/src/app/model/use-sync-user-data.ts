import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { subscribeSessionUser } from '@/entities/session';

import { syncUserData } from './sync-user-data';

export const useSyncUserData = () => {
  const queryClient = useQueryClient();

  useEffect(
    () => subscribeSessionUser((user, prevUser) => syncUserData(queryClient, user, prevUser)),
    [queryClient],
  );
};

import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';

import { cartQueryOptions } from '@/entities/cart';
import { getSessionState } from '@/entities/session';

type CartRefreshStatus = 'idle' | 'pending' | 'failed';

export const useConfirmedCartRefresh = (userId: string) => {
  const queryClient = useQueryClient();
  const refreshing = useRef(false);
  const [cartRefreshStatus, setStatus] = useState<CartRefreshStatus>('idle');

  const refreshConfirmedCart = async () => {
    if (refreshing.current || getSessionState().user?.id !== userId) return;

    refreshing.current = true;
    setStatus('pending');
    const options = cartQueryOptions(userId);
    const target = { queryKey: options.queryKey, exact: true };

    try {
      await queryClient.cancelQueries(target);
      await queryClient.invalidateQueries({ ...target, refetchType: 'none' });
      if (getSessionState().user?.id !== userId) return;

      await queryClient.query({ ...options, retry: false });
      setStatus('idle');
    } catch {
      setStatus('failed');
    } finally {
      refreshing.current = false;
    }
  };

  return { cartRefreshStatus, refreshConfirmedCart };
};

import type { PropsWithChildren } from 'react';

import { useSessionSync } from '@/entities/session';
import { useSyncUserData } from '@/features/sync-user-data';

export function SessionProvider({ children }: PropsWithChildren) {
  useSessionSync();
  useSyncUserData();

  return children;
}

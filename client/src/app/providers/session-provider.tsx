import type { PropsWithChildren } from 'react';

import { useCartStorageSync } from '@/entities/cart';
import { useSessionSync } from '@/entities/session';

import { useSyncUserData } from '../model/use-sync-user-data';

export function SessionProvider({ children }: PropsWithChildren) {
  useSessionSync();
  useSyncUserData();
  useCartStorageSync();

  return children;
}

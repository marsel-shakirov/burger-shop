import { useEffect } from 'react';

import { CART_STORAGE_KEY } from '../config/cart.constants';
import { useCartStore } from './cart.store';

export const useCartStorageSync = () => {
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) {
        void useCartStore.persist.rehydrate();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, []);
};

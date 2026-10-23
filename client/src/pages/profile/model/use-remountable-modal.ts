import { useState } from 'react';

export const useRemountableModal = () => {
  const [state, setState] = useState({ open: false, key: 0 });

  const openModal = () => setState((prev) => ({ open: true, key: prev.key + 1 }));

  const closeModal = () => setState((prev) => ({ ...prev, open: false }));

  return { ...state, openModal, closeModal };
};

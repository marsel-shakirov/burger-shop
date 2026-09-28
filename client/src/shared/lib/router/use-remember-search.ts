import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { selectSaveSearch, useLastSearchStore } from './last-search.store';

export const useRememberSearch = () => {
  const { pathname, search } = useLocation();
  const saveSearch = useLastSearchStore(selectSaveSearch);

  useEffect(() => {
    saveSearch(pathname, search);
  }, [pathname, search, saveSearch]);
};

import { selectLastSearch, useLastSearchStore } from './last-search.store';

export const useLastSearch = (pathname: string) => useLastSearchStore(selectLastSearch(pathname));

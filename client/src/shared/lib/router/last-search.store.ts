import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface LastSearchState {
  searchByPath: Record<string, string>;
  saveSearch: (pathname: string, search: string) => void;
}

export const useLastSearchStore = create<LastSearchState>()(
  devtools(
    (set) => ({
      searchByPath: {},
      saveSearch: (pathname, search) =>
        set((state) =>
          state.searchByPath[pathname] === search
            ? state
            : { searchByPath: { ...state.searchByPath, [pathname]: search } },
        ),
    }),
    { name: 'last-search-store' },
  ),
);

export const selectSearchByPath = (state: LastSearchState) => state.searchByPath;

export const selectSaveSearch = (state: LastSearchState) => state.saveSearch;

export const selectLastSearch = (pathname: string) => (state: LastSearchState) =>
  state.searchByPath[pathname] ?? '';

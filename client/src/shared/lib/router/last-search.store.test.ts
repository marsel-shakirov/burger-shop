import { beforeEach, describe, expect, it, vi } from 'vitest';

import { selectLastSearch, selectSearchByPath, useLastSearchStore } from './last-search.store';

beforeEach(() => {
  useLastSearchStore.setState(useLastSearchStore.getInitialState(), true);
});

describe('saveSearch', () => {
  it('сохраняет search для пути', () => {
    useLastSearchStore.getState().saveSearch('/', '?menu=burgers');

    expect(selectSearchByPath(useLastSearchStore.getState())).toEqual({ '/': '?menu=burgers' });
  });

  it('перезаписывает search для того же пути', () => {
    useLastSearchStore.getState().saveSearch('/', '?menu=burgers');
    useLastSearchStore.getState().saveSearch('/', '?menu=drinks');

    expect(selectSearchByPath(useLastSearchStore.getState())).toEqual({ '/': '?menu=drinks' });
  });

  it('хранит search разных путей независимо', () => {
    useLastSearchStore.getState().saveSearch('/', '?menu=burgers');
    useLastSearchStore.getState().saveSearch('/favorite', '?sort=price');

    expect(selectSearchByPath(useLastSearchStore.getState())).toEqual({
      '/': '?menu=burgers',
      '/favorite': '?sort=price',
    });
  });

  it('сохраняет пустой search', () => {
    useLastSearchStore.getState().saveSearch('/', '?menu=burgers');
    useLastSearchStore.getState().saveSearch('/', '');

    expect(selectSearchByPath(useLastSearchStore.getState())).toEqual({ '/': '' });
  });

  it('не мутирует предыдущий объект', () => {
    useLastSearchStore.getState().saveSearch('/', '?menu=burgers');
    const before = selectSearchByPath(useLastSearchStore.getState());

    useLastSearchStore.getState().saveSearch('/', '?menu=drinks');

    expect(before).toEqual({ '/': '?menu=burgers' });
  });

  it('при том же значении сохраняет состояние и не уведомляет подписчиков', () => {
    useLastSearchStore.getState().saveSearch('/', '?menu=burgers');
    const before = useLastSearchStore.getState();
    const listener = vi.fn();
    const unsubscribe = useLastSearchStore.subscribe(listener);

    useLastSearchStore.getState().saveSearch('/', '?menu=burgers');
    unsubscribe();

    expect(useLastSearchStore.getState()).toBe(before);
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('selectLastSearch', () => {
  it('возвращает сохранённый search для пути', () => {
    useLastSearchStore.getState().saveSearch('/', '?menu=burgers');

    expect(selectLastSearch('/')(useLastSearchStore.getState())).toBe('?menu=burgers');
  });

  it('возвращает пустую строку для пути без сохранённого search', () => {
    useLastSearchStore.getState().saveSearch('/', '?menu=burgers');

    expect(selectLastSearch('/cart')(useLastSearchStore.getState())).toBe('');
  });
});

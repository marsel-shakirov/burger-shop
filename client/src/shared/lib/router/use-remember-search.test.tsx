import { act, renderHook } from '@testing-library/react';
import { useNavigate } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';

import { createWrapper } from '@/shared/testing';

import { useLastSearchStore } from './last-search.store';
import { useLastSearch } from './use-last-search';
import { useRememberSearch } from './use-remember-search';

const getSearchByPath = () => useLastSearchStore.getState().searchByPath;

const render = (initialEntry: string) =>
  renderHook(
    () => {
      useRememberSearch();

      return { navigate: useNavigate(), lastHomeSearch: useLastSearch('/') };
    },
    { wrapper: createWrapper({ initialEntries: [initialEntry] }) },
  );

beforeEach(() => {
  useLastSearchStore.setState(useLastSearchStore.getInitialState(), true);
});

describe('useRememberSearch', () => {
  it('запоминает search текущего пути при монтировании', () => {
    render('/?menu=drinks');

    expect(getSearchByPath()).toEqual({ '/': '?menu=drinks' });
  });

  it('обновляет search при смене параметров', async () => {
    const { result } = render('/?menu=drinks');

    await act(() => result.current.navigate('/?menu=burgers'));

    expect(getSearchByPath()).toEqual({ '/': '?menu=burgers' });
  });

  it('хранит search каждого пути и не теряет предыдущий при переходе', async () => {
    const { result } = render('/?menu=drinks');

    await act(() => result.current.navigate('/favorites?sort=price'));

    expect(getSearchByPath()).toEqual({ '/': '?menu=drinks', '/favorites': '?sort=price' });
  });

  it('запоминает пустой search', async () => {
    const { result } = render('/?menu=drinks');

    await act(() => result.current.navigate('/'));

    expect(getSearchByPath()).toEqual({ '/': '' });
  });
});

describe('useLastSearch', () => {
  it('возвращает запомненный search пути и обновляется вместе с ним', async () => {
    const { result } = render('/?menu=drinks');

    expect(result.current.lastHomeSearch).toBe('?menu=drinks');

    await act(() => result.current.navigate('/?menu=burgers'));

    expect(result.current.lastHomeSearch).toBe('?menu=burgers');
  });

  it('возвращает пустую строку для пути, где пользователь ещё не был', () => {
    const { result } = render('/favorites');

    expect(result.current.lastHomeSearch).toBe('');
  });
});

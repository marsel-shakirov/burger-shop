import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useRemountableModal } from './use-remountable-modal';

describe('useRemountableModal', () => {
  it('начинает с закрытой модалки', () => {
    const { result } = renderHook(useRemountableModal);

    expect(result.current).toMatchObject({ open: false, key: 0 });
  });

  it('открывает модалку с новым ключом', () => {
    const { result } = renderHook(useRemountableModal);

    act(() => result.current.openModal());

    expect(result.current).toMatchObject({ open: true, key: 1 });
  });

  it('закрывает модалку, сохраняя ключ', () => {
    const { result } = renderHook(useRemountableModal);
    act(() => result.current.openModal());

    act(() => result.current.closeModal());

    expect(result.current).toMatchObject({ open: false, key: 1 });
  });

  it('каждое открытие даёт новый ключ, чтобы форма монтировалась заново', () => {
    const { result } = renderHook(useRemountableModal);

    act(() => result.current.openModal());
    act(() => result.current.closeModal());
    act(() => result.current.openModal());

    expect(result.current).toMatchObject({ open: true, key: 2 });
  });

  it('повторное открытие уже открытой модалки тоже меняет ключ', () => {
    const { result } = renderHook(useRemountableModal);

    act(() => result.current.openModal());
    act(() => result.current.openModal());

    expect(result.current.key).toBe(2);
  });
});

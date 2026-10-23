import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useIsStuck } from './use-is-stuck';

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

const observers: Array<{
  callback: Callback;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}> = [];

class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(callback: Callback) {
    observers.push({ callback, observe: this.observe, disconnect: this.disconnect });
  }
}

const notify = (top: number) =>
  act(() => observers.at(-1)?.callback([{ boundingClientRect: { top } as DOMRectReadOnly }]));

const render = (sentinel: Element | null) =>
  renderHook(({ sentinel }) => useIsStuck(sentinel), { initialProps: { sentinel } });

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
});

afterEach(() => {
  observers.length = 0;
  vi.unstubAllGlobals();
});

describe('useIsStuck', () => {
  it('без элемента не создаёт наблюдатель и возвращает false', () => {
    const { result } = render(null);

    expect(observers).toHaveLength(0);
    expect(result.current).toBe(false);
  });

  it('наблюдает за элементом-маркером', () => {
    const sentinel = document.createElement('div');

    render(sentinel);

    expect(observers[0]?.observe).toHaveBeenCalledExactlyOnceWith(sentinel);
  });

  it('возвращает true, когда маркер ушёл вверх за экран', () => {
    const { result } = render(document.createElement('div'));

    notify(-1);

    expect(result.current).toBe(true);
  });

  it('возвращает false, когда маркер снова виден или ниже экрана', () => {
    const { result } = render(document.createElement('div'));

    notify(-10);
    notify(0);

    expect(result.current).toBe(false);
  });

  it('игнорирует пустой список записей', () => {
    const { result } = render(document.createElement('div'));

    notify(-10);
    act(() => observers[0]?.callback([]));

    expect(result.current).toBe(true);
  });

  it('отключает наблюдатель при размонтировании', () => {
    const { unmount } = render(document.createElement('div'));

    unmount();

    expect(observers[0]?.disconnect).toHaveBeenCalledOnce();
  });

  it('при смене маркера отключает старый наблюдатель и создаёт новый', () => {
    const next = document.createElement('div');
    const { rerender } = render(document.createElement('div'));

    rerender({ sentinel: next });

    expect(observers[0]?.disconnect).toHaveBeenCalledOnce();
    expect(observers[1]?.observe).toHaveBeenCalledExactlyOnceWith(next);
  });
});

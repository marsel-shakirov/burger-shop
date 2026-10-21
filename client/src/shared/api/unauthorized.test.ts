import { afterEach, describe, expect, it, vi } from 'vitest';

import { notifyUnauthorized, onUnauthorized } from './unauthorized';

const unsubscribers: Array<() => void> = [];

const subscribe = (listener: () => void) => {
  const unsubscribe = onUnauthorized(listener);
  unsubscribers.push(unsubscribe);
  return unsubscribe;
};

afterEach(() => {
  unsubscribers.splice(0).forEach((unsubscribe) => unsubscribe());
});

describe('notifyUnauthorized', () => {
  it('не падает, если подписчиков нет', () => {
    expect(() => notifyUnauthorized()).not.toThrow();
  });

  it('вызывает подписчика без аргументов', () => {
    const listener = vi.fn();
    subscribe(listener);

    notifyUnauthorized();

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith();
  });

  it('вызывает всех подписчиков в порядке подписки', () => {
    const calls: string[] = [];
    subscribe(() => calls.push('session'));
    subscribe(() => calls.push('cart'));

    notifyUnauthorized();

    expect(calls).toEqual(['session', 'cart']);
  });

  it('вызывает подписчика при каждом оповещении', () => {
    const listener = vi.fn();
    subscribe(listener);

    notifyUnauthorized();
    notifyUnauthorized();

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('вызывает один раз функцию, подписанную дважды', () => {
    const listener = vi.fn();
    subscribe(listener);
    subscribe(listener);

    notifyUnauthorized();

    expect(listener).toHaveBeenCalledOnce();
  });
});

describe('onUnauthorized: отписка', () => {
  it('после отписки подписчик больше не вызывается', () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    unsubscribe();
    notifyUnauthorized();

    expect(listener).not.toHaveBeenCalled();
  });

  it('отписывает только своего подписчика', () => {
    const first = vi.fn();
    const second = vi.fn();
    const unsubscribeFirst = subscribe(first);
    subscribe(second);

    unsubscribeFirst();
    notifyUnauthorized();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
  });

  it('повторная отписка ничего не ломает', () => {
    const listener = vi.fn();
    const other = vi.fn();
    const unsubscribe = subscribe(listener);
    subscribe(other);

    unsubscribe();
    unsubscribe();
    notifyUnauthorized();

    expect(listener).not.toHaveBeenCalled();
    expect(other).toHaveBeenCalledOnce();
  });

  it('подписку можно вернуть из useEffect: отписка ничего не возвращает', () => {
    const unsubscribe = subscribe(vi.fn());

    expect(unsubscribe()).toBeUndefined();
  });

  it('подписчик может отписаться во время оповещения, не мешая остальным', () => {
    const second = vi.fn();
    const unsubscribeFirst = subscribe(() => unsubscribeFirst());
    subscribe(second);

    notifyUnauthorized();
    notifyUnauthorized();

    expect(second).toHaveBeenCalledTimes(2);
  });

  it('подписчик, отписавшийся во время оповещения, больше не вызывается', () => {
    const listener = vi.fn(() => unsubscribe());
    const unsubscribe = subscribe(listener);

    notifyUnauthorized();
    notifyUnauthorized();

    expect(listener).toHaveBeenCalledOnce();
  });
});

import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { authFetch } from '@/shared/api';

import { getSession } from '../api/get-session';
import { useSessionStore } from './session.store';
import type { SessionUser } from './session.types';
import { useSessionSync } from './use-session-sync';

vi.mock('../api/get-session', () => ({ getSession: vi.fn() }));

const channels: BroadcastChannelMock[] = [];

class BroadcastChannelMock {
  onmessage: ((event: MessageEvent<SessionUser | null>) => void) | null = null;
  postMessage = vi.fn();
  close = vi.fn();
  name: string;

  constructor(name: string) {
    this.name = name;
    channels.push(this);
  }
}

const user: SessionUser = { id: 'user-1', email: 'user@example.com' };

const otherUser: SessionUser = { id: 'user-2', email: 'other@example.com' };

const getSessionMock = vi.mocked(getSession);

const getState = () => useSessionStore.getState();

const getChannel = () => {
  const channel = channels[0];

  if (!channel) throw new Error('BroadcastChannel не создан');

  return channel;
};

const receiveFromOtherTab = (data: SessionUser | null) =>
  act(() => getChannel().onmessage?.(new MessageEvent('message', { data })));

const setVisibility = (state: DocumentVisibilityState) => {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true });
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });
};

const createDeferred = <T,>() => {
  let resolve: (value: T) => void = () => {};
  const promise = new Promise<T>((done) => {
    resolve = done;
  });

  return { promise, resolve };
};

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

const renderSynced = async (initialUser: SessionUser | null = null) => {
  getSessionMock.mockResolvedValueOnce(initialUser);
  const view = renderHook(useSessionSync);
  await waitFor(() => expect(getState().status).not.toBe('loading'));
  getSessionMock.mockClear();

  return view;
};

beforeEach(() => {
  useSessionStore.setState(useSessionStore.getInitialState(), true);
  vi.stubGlobal('BroadcastChannel', BroadcastChannelMock);
});

afterEach(() => {
  channels.length = 0;
  Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('useSessionSync: первичная загрузка', () => {
  it('запрашивает сессию с сигналом отмены', () => {
    getSessionMock.mockReturnValue(new Promise(() => {}));

    renderHook(useSessionSync);

    expect(getSessionMock).toHaveBeenCalledOnce();
    expect(getSessionMock.mock.calls[0]?.[0]?.signal).toBeInstanceOf(AbortSignal);
    expect(getState().status).toBe('loading');
  });

  it('записывает пользователя из ответа', async () => {
    getSessionMock.mockResolvedValue(user);

    renderHook(useSessionSync);

    await waitFor(() => expect(getState()).toMatchObject({ user, status: 'authenticated' }));
  });

  it('без сессии переводит в статус guest', async () => {
    getSessionMock.mockResolvedValue(null);

    renderHook(useSessionSync);

    await waitFor(() => expect(getState()).toMatchObject({ user: null, status: 'guest' }));
  });

  it('при ошибке запроса переводит в статус guest', async () => {
    getSessionMock.mockRejectedValue(new Error('Network error'));

    renderHook(useSessionSync);

    await waitFor(() => expect(getState().status).toBe('guest'));
  });

  it('при размонтировании отменяет запрос и не меняет статус', async () => {
    getSessionMock.mockImplementation(
      ({ signal } = {}) =>
        new Promise((_resolve, reject) => {
          signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        }),
    );
    const { unmount } = renderHook(useSessionSync);
    const signal = getSessionMock.mock.calls[0]?.[0]?.signal;

    unmount();
    await flushPromises();

    expect(signal?.aborted).toBe(true);
    expect(getState().status).toBe('loading');
  });
});

describe('useSessionSync: возврат на вкладку', () => {
  it('перепроверяет сессию и применяет изменения', async () => {
    await renderSynced(user);
    getSessionMock.mockResolvedValue(null);

    setVisibility('visible');

    await waitFor(() => expect(getState()).toMatchObject({ user: null, status: 'guest' }));
  });

  it('не трогает состояние, если сессия не изменилась', async () => {
    await renderSynced(user);
    const before = getState();
    getSessionMock.mockResolvedValue({ ...user });

    setVisibility('visible');

    await waitFor(() => expect(getSessionMock).toHaveBeenCalledOnce());
    await flushPromises();
    expect(getState()).toBe(before);
  });

  it('не перепроверяет, когда вкладка скрывается', async () => {
    await renderSynced(user);

    setVisibility('hidden');

    expect(getSessionMock).not.toHaveBeenCalled();
  });

  it('игнорирует ответ, если пользователь сменился, пока шёл запрос', async () => {
    await renderSynced(null);
    const response = createDeferred<SessionUser | null>();
    getSessionMock.mockReturnValue(response.promise);

    setVisibility('visible');
    act(() => getState().setUser(user));
    response.resolve(null);
    await act(() => response.promise);

    expect(getState()).toMatchObject({ user, status: 'authenticated' });
  });

  it('при ошибке перепроверки оставляет текущего пользователя', async () => {
    await renderSynced(user);
    getSessionMock.mockRejectedValue(new Error('Network error'));

    setVisibility('visible');

    await waitFor(() => expect(getSessionMock).toHaveBeenCalledOnce());
    await flushPromises();
    expect(getState()).toMatchObject({ user, status: 'authenticated' });
  });
});

describe('useSessionSync: синхронизация вкладок', () => {
  it('открывает канал session', async () => {
    await renderSynced();

    expect(getChannel().name).toBe('session');
  });

  it('сообщает другим вкладкам о входе и выходе', async () => {
    await renderSynced();

    act(() => getState().setUser(user));
    act(() => getState().setUser(null));

    expect(getChannel().postMessage.mock.calls).toEqual([[user], [null]]);
  });

  it('не сообщает, если пользователь не изменился по id и email', async () => {
    await renderSynced(user);
    getChannel().postMessage.mockClear();

    act(() => getState().setUser({ ...user }));

    expect(getChannel().postMessage).not.toHaveBeenCalled();
  });

  it('применяет пользователя из другой вкладки и не отправляет его обратно', async () => {
    await renderSynced();

    receiveFromOtherTab(otherUser);

    expect(getState()).toMatchObject({ user: otherUser, status: 'authenticated' });
    expect(getChannel().postMessage).not.toHaveBeenCalled();
  });

  it('применяет выход из другой вкладки', async () => {
    await renderSynced(user);
    getChannel().postMessage.mockClear();

    receiveFromOtherTab(null);

    expect(getState()).toMatchObject({ user: null, status: 'guest' });
    expect(getChannel().postMessage).not.toHaveBeenCalled();
  });

  it('игнорирует сообщение с тем же пользователем', async () => {
    await renderSynced(user);
    const before = getState();

    receiveFromOtherTab({ ...user });

    expect(getState()).toBe(before);
  });

  it('применяет сообщение, пришедшее до ответа своей сессии', () => {
    getSessionMock.mockReturnValue(new Promise(() => {}));
    renderHook(useSessionSync);

    receiveFromOtherTab(null);

    expect(getState().status).toBe('guest');
  });
});

describe('useSessionSync: потеря авторизации', () => {
  it('при ответе 401 переводит в статус guest', async () => {
    await renderSynced(user);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 401 })));

    await act(() => authFetch('/api/cart'));

    expect(getState()).toMatchObject({ user: null, status: 'guest' });
  });
});

describe('useSessionSync: размонтирование', () => {
  it('закрывает канал и перестаёт реагировать на события', async () => {
    const { unmount } = await renderSynced(user);
    const channel = getChannel();
    channel.postMessage.mockClear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 401 })));

    unmount();
    setVisibility('visible');
    await authFetch('/api/cart');
    act(() => getState().setUser(otherUser));

    expect(channel.close).toHaveBeenCalledOnce();
    expect(getSessionMock).not.toHaveBeenCalled();
    expect(channel.postMessage).not.toHaveBeenCalled();
    expect(getState().user).toBe(otherUser);
  });
});

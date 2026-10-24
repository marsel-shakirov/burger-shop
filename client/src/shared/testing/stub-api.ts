import { vi } from 'vitest';

type ApiHandler = (url: URL, init?: RequestInit) => Response | Promise<Response>;

export type ApiHandlers = Record<string, ApiHandler>;

export const json =
  (body: unknown, status = 200): ApiHandler =>
  () =>
    Response.json(body, { status });

export const status =
  (code: number): ApiHandler =>
  () =>
    new Response(null, { status: code });

export const pending: ApiHandler = () => new Promise(() => {});

export const stubApi = (handlers: ApiHandlers) => {
  const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : String(input), 'http://localhost');
    const handler = handlers[`${init?.method ?? 'GET'} ${url.pathname}`];

    return Promise.resolve(handler ? handler(url, init) : new Response(null, { status: 404 }));
  });

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
};

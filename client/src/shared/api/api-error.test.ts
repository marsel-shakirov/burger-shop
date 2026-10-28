import { describe, expect, it } from 'vitest';

import { ApiError, createApiError, isApiError, isNetworkError } from './api-error';

const jsonResponse = (body: unknown, status = 400) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('ApiError', () => {
  it('сохраняет статус, сообщение, код и причины', () => {
    const error = new ApiError(400, {
      message: 'Password is too weak',
      code: 'weak_password',
      reasons: ['length', 'pwned'],
    });

    expect(error.status).toBe(400);
    expect(error.message).toBe('Password is too weak');
    expect(error.code).toBe('weak_password');
    expect(error.reasons).toEqual(['length', 'pwned']);
  });

  it('называется ApiError и наследует Error', () => {
    const error = new ApiError(500);

    expect(error.name).toBe('ApiError');
    expect(error).toBeInstanceOf(Error);
  });

  it('собирает сообщение из статуса, если тело пустое', () => {
    const error = new ApiError(503);

    expect(error.message).toBe('Request failed with status 503');
    expect(error.code).toBeUndefined();
    expect(error.reasons).toBeUndefined();
  });

  it('собирает сообщение из статуса, если в теле нет message', () => {
    expect(new ApiError(404, { code: 'not_found' }).message).toBe('Request failed with status 404');
  });

  it('оставляет пустое сообщение с сервера как есть', () => {
    expect(new ApiError(400, { message: '' }).message).toBe('');
  });
});

describe('isApiError', () => {
  it('узнаёт ApiError', () => {
    expect(isApiError(new ApiError(400))).toBe(true);
  });

  it.each([
    ['обычная ошибка', new Error('boom')],
    ['сетевая ошибка', new TypeError('Failed to fetch')],
    ['объект с полями ApiError', { name: 'ApiError', status: 400, code: 'weak_password' }],
    ['строка', 'ApiError'],
    ['null', null],
    ['undefined', undefined],
  ])('не принимает за ApiError: %s', (_case, error) => {
    expect(isApiError(error)).toBe(false);
  });
});

describe('isNetworkError', () => {
  it('считает TypeError из fetch сетевой ошибкой', () => {
    expect(isNetworkError(new TypeError('Failed to fetch'))).toBe(true);
  });

  it.each([
    ['ApiError', new ApiError(500)],
    ['обычная ошибка', new Error('boom')],
    ['отмена запроса', new DOMException('The operation was aborted', 'AbortError')],
    ['таймаут', new DOMException('The operation timed out', 'TimeoutError')],
    ['строка', 'Failed to fetch'],
    ['null', null],
    ['undefined', undefined],
  ])('не считает сетевой ошибкой: %s', (_case, error) => {
    expect(isNetworkError(error)).toBe(false);
  });
});

describe('createApiError', () => {
  it('берёт статус из ответа, а сообщение, код и причины из тела', async () => {
    const error = await createApiError(
      jsonResponse(
        { message: 'Password is too weak', code: 'weak_password', reasons: ['pwned'] },
        422,
      ),
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(422);
    expect(error.message).toBe('Password is too weak');
    expect(error.code).toBe('weak_password');
    expect(error.reasons).toEqual(['pwned']);
  });

  it('создаёт ошибку по статусу, если тело пустой объект', async () => {
    const error = await createApiError(jsonResponse({}, 500));

    expect(error.status).toBe(500);
    expect(error.message).toBe('Request failed with status 500');
    expect(error.code).toBeUndefined();
  });

  it.each([
    ['пустое тело', ''],
    ['HTML вместо JSON', '<html><body>Bad Gateway</body></html>'],
    ['обрезанный JSON', '{"message": "Bad'],
    ['JSON null', 'null'],
    ['JSON-строка', '"Bad Gateway"'],
    ['JSON-число', '502'],
  ])('не падает, если в ответе %s', async (_case, body) => {
    const error = await createApiError(new Response(body, { status: 502 }));

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(502);
    expect(error.message).toBe('Request failed with status 502');
    expect(error.code).toBeUndefined();
  });

  it('не падает на ответе без тела', async () => {
    const error = await createApiError(new Response(null, { status: 401 }));

    expect(error.status).toBe(401);
    expect(error.message).toBe('Request failed with status 401');
  });

  it('создаёт ошибку, которую узнаёт isApiError, а не isNetworkError', async () => {
    const error = await createApiError(new Response('', { status: 502 }));

    expect(isApiError(error)).toBe(true);
    expect(isNetworkError(error)).toBe(false);
  });
});

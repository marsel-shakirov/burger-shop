import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { isPasswordPwned } from './pwned-passwords.ts';

const PASSWORD = 'password';
const HASH_PREFIX = '5BAA6';
const HASH_SUFFIX = '1E4C9B93F3F0682250B6CF8331B7EE68FD8';

const fetchMock = vi.fn<typeof fetch>();

const rangeResponse = (...lines: string[]) => new Response(lines.join('\r\n'));

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('isPasswordPwned', () => {
  it('запрашивает диапазон по первым пяти символам SHA-1 с паддингом и таймаутом', async () => {
    fetchMock.mockResolvedValue(rangeResponse());

    await isPasswordPwned(PASSWORD);

    expect(fetchMock).toHaveBeenCalledWith(`https://api.pwnedpasswords.com/range/${HASH_PREFIX}`, {
      headers: { 'Add-Padding': 'true' },
      signal: expect.any(AbortSignal),
    });
  });

  it('возвращает true, если суффикс хеша есть в ответе', async () => {
    fetchMock.mockResolvedValue(
      rangeResponse('0018A45C4D1DEF81644B54AB7F969B88D65:1', `${HASH_SUFFIX}:10434004`),
    );

    await expect(isPasswordPwned(PASSWORD)).resolves.toBe(true);
  });

  it('возвращает false, если суффикса хеша нет в ответе', async () => {
    fetchMock.mockResolvedValue(rangeResponse('0018A45C4D1DEF81644B54AB7F969B88D65:1'));

    await expect(isPasswordPwned(PASSWORD)).resolves.toBe(false);
  });

  it('возвращает false, если суффикс пришёл только как паддинг с нулевым счётчиком', async () => {
    fetchMock.mockResolvedValue(rangeResponse(`${HASH_SUFFIX}:0`));

    await expect(isPasswordPwned(PASSWORD)).resolves.toBe(false);
  });

  it('пропускает проверку и предупреждает, если сервис ответил ошибкой', async () => {
    fetchMock.mockResolvedValue(new Response('', { status: 503 }));

    await expect(isPasswordPwned(PASSWORD)).resolves.toBe(false);
    expect(console.warn).toHaveBeenCalledWith('Pwned Passwords check skipped: HTTP 503');
  });

  it.each([
    ['сетевая ошибка', new TypeError('fetch failed')],
    ['таймаут', new DOMException('The operation timed out', 'TimeoutError')],
  ])('пропускает проверку и предупреждает, если запрос упал: %s', async (_case, error) => {
    fetchMock.mockRejectedValue(error);

    await expect(isPasswordPwned(PASSWORD)).resolves.toBe(false);
    expect(console.warn).toHaveBeenCalledWith('Pwned Passwords check skipped', error);
  });
});

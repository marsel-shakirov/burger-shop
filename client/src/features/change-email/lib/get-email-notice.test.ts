import { describe, expect, it } from 'vitest';

import { getEmailNotice } from './get-email-notice';

describe('getEmailNotice', () => {
  it('без запроса и статуса ничего не показывает', () => {
    expect(getEmailNotice({ pendingEmail: null, status: null })).toBeNull();
  });

  it('после запроса называет новый адрес', () => {
    expect(getEmailNotice({ pendingEmail: 'new@example.com', status: null })).toEqual({
      message:
        'Письма отправлены на текущий адрес и new@example.com. Подтвердите смену по ссылкам из обоих писем',
      tone: 'success',
    });
  });

  it('новый запрос важнее статуса из ссылки', () => {
    expect(getEmailNotice({ pendingEmail: 'new@example.com', status: 'failed' })?.tone).toBe(
      'success',
    );
  });

  it.each([
    ['changed', 'Email изменён', 'success'],
    [
      'confirm_other',
      'Первая ссылка подтверждена. Осталось перейти по ссылке из второго письма',
      'success',
    ],
    ['failed', 'Не удалось подтвердить смену email. Запросите письмо ещё раз', 'error'],
  ] as const)('для статуса %s показывает сообщение', (status, message, tone) => {
    expect(getEmailNotice({ pendingEmail: null, status })).toEqual({ message, tone });
  });
});

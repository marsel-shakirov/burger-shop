import { describe, expect, it } from 'vitest';

import { parseEmailChangeStatus } from './parse-email-change-status';

describe('parseEmailChangeStatus', () => {
  it.each(['changed', 'confirm_other', 'failed'])('возвращает статус %s', (status) => {
    expect(parseEmailChangeStatus(new URLSearchParams({ email: status }))).toBe(status);
  });

  it('без параметра возвращает null', () => {
    expect(parseEmailChangeStatus(new URLSearchParams())).toBeNull();
  });

  it.each(['', 'unknown', 'CHANGED'])('для неизвестного значения «%s» возвращает null', (value) => {
    expect(parseEmailChangeStatus(new URLSearchParams({ email: value }))).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';

import { splitBirthDate } from './split-birth-date';

describe('splitBirthDate', () => {
  it('разбивает ISO-дату на день, месяц и год без ведущих нулей', () => {
    expect(splitBirthDate('1990-03-07')).toEqual({ day: '7', month: '3', year: '1990' });
  });

  it('не трогает двузначные день и месяц', () => {
    expect(splitBirthDate('1990-12-25')).toEqual({ day: '25', month: '12', year: '1990' });
  });

  it('возвращает пустые строки для null', () => {
    expect(splitBirthDate(null)).toEqual({ day: '', month: '', year: '' });
  });

  it('возвращает пустые строки для пустой строки', () => {
    expect(splitBirthDate('')).toEqual({ day: '', month: '', year: '' });
  });
});

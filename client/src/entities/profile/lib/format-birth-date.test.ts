import { describe, expect, it } from 'vitest';

import { formatBirthDate, formatBirthDay } from './format-birth-date';

describe('formatBirthDay', () => {
  it('возвращает день без ведущего нуля и месяц в родительном падеже', () => {
    expect(formatBirthDay('1990-03-07')).toBe('7 марта');
  });

  it('не трогает двузначный день', () => {
    expect(formatBirthDay('2000-12-25')).toBe('25 декабря');
  });

  it.each([
    ['1990-01-15', '15 января'],
    ['1990-05-15', '15 мая'],
    ['1990-08-15', '15 августа'],
  ])('%s → «%s»', (birthDate, expected) => {
    expect(formatBirthDay(birthDate)).toBe(expected);
  });
});

describe('formatBirthDate', () => {
  it('добавляет год после дня и месяца', () => {
    expect(formatBirthDate('1990-03-07')).toBe('7 марта 1990');
  });

  it('форматирует первый и последний день года', () => {
    expect(formatBirthDate('1990-01-01')).toBe('1 января 1990');
    expect(formatBirthDate('1999-12-31')).toBe('31 декабря 1999');
  });
});

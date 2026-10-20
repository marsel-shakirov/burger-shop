import { describe, expect, it } from 'vitest';

import { parseBirthDate } from './parse-birth-date';

const today = new Date(2026, 4, 15);

describe('parseBirthDate', () => {
  it('возвращает null, если все поля пустые', () => {
    expect(parseBirthDate('', '', '', today)).toEqual({ ok: true, value: null });
  });

  it('считает поля из пробелов пустыми', () => {
    expect(parseBirthDate('  ', '', '   ', today)).toEqual({ ok: true, value: null });
  });

  it.each([
    ['день', '', '3', '1990'],
    ['месяц', '7', '', '1990'],
    ['год', '7', '3', ''],
  ])('требует заполнить все поля, если не указан %s', (_field, day, month, year) => {
    expect(parseBirthDate(day, month, year, today)).toEqual({
      ok: false,
      error: 'Укажите день, месяц и год рождения',
    });
  });

  it('возвращает дату в формате ISO с ведущими нулями', () => {
    expect(parseBirthDate('7', '3', '1990', today)).toEqual({ ok: true, value: '1990-03-07' });
  });

  it('обрезает пробелы вокруг дня и года', () => {
    expect(parseBirthDate(' 7 ', '3', ' 1990 ', today)).toEqual({
      ok: true,
      value: '1990-03-07',
    });
  });

  it.each(['1899', '2027', '19a0', '1990.5'])('отклоняет год %s', (year) => {
    expect(parseBirthDate('7', '3', year, today)).toEqual({
      ok: false,
      error: 'Год рождения — от 1900 до 2026',
    });
  });

  it('принимает минимальную дату 1 января 1900 года', () => {
    expect(parseBirthDate('1', '1', '1900', today)).toEqual({ ok: true, value: '1900-01-01' });
  });

  it.each(['0', '32', 'abc', '1.5'])('отклоняет день %s', (day) => {
    expect(parseBirthDate(day, '3', '1990', today)).toEqual({
      ok: false,
      error: 'День — число от 1 до 31',
    });
  });

  it('проверяет год раньше дня', () => {
    expect(parseBirthDate('40', '3', '1800', today)).toEqual({
      ok: false,
      error: 'Год рождения — от 1900 до 2026',
    });
  });

  it('отклоняет 31-е число в месяце из 30 дней', () => {
    expect(parseBirthDate('31', '4', '1990', today)).toEqual({
      ok: false,
      error: 'В апреле 30 дней. Проверьте день',
    });
  });

  it('отклоняет 29 февраля в невисокосный год и называет год', () => {
    expect(parseBirthDate('29', '2', '2023', today)).toEqual({
      ok: false,
      error: 'В феврале 2023 года 28 дней. Проверьте день',
    });
  });

  it('принимает 29 февраля в високосный год', () => {
    expect(parseBirthDate('29', '2', '2024', today)).toEqual({ ok: true, value: '2024-02-29' });
  });

  it('принимает сегодняшнюю дату', () => {
    expect(parseBirthDate('15', '5', '2026', today)).toEqual({ ok: true, value: '2026-05-15' });
  });

  it('отклоняет дату в будущем в текущем году', () => {
    expect(parseBirthDate('16', '5', '2026', today)).toEqual({
      ok: false,
      error: 'Дата рождения не может быть в будущем',
    });
  });
});

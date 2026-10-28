import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NAME_MAX_LENGTH } from './profile.constants.ts';
import { updateProfileBodySchema } from './profile.schema.ts';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-28T12:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('updateProfileBodySchema', () => {
  it('не принимает пустое тело', () => {
    expect(updateProfileBodySchema.safeParse({}).success).toBe(false);
  });

  it('не принимает лишние поля', () => {
    expect(updateProfileBodySchema.safeParse({ name: 'Иван', email: 'a@b.c' }).success).toBe(false);
  });

  it('принимает все поля сразу', () => {
    expect(
      updateProfileBodySchema.parse({
        name: 'Иван',
        phone: '+79991234567',
        birthDate: '1990-05-17',
        gender: 'male',
      }),
    ).toEqual({ name: 'Иван', phone: '+79991234567', birthDate: '1990-05-17', gender: 'male' });
  });
});

describe('updateProfileBodySchema: имя', () => {
  it('обрезает пробелы по краям', () => {
    expect(updateProfileBodySchema.parse({ name: '  Иван  ' })).toEqual({ name: 'Иван' });
  });

  it.each(['', '   '])('превращает пустое имя «%s» в null', (name) => {
    expect(updateProfileBodySchema.parse({ name })).toEqual({ name: null });
  });

  it('принимает имя максимальной длины', () => {
    const name = 'а'.repeat(NAME_MAX_LENGTH);

    expect(updateProfileBodySchema.parse({ name })).toEqual({ name });
  });

  it.each([
    ['длиннее максимума', 'а'.repeat(NAME_MAX_LENGTH + 1)],
    ['null', null],
    ['число', 42],
  ])('не принимает имя: %s', (_case, name) => {
    expect(updateProfileBodySchema.safeParse({ name }).success).toBe(false);
  });
});

describe('updateProfileBodySchema: телефон', () => {
  it.each([
    ['+79991234567', '+79991234567'],
    ['+7 (999) 123-45-67', '+79991234567'],
    ['8 999 123 45 67', '89991234567'],
    ['  +7 999 123-45-67  ', '+79991234567'],
  ])('нормализует «%s» в %s', (phone, expected) => {
    expect(updateProfileBodySchema.parse({ phone })).toEqual({ phone: expected });
  });

  it.each(['', '   '])('превращает пустой телефон «%s» в null', (phone) => {
    expect(updateProfileBodySchema.parse({ phone })).toEqual({ phone: null });
  });

  it.each([
    ['меньше 10 цифр', '+799912345'],
    ['больше 15 цифр', '+1234567890123456'],
    ['буквы', '+7999abc4567'],
    ['плюс не в начале', '7999+1234567'],
    ['точки', '+7.999.123.45.67'],
    ['null', null],
  ])('не принимает телефон: %s', (_case, phone) => {
    expect(updateProfileBodySchema.safeParse({ phone }).success).toBe(false);
  });
});

describe('updateProfileBodySchema: дата рождения', () => {
  it.each([
    ['минимальная дата', '1900-01-01'],
    ['обычная дата', '1990-05-17'],
    ['сегодня по UTC', '2026-10-28'],
    ['сегодня в часовом поясе UTC+14', '2026-10-29'],
  ])('принимает: %s', (_case, birthDate) => {
    expect(updateProfileBodySchema.parse({ birthDate })).toEqual({ birthDate });
  });

  it('принимает null, чтобы очистить дату', () => {
    expect(updateProfileBodySchema.parse({ birthDate: null })).toEqual({ birthDate: null });
  });

  it.each([
    ['раньше минимальной', '1899-12-31'],
    ['позже сегодняшней в любом часовом поясе', '2026-10-30'],
    ['несуществующий день', '2026-02-30'],
    ['другой формат', '17.05.1990'],
    ['дата со временем', '1990-05-17T00:00:00Z'],
    ['пустая строка', ''],
  ])('не принимает: %s', (_case, birthDate) => {
    expect(updateProfileBodySchema.safeParse({ birthDate }).success).toBe(false);
  });
});

describe('updateProfileBodySchema: пол', () => {
  it.each(['female', 'male', null])('принимает %s', (gender) => {
    expect(updateProfileBodySchema.parse({ gender })).toEqual({ gender });
  });

  it.each(['other', '', 'Male'])('не принимает «%s»', (gender) => {
    expect(updateProfileBodySchema.safeParse({ gender }).success).toBe(false);
  });
});

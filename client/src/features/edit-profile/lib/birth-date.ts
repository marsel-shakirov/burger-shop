import { MIN_BIRTH_YEAR, MONTHS_PREPOSITIONAL } from '../config/edit-profile.constants';

type BirthDateResult = { ok: true; value: string | null } | { ok: false; error: string };

const pad = (value: number, length: number) => String(value).padStart(length, '0');

const toIsoDate = (year: number, month: number, day: number) =>
  `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;

export const splitBirthDate = (birthDate: string | null) => {
  const [year = '', month = '', day = ''] = birthDate?.split('-') ?? [];

  return {
    day: day && String(Number(day)),
    month: month && String(Number(month)),
    year,
  };
};

export const parseBirthDate = (
  dayInput: string,
  monthInput: string,
  yearInput: string,
  today = new Date(),
): BirthDateResult => {
  const dayValue = dayInput.trim();
  const yearValue = yearInput.trim();
  const parts = [dayValue, monthInput, yearValue];

  if (parts.every((part) => part === '')) {
    return { ok: true, value: null };
  }

  if (parts.some((part) => part === '')) {
    return { ok: false, error: 'Укажите день, месяц и год рождения' };
  }

  const day = Number(dayValue);
  const month = Number(monthInput);
  const year = Number(yearValue);
  const currentYear = today.getFullYear();

  if (!Number.isInteger(year) || year < MIN_BIRTH_YEAR || year > currentYear) {
    return { ok: false, error: `Год рождения — от ${MIN_BIRTH_YEAR} до ${currentYear}` };
  }

  if (!Number.isInteger(day) || day < 1 || day > 31) {
    return { ok: false, error: 'День — число от 1 до 31' };
  }

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  if (day > daysInMonth) {
    const where = month === 2 ? `феврале ${year} года` : MONTHS_PREPOSITIONAL[month - 1];
    return { ok: false, error: `В ${where} ${daysInMonth} дней. Проверьте день` };
  }

  const value = toIsoDate(year, month, day);
  const todayValue = toIsoDate(currentYear, today.getMonth() + 1, today.getDate());

  if (value > todayValue) {
    return { ok: false, error: 'Дата рождения не может быть в будущем' };
  }

  return { ok: true, value };
};

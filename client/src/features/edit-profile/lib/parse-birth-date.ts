import { MIN_BIRTH_YEAR, MONTHS_PREPOSITIONAL } from '../config/edit-profile.constants';

type BirthDateResult = { ok: true; value: string | null } | { ok: false; error: string };

const fail = (error: string): BirthDateResult => ({ ok: false, error });

const isEmpty = (value: string) => value === '';

const isIntegerInRange = (value: number, min: number, max: number) =>
  Number.isInteger(value) && value >= min && value <= max;

const pad = (value: number, length: number) => String(value).padStart(length, '0');

const toIsoDate = (year: number, month: number, day: number) =>
  `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;

const dateToIso = (date: Date) =>
  toIsoDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

const getDaysInMonth = (year: number, month: number) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

const getMonthPrepositional = (year: number, month: number) =>
  month === 2 ? `феврале ${year} года` : MONTHS_PREPOSITIONAL[month - 1];

const validateDate = (day: number, month: number, year: number, today: Date): BirthDateResult => {
  const currentYear = today.getFullYear();

  if (!isIntegerInRange(year, MIN_BIRTH_YEAR, currentYear)) {
    return fail(`Год рождения — от ${MIN_BIRTH_YEAR} до ${currentYear}`);
  }

  if (!isIntegerInRange(month, 1, 12)) {
    return fail('Месяц — число от 1 до 12');
  }

  if (!isIntegerInRange(day, 1, 31)) {
    return fail('День — число от 1 до 31');
  }

  const daysInMonth = getDaysInMonth(year, month);

  if (day > daysInMonth) {
    return fail(`В ${getMonthPrepositional(year, month)} ${daysInMonth} дней. Проверьте день`);
  }

  const value = toIsoDate(year, month, day);

  if (value > dateToIso(today)) {
    return fail('Дата рождения не может быть в будущем');
  }

  return { ok: true, value };
};

export const parseBirthDate = (
  dayInput: string,
  monthInput: string,
  yearInput: string,
  today = new Date(),
): BirthDateResult => {
  const day = dayInput.trim();
  const month = monthInput;
  const year = yearInput.trim();
  const parts = [day, month, year];

  if (parts.every(isEmpty)) {
    return { ok: true, value: null };
  }

  if (parts.some(isEmpty)) {
    return fail('Укажите день, месяц и год рождения');
  }

  return validateDate(Number(day), Number(month), Number(year), today);
};

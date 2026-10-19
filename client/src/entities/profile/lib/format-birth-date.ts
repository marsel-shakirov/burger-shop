import { MONTHS_GENITIVE } from '../config/profile.constants';

export const formatBirthDay = (birthDate: string) => {
  const [, month, day] = birthDate.split('-');

  return `${Number(day)} ${MONTHS_GENITIVE[Number(month) - 1]}`;
};

export const formatBirthDate = (birthDate: string) =>
  `${formatBirthDay(birthDate)} ${birthDate.slice(0, 4)}`;

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/shared/config';

export const getWeakPasswordMessage = (reasons: string[] = []): string => {
  if (reasons.includes('pwned')) {
    return 'Этот пароль встречался в утечках данных. Придумайте другой';
  }

  if (reasons.includes('length')) {
    return `Пароль должен быть от ${PASSWORD_MIN_LENGTH} до ${PASSWORD_MAX_LENGTH} символов`;
  }

  return 'Пароль должен содержать заглавную букву, цифру и спецсимвол';
};

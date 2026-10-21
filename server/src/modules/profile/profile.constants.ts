export const GENDERS = ['female', 'male'] as const;

export const MIN_BIRTH_DATE = '1900-01-01';

export const NAME_MAX_LENGTH = 50;

export const INVALID_FIELD_CODES = new Map<string, string>([
  ['name', 'invalid_name'],
  ['phone', 'invalid_phone'],
  ['birthDate', 'invalid_birth_date'],
  ['gender', 'invalid_gender'],
]);

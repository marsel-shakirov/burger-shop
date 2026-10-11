import { isApiError, isNetworkError } from '@/shared/api';

import type { ProfileFormError } from '../model/edit-profile.types';

const invalidFieldErrors: Record<string, ProfileFormError | undefined> = {
  invalid_name: { field: 'name', message: 'Имя должно быть не длиннее 50 символов' },
  invalid_phone: { field: 'phone', message: 'Проверьте номер: от 10 до 15 цифр, можно начать с +' },
  invalid_birth_date: { field: 'birthDate', message: 'Проверьте дату рождения' },
  invalid_gender: { field: 'gender', message: 'Выберите пол из списка' },
};

export const getEditProfileError = (error: unknown): ProfileFormError => {
  if (isNetworkError(error)) {
    return { message: 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз' };
  }

  const fieldError = isApiError(error) && error.code ? invalidFieldErrors[error.code] : undefined;

  return fieldError ?? { message: 'Не удалось сохранить. Попробуйте ещё раз' };
};

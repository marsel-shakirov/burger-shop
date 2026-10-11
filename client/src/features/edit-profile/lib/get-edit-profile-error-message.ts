import { isApiError, isNetworkError } from '@/shared/api';

import type { ProfileField } from '../model/edit-profile.types';

const invalidValueMessages: Record<ProfileField, string> = {
  name: 'Имя должно быть не длиннее 50 символов',
  phone: 'Проверьте номер: от 10 до 15 цифр, можно начать с +',
};

export const getEditProfileErrorMessage = (error: unknown, field: ProfileField): string => {
  if (isNetworkError(error)) {
    return 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз';
  }

  if (isApiError(error) && error.status === 400) {
    return invalidValueMessages[field];
  }

  return 'Не удалось сохранить. Попробуйте ещё раз';
};

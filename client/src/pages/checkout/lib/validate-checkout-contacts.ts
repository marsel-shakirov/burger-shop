import { normalizeLocalPhone } from '@/shared/lib';

export interface CheckoutContactValues {
  customerName: string;
  customerPhone: string;
  customerComment: string;
}

export const validateCheckoutContacts = (values: CheckoutContactValues) => {
  const errors: Partial<Record<keyof CheckoutContactValues, string>> = {};
  const name = values.customerName.trim();
  const phone = normalizeLocalPhone(values.customerPhone);
  const comment = values.customerComment.trim();

  if (!name) {
    errors.customerName = 'Введите имя';
  } else if (name.length > 100) {
    errors.customerName = 'Имя должно быть не длиннее 100 символов';
  }

  if (!values.customerPhone.trim()) {
    errors.customerPhone = 'Введите телефон';
  } else if (!phone) {
    errors.customerPhone = 'Введите номер в формате +7 (900) 123-45-67';
  }

  if (comment.length > 500) {
    errors.customerComment = 'Комментарий должен быть не длиннее 500 символов';
  }

  return {
    errors,
    contacts: { customerName: name, customerPhone: phone ?? '', customerComment: comment },
  };
};

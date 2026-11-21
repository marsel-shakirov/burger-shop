export interface CheckoutContactValues {
  customerName: string;
  customerPhone: string;
  customerComment: string;
}

export const validateCheckoutContacts = (values: CheckoutContactValues) => {
  const errors: Partial<Record<keyof CheckoutContactValues, string>> = {};
  const name = values.customerName.trim();
  const phone = values.customerPhone.replace(/[\s()-]/g, '');
  const comment = values.customerComment.trim();

  if (!name) {
    errors.customerName = 'Введите имя';
  } else if (name.length > 100) {
    errors.customerName = 'Имя должно быть не длиннее 100 символов';
  }

  if (!phone) {
    errors.customerPhone = 'Введите телефон';
  } else if (!/^\+?\d{10,15}$/.test(phone)) {
    errors.customerPhone = 'Введите телефон из 10–15 цифр. В начале можно указать «+».';
  }

  if (comment.length > 500) {
    errors.customerComment = 'Комментарий должен быть не длиннее 500 символов';
  }

  return errors;
};

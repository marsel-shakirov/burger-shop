import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { profileQueryOptions } from '@/entities/profile';
import { normalizeLocalPhone } from '@/shared/lib';

import {
  type CheckoutContactValues,
  validateCheckoutContacts,
} from '../lib/validate-checkout-contacts';

type ContactField = keyof CheckoutContactValues;

export interface CheckoutDraft {
  values: Partial<CheckoutContactValues>;
  updateField: (field: ContactField, value: string) => void;
}

export const useContactFields = (userId: string, draft: CheckoutDraft['values']) => {
  const { data: profile } = useQuery(profileQueryOptions(userId));
  const [touched, setTouched] = useState<Partial<Record<ContactField, true>>>({});
  const values = {
    customerName: draft.customerName ?? profile?.name ?? '',
    customerPhone: draft.customerPhone ?? normalizeLocalPhone(profile?.phone ?? '') ?? '',
    customerComment: draft.customerComment ?? '',
  };
  const { contacts, errors } = validateCheckoutContacts(values);

  const touchField = (field: ContactField) => {
    setTouched((previous) => ({ ...previous, [field]: true }));
  };

  const confirm = (onConfirm: (contacts: CheckoutContactValues) => void) => {
    setTouched({ customerName: true, customerPhone: true, customerComment: true });
    if (Object.keys(errors).length === 0) onConfirm(contacts);
  };

  return {
    values,
    nameError: touched.customerName && errors.customerName,
    phoneError: touched.customerPhone && errors.customerPhone,
    commentError: touched.customerComment && errors.customerComment,
    touchField,
    confirm,
  };
};

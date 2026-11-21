import { useQuery } from '@tanstack/react-query';
import { useId, useState } from 'react';

import { profileQueryOptions } from '@/entities/profile';
import { FormAlert } from '@/shared/ui/form-alert';
import { FormField } from '@/shared/ui/form-field';
import { TextInput } from '@/shared/ui/text-input';

import {
  type CheckoutContactValues,
  validateCheckoutContacts,
} from '../lib/validate-checkout-contacts';

type ContactField = keyof CheckoutContactValues;

const PickupDetails = () => (
  <dl className="grid grid-cols-2 gap-4 border-t border-dashed border-stone-300 pt-4 text-sm">
    <div>
      <dt className="text-stone-600">Получение</dt>
      <dd className="font-bold">Самовывоз</dd>
    </div>
    <div>
      <dt className="text-stone-600">Оплата</dt>
      <dd className="font-bold">При получении</dd>
    </div>
  </dl>
);

export const CheckoutContacts = ({ userId }: { userId: string }) => {
  const titleId = useId();
  const { data: profile } = useQuery(profileQueryOptions(userId));
  const [draft, setDraft] = useState<Partial<CheckoutContactValues>>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, true>>>({});
  const values = {
    customerName: draft.customerName ?? profile?.name ?? '',
    customerPhone: draft.customerPhone ?? profile?.phone ?? '',
    customerComment: draft.customerComment ?? '',
  };
  const errors = validateCheckoutContacts(values);
  const nameError = touched.customerName && errors.customerName;
  const phoneError = touched.customerPhone && errors.customerPhone;
  const commentError = touched.customerComment && errors.customerComment;
  const nameErrorId = `${titleId}-name-error`;
  const phoneErrorId = `${titleId}-phone-error`;
  const commentErrorId = `${titleId}-comment-error`;

  const updateField = (field: ContactField, value: string) => {
    setDraft((previous) => ({ ...previous, [field]: value }));
  };

  const touchField = (field: ContactField) => {
    setTouched((previous) => ({ ...previous, [field]: true }));
  };

  return (
    <form
      aria-labelledby={titleId}
      className="flex min-w-0 flex-col gap-5 rounded-xl bg-white p-5 shadow-(--shadow-base)"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setTouched({ customerName: true, customerPhone: true, customerComment: true });
      }}
    >
      <h2 id={titleId} className="text-lg font-bold">
        Контакты для заказа
      </h2>

      <FormField label="Имя" invalid={Boolean(nameError)} errorId={nameErrorId}>
        {(controlProps) => (
          <>
            <TextInput
              {...controlProps}
              name="customerName"
              autoComplete="name"
              required
              value={values.customerName}
              onChange={(event) => updateField('customerName', event.target.value)}
              onBlur={() => touchField('customerName')}
            />
            {nameError && <FormAlert id={nameErrorId}>{nameError}</FormAlert>}
          </>
        )}
      </FormField>

      <FormField label="Телефон" invalid={Boolean(phoneError)} errorId={phoneErrorId}>
        {(controlProps) => (
          <>
            <TextInput
              {...controlProps}
              name="customerPhone"
              type="tel"
              autoComplete="tel"
              required
              value={values.customerPhone}
              onChange={(event) => updateField('customerPhone', event.target.value)}
              onBlur={() => touchField('customerPhone')}
            />
            {phoneError && <FormAlert id={phoneErrorId}>{phoneError}</FormAlert>}
          </>
        )}
      </FormField>

      <FormField
        label={
          <>
            Комментарий <span className="font-normal text-stone-600">(необязательно)</span>
          </>
        }
        invalid={Boolean(commentError)}
        errorId={commentErrorId}
      >
        {(controlProps) => (
          <>
            <textarea
              {...controlProps}
              name="customerComment"
              rows={3}
              className="w-full resize-y rounded-md border border-stone-400 bg-white px-4 py-3 text-base text-stone-900 focus-ring aria-invalid:border-red-600"
              value={values.customerComment}
              onChange={(event) => updateField('customerComment', event.target.value)}
              onBlur={() => touchField('customerComment')}
            />
            {commentError && <FormAlert id={commentErrorId}>{commentError}</FormAlert>}
          </>
        )}
      </FormField>

      <PickupDetails />
    </form>
  );
};

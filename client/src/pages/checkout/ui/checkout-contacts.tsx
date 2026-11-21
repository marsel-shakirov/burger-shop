import { useQuery } from '@tanstack/react-query';
import { useId, useState } from 'react';

import { profileQueryOptions } from '@/entities/profile';
import { Button } from '@/shared/ui/button';
import { FormAlert } from '@/shared/ui/form-alert';
import { FormField } from '@/shared/ui/form-field';
import { TextInput } from '@/shared/ui/text-input';

import {
  type CheckoutContactValues,
  validateCheckoutContacts,
} from '../lib/validate-checkout-contacts';

type ContactField = keyof CheckoutContactValues;

export interface CheckoutDraft {
  values: Partial<CheckoutContactValues>;
  updateField: (field: ContactField, value: string) => void;
}

interface CheckoutContactsProps {
  userId: string;
  isPending: boolean;
  needsRetry: boolean;
  isBlocked: boolean;
  draft: CheckoutDraft;
  onConfirm: (contacts: CheckoutContactValues) => void;
}

export const PickupDetails = () => (
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

const useContactFields = (userId: string, draft: CheckoutDraft['values']) => {
  const titleId = useId();
  const { data: profile } = useQuery(profileQueryOptions(userId));
  const [touched, setTouched] = useState<Partial<Record<ContactField, true>>>({});
  const values = {
    customerName: draft.customerName ?? profile?.name ?? '',
    customerPhone: draft.customerPhone ?? profile?.phone ?? '',
    customerComment: draft.customerComment ?? '',
  };
  const { contacts, errors } = validateCheckoutContacts(values);
  const nameError = touched.customerName && errors.customerName;
  const phoneError = touched.customerPhone && errors.customerPhone;
  const commentError = touched.customerComment && errors.customerComment;
  const nameErrorId = `${titleId}-name-error`;
  const phoneErrorId = `${titleId}-phone-error`;
  const commentErrorId = `${titleId}-comment-error`;

  const touchField = (field: ContactField) => {
    setTouched((previous) => ({ ...previous, [field]: true }));
  };

  const confirm = (onConfirm: CheckoutContactsProps['onConfirm']) => {
    setTouched({ customerName: true, customerPhone: true, customerComment: true });
    if (Object.keys(errors).length === 0) onConfirm(contacts);
  };

  return {
    titleId,
    values,
    nameError,
    phoneError,
    commentError,
    nameErrorId,
    phoneErrorId,
    commentErrorId,
    touchField,
    confirm,
  };
};

export const CheckoutContacts = ({
  userId,
  isPending,
  needsRetry,
  isBlocked,
  draft,
  onConfirm,
}: CheckoutContactsProps) => {
  const fields = useContactFields(userId, draft.values);
  const { titleId, values, nameError, phoneError, commentError, touchField } = fields;
  const { updateField } = draft;
  const { nameErrorId, phoneErrorId, commentErrorId } = fields;
  const disabled = isPending || needsRetry;

  return (
    <form
      aria-labelledby={titleId}
      className="flex min-w-0 flex-col gap-5 rounded-xl bg-white p-5 shadow-(--shadow-base)"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (!disabled && !isBlocked) fields.confirm(onConfirm);
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
      <Button type="submit" pending={isPending} disabled={needsRetry || isBlocked}>
        {isPending ? 'Оформляем…' : 'Подтвердить заказ'}
      </Button>
    </form>
  );
};

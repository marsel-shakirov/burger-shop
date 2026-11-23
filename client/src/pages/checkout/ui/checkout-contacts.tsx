import { useId } from 'react';

import { Button } from '@/shared/ui/button';
import { FormAlert } from '@/shared/ui/form-alert';
import { FormField } from '@/shared/ui/form-field';
import { TextInput } from '@/shared/ui/text-input';

import type { CheckoutContactValues } from '../lib/validate-checkout-contacts';
import { type CheckoutDraft, useContactFields } from '../model/use-contact-fields';

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

export const CheckoutContacts = ({
  userId,
  isPending,
  needsRetry,
  isBlocked,
  draft,
  onConfirm,
}: CheckoutContactsProps) => {
  const titleId = useId();
  const { values, nameError, phoneError, commentError, touchField, confirm } = useContactFields(
    userId,
    draft.values,
  );
  const { updateField } = draft;
  const nameErrorId = `${titleId}-name-error`;
  const phoneErrorId = `${titleId}-phone-error`;
  const commentErrorId = `${titleId}-comment-error`;
  const disabled = isPending || needsRetry;

  return (
    <form
      aria-labelledby={titleId}
      className="flex min-w-0 flex-col gap-5 rounded-xl bg-white p-5 shadow-(--shadow-base)"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (!disabled && !isBlocked) confirm(onConfirm);
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

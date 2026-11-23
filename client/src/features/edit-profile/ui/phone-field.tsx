import { useId } from 'react';

import { normalizeLocalPhone } from '@/shared/lib';
import { FormField } from '@/shared/ui/form-field';
import { PhoneInput } from '@/shared/ui/phone-input';

interface PhoneFieldProps {
  phone: string | null;
  invalid: boolean;
  errorId: string;
}

export const PhoneField = ({ phone, invalid, errorId }: PhoneFieldProps) => {
  const hintId = useId();
  const localPhone = normalizeLocalPhone(phone ?? '');
  const legacyPhone = phone && !localPhone ? phone : null;

  return (
    <FormField
      label="Номер для связи по заказам"
      invalid={invalid}
      errorId={errorId}
      hintId={legacyPhone ? hintId : undefined}
    >
      {(controlProps) => (
        <>
          <PhoneInput {...controlProps} name="phone" defaultValue={localPhone ?? ''} />
          {legacyPhone && (
            <p id={hintId} className="text-sm text-stone-600">
              Сохранённый номер {legacyPhone}. Введите номер с +7 или сохраните пустое поле, чтобы
              удалить старый номер.
            </p>
          )}
        </>
      )}
    </FormField>
  );
};

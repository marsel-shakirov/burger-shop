import { useId } from 'react';

import { TextInput } from '@/shared/ui/text-input';

interface PhoneFieldProps {
  phone: string | null;
  invalid: boolean;
}

export const PhoneField = ({ phone, invalid }: PhoneFieldProps) => {
  const phoneId = useId();

  return (
    <div className="flex flex-col gap-y-2">
      <label htmlFor={phoneId} className="font-bold">
        Номер для связи по заказам
      </label>
      <TextInput
        id={phoneId}
        name="phone"
        defaultValue={phone ?? ''}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+7 999 123-45-67"
        aria-invalid={invalid ? true : undefined}
      />
    </div>
  );
};

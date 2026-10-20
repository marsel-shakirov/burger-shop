import { FormField } from '@/shared/ui/form-field';
import { TextInput } from '@/shared/ui/text-input';

interface PhoneFieldProps {
  phone: string | null;
  invalid: boolean;
  errorId: string;
}

export const PhoneField = ({ phone, invalid, errorId }: PhoneFieldProps) => {
  return (
    <FormField label="Номер для связи по заказам" invalid={invalid} errorId={errorId}>
      {(controlProps) => (
        <TextInput
          {...controlProps}
          name="phone"
          defaultValue={phone ?? ''}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 999 123-45-67"
        />
      )}
    </FormField>
  );
};

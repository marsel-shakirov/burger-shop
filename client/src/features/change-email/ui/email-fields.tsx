import { FormField } from '@/shared/ui/form-field';
import { PasswordInput } from '@/shared/ui/password-input';
import { TextInput } from '@/shared/ui/text-input';

import type { EmailFormField } from '../model/change-email.types';

interface EmailFieldsProps {
  invalidField?: EmailFormField;
  errorId: string;
}

export const EmailFields = ({ invalidField, errorId }: EmailFieldsProps) => {
  return (
    <>
      <FormField label="Новый email" invalid={invalidField === 'newEmail'} errorId={errorId}>
        {(controlProps) => (
          <TextInput
            {...controlProps}
            name="newEmail"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="введите новый email"
            required
          />
        )}
      </FormField>

      <FormField
        label="Текущий пароль"
        invalid={invalidField === 'currentPassword'}
        errorId={errorId}
      >
        {(controlProps) => (
          <PasswordInput
            {...controlProps}
            name="currentPassword"
            autoComplete="current-password"
            placeholder="введите текущий пароль"
            required
          />
        )}
      </FormField>
    </>
  );
};

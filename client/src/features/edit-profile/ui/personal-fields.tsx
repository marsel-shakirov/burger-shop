import type { Profile } from '@/entities/profile';
import { FormField } from '@/shared/ui/form-field';
import { TextInput } from '@/shared/ui/text-input';

import { NAME_MAX_LENGTH } from '../config/edit-profile.constants';
import type { ProfileFormField } from '../model/edit-profile.types';
import { BirthDateField } from './birth-date-field';
import { GenderField } from './gender-field';

interface PersonalFieldsProps {
  profile: Profile;
  invalidField?: ProfileFormField;
  errorId: string;
}

export const PersonalFields = ({ profile, invalidField, errorId }: PersonalFieldsProps) => {
  return (
    <>
      <FormField label="Имя" invalid={invalidField === 'name'} errorId={errorId}>
        {(controlProps) => (
          <TextInput
            {...controlProps}
            name="name"
            defaultValue={profile.name ?? ''}
            autoComplete="given-name"
            maxLength={NAME_MAX_LENGTH}
            placeholder="введите имя"
          />
        )}
      </FormField>

      <BirthDateField
        birthDate={profile.birthDate}
        invalid={invalidField === 'birthDate'}
        errorId={errorId}
      />
      <GenderField gender={profile.gender} invalid={invalidField === 'gender'} errorId={errorId} />
    </>
  );
};

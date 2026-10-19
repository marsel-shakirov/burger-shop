import { useId } from 'react';

import type { Profile } from '@/entities/profile';
import { TextInput } from '@/shared/ui/text-input';

import { NAME_MAX_LENGTH } from '../config/edit-profile.constants';
import type { ProfileFormField } from '../model/edit-profile.types';
import { BirthDateField } from './birth-date-field';
import { GenderField } from './gender-field';

interface PersonalFieldsProps {
  profile: Profile;
  invalidField?: ProfileFormField;
}

export const PersonalFields = ({ profile, invalidField }: PersonalFieldsProps) => {
  const nameId = useId();

  return (
    <>
      <div className="flex flex-col gap-y-2">
        <label htmlFor={nameId} className="font-bold">
          Имя
        </label>
        <TextInput
          id={nameId}
          name="name"
          defaultValue={profile.name ?? ''}
          autoComplete="given-name"
          maxLength={NAME_MAX_LENGTH}
          placeholder="введите имя"
          aria-invalid={invalidField === 'name' ? true : undefined}
        />
      </div>

      <BirthDateField birthDate={profile.birthDate} invalid={invalidField === 'birthDate'} />
      <GenderField gender={profile.gender} invalid={invalidField === 'gender'} />
    </>
  );
};

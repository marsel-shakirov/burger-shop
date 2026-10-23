import { useId } from 'react';

import type { Profile } from '@/entities/profile';
import { ModalForm } from '@/shared/ui/modal-form';

import type { ProfileSection } from '../model/edit-profile.types';
import { useEditProfileForm } from '../model/use-edit-profile-form';
import { PersonalFields } from './personal-fields';
import { PhoneField } from './phone-field';

const titles: Record<ProfileSection, string> = {
  personal: 'Личные данные',
  phone: 'Телефон',
};

interface EditProfileModalProps {
  userId: string;
  profile: Profile;
  section: ProfileSection;
  open: boolean;
  onClose: () => void;
}

export const EditProfileModal = ({
  userId,
  profile,
  section,
  open,
  onClose,
}: EditProfileModalProps) => {
  const errorId = useId();
  const { formError, isPending, handleSubmit, handleInput } = useEditProfileForm({
    userId,
    profile,
    section,
    onClose,
  });

  return (
    <ModalForm
      open={open}
      onClose={onClose}
      title={titles[section]}
      errorId={errorId}
      errorMessage={formError?.message}
      isPending={isPending}
      submitLabel="Сохранить"
      pendingLabel="Сохраняем…"
      onSubmit={handleSubmit}
      onInput={handleInput}
    >
      {section === 'personal' ? (
        <PersonalFields profile={profile} invalidField={formError?.field} errorId={errorId} />
      ) : (
        <PhoneField
          phone={profile.phone}
          invalid={formError?.field === 'phone'}
          errorId={errorId}
        />
      )}
    </ModalForm>
  );
};

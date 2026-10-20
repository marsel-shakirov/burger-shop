import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type SubmitEvent, useId, useState } from 'react';

import { type Profile, profileQueryOptions } from '@/entities/profile';
import { Modal } from '@/shared/ui/modal';

import { updateProfile } from '../api/update-profile';
import { getEditProfileError } from '../lib/get-edit-profile-error';
import { getChangedFields, readProfileForm } from '../lib/read-profile-form';
import type { ProfileFormError, ProfileSection } from '../model/edit-profile.types';
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
  const titleId = useId();
  const errorId = useId();
  const queryClient = useQueryClient();
  const [validationError, setValidationError] = useState<ProfileFormError | null>(null);

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(profileQueryOptions(userId).queryKey, updated);
      onClose();
    },
  });

  const formError = validationError ?? (error ? getEditProfileError(error) : null);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = readProfileForm(section, new FormData(event.currentTarget));

    if (!result.ok) {
      setValidationError(result.error);
      return;
    }

    const changes = getChangedFields(profile, result.update);

    if (Object.keys(changes).length === 0) {
      onClose();
      return;
    }

    mutate(changes);
  };

  const handleInput = () => {
    setValidationError(null);

    if (error) {
      reset();
    }
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId}>
      <form
        onSubmit={handleSubmit}
        onInput={handleInput}
        className="flex flex-col gap-y-5 pt-8 sm:pt-10"
      >
        <h2 id={titleId} className="pr-12 font-display text-2xl font-extrabold">
          {titles[section]}
        </h2>

        {section === 'personal' ? (
          <PersonalFields profile={profile} invalidField={formError?.field} errorId={errorId} />
        ) : (
          <PhoneField
            phone={profile.phone}
            invalid={formError?.field === 'phone'}
            errorId={errorId}
          />
        )}

        {formError && (
          <p
            id={errorId}
            role="alert"
            className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {formError.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="h-12 w-full cursor-pointer rounded-md bg-orange-500 font-bold text-stone-900 focus-ring transition-colors duration-150 hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60 disabled:hover:bg-orange-500"
        >
          {isPending ? 'Сохраняем…' : 'Сохранить'}
        </button>
      </form>
    </Modal>
  );
};

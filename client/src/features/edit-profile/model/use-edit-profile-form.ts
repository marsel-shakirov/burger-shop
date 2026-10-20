import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type SubmitEvent, useState } from 'react';

import { type Profile, profileQueryOptions } from '@/entities/profile';

import { updateProfile } from '../api/update-profile';
import { getChangedFields } from '../lib/get-changed-fields';
import { getEditProfileError } from '../lib/get-edit-profile-error';
import { readProfileForm } from '../lib/read-profile-form';
import type { ProfileFormError, ProfileSection } from './edit-profile.types';

interface UseEditProfileFormOptions {
  userId: string;
  profile: Profile;
  section: ProfileSection;
  onClose: () => void;
}

export const useEditProfileForm = ({
  userId,
  profile,
  section,
  onClose,
}: UseEditProfileFormOptions) => {
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

  return { formError, isPending, handleSubmit, handleInput };
};

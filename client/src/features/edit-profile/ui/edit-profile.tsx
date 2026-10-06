import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SubmitEvent } from 'react';

import { type Profile, profileQueryOptions } from '@/entities/profile';
import { TextInput } from '@/shared/ui/text-input';

import { updateProfile } from '../api/update-profile';

interface EditProfileProps {
  userId: string;
  profile: Profile;
}

export const EditProfile = ({ userId, profile }: EditProfileProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess, reset } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => queryClient.setQueryData(profileQueryOptions(userId).queryKey, updated),
  });

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    mutate({
      name: String(formData.get('name') ?? ''),
      phone: String(formData.get('phone') ?? ''),
    });
  };

  return (
    <form onSubmit={handleSubmit} onChange={reset}>
      <label>
        Имя
        <TextInput
          name="name"
          defaultValue={profile.name ?? ''}
          autoComplete="name"
          maxLength={50}
        />
      </label>

      <label>
        Телефон
        <TextInput
          name="phone"
          defaultValue={profile.phone ?? ''}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 999
  123-45-67"
        />
      </label>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Сохраняем…' : 'Сохранить'}
      </button>

      {isSuccess && <p role="status">Сохранено</p>}
      {isError && <p role="alert">Не удалось сохранить</p>}
    </form>
  );
};

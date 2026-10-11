import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type ComponentPropsWithoutRef, type SubmitEvent, useId } from 'react';

import { type Profile, profileQueryOptions } from '@/entities/profile';
import { Modal } from '@/shared/ui/modal';
import { TextInput } from '@/shared/ui/text-input';

import { updateProfile } from '../api/update-profile';
import { getEditProfileErrorMessage } from '../lib/get-edit-profile-error-message';
import type { ProfileField } from '../model/edit-profile.types';

interface FieldConfig {
  title: string;
  label: string;
  inputProps: ComponentPropsWithoutRef<'input'>;
}

const fieldConfigs: Record<ProfileField, FieldConfig> = {
  name: {
    title: 'Имя',
    label: 'Как к вам обращаться',
    inputProps: { autoComplete: 'given-name', maxLength: 50, placeholder: 'введите имя' },
  },
  phone: {
    title: 'Телефон',
    label: 'Номер для связи по заказам',
    inputProps: {
      type: 'tel',
      inputMode: 'tel',
      autoComplete: 'tel',
      placeholder: '+7 999 123-45-67',
    },
  },
};

interface EditProfileModalProps {
  userId: string;
  profile: Profile;
  field: ProfileField;
  open: boolean;
  onClose: () => void;
}

export const EditProfileModal = ({
  userId,
  profile,
  field,
  open,
  onClose,
}: EditProfileModalProps) => {
  const titleId = useId();
  const inputId = useId();
  const queryClient = useQueryClient();
  const { title, label, inputProps } = fieldConfigs[field];

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(profileQueryOptions(userId).queryKey, updated);
      onClose();
    },
  });

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get(field) ?? '');

    mutate({
      name: profile.name ?? '',
      phone: profile.phone ?? '',
      [field]: value,
    });
  };

  const handleInput = () => {
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
          {title}
        </h2>

        <div className="flex flex-col gap-y-2">
          <label htmlFor={inputId} className="font-bold">
            {label}
          </label>
          <TextInput
            {...inputProps}
            id={inputId}
            name={field}
            defaultValue={profile[field] ?? ''}
            aria-invalid={error ? true : undefined}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {getEditProfileErrorMessage(error, field)}
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

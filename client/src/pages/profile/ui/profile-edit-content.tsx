import { useSuspenseQuery } from '@tanstack/react-query';
import { useId, useState } from 'react';

import { profileQueryOptions } from '@/entities/profile';
import { EditProfileModal, type ProfileField } from '@/features/edit-profile';
import { cn } from '@/shared/lib';
import { CheckCircleIcon } from '@/shared/ui/icon';

import { BirthdayPromo } from './birthday-promo';
import { ProfileAvatar } from './profile-avatar';

const editButtonClassName =
  'cursor-pointer rounded-md font-bold text-orange-700 focus-ring transition-colors duration-150 hover:text-orange-900';

interface Editor {
  field: ProfileField;
  open: boolean;
  key: number;
}

interface ProfileEditContentProps {
  userId: string;
  email: string | null;
}

export const ProfileEditContent = ({ userId, email }: ProfileEditContentProps) => {
  const { data: profile } = useSuspenseQuery(profileQueryOptions(userId));
  const [editor, setEditor] = useState<Editor>({ field: 'name', open: false, key: 0 });
  const accountTitleId = useId();

  const openEditor = (field: ProfileField) =>
    setEditor((prev) => ({ field, open: true, key: prev.key + 1 }));

  const closeEditor = () => setEditor((prev) => ({ ...prev, open: false }));

  const nameAction = profile.name ? 'Изменить' : 'Добавить';
  const phoneAction = profile.phone ? 'Изменить' : 'Добавить';

  return (
    <>
      <section className="flex items-start gap-x-4">
        <ProfileAvatar name={profile.name} className="size-16 text-3xl" />

        <div className="flex min-w-0 flex-col items-start pt-1">
          <h1 className={cn('text-xl wrap-anywhere', !profile.name && 'text-stone-400')}>
            {profile.name || 'Как вас зовут?'}
          </h1>
          <p className="mt-1 text-stone-400">Дата рождения не указана</p>
          <p className="mt-1 text-stone-400">Пол не указан</p>
          <button
            type="button"
            onClick={() => openEditor('name')}
            aria-label={`${nameAction} имя`}
            className={cn(editButtonClassName, 'mt-2')}
          >
            {nameAction}
          </button>
        </div>
      </section>

      <BirthdayPromo />

      <hr className="border-dashed border-stone-300" />

      <section aria-labelledby={accountTitleId} className="flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-1.5">
          <h2 id={accountTitleId} className="font-display text-lg font-bold">
            Учётные данные
          </h2>
          <p className="text-sm text-stone-500">Нужны для входа и связи по заказам</p>
        </div>

        <dl className="flex flex-col gap-y-5">
          <div className="flex flex-col items-start gap-y-0.5">
            <dt className="text-sm text-stone-500">Телефон</dt>
            <dd className={cn('text-lg tabular-nums', !profile.phone && 'text-stone-400')}>
              {profile.phone ?? 'Не указан'}
            </dd>
            <dd className="mt-1.5">
              <button
                type="button"
                onClick={() => openEditor('phone')}
                aria-label={`${phoneAction} телефон`}
                className={editButtonClassName}
              >
                {phoneAction}
              </button>
            </dd>
          </div>

          {email && (
            <div className="flex flex-col gap-y-0.5">
              <dt className="text-sm text-stone-500">Email</dt>
              <dd className="flex items-center gap-x-2 text-lg">
                <span className="min-w-0 wrap-anywhere">{email}</span>
                <CheckCircleIcon className="size-5 shrink-0 text-green-600" />
                <span className="sr-only">подтверждён</span>
              </dd>
            </div>
          )}
        </dl>
      </section>

      <EditProfileModal
        key={editor.key}
        userId={userId}
        profile={profile}
        field={editor.field}
        open={editor.open}
        onClose={closeEditor}
      />
    </>
  );
};

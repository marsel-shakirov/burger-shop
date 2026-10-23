import { useSuspenseQuery } from '@tanstack/react-query';
import { useId, useState } from 'react';

import { profileQueryOptions } from '@/entities/profile';
import { ChangePasswordModal } from '@/features/change-password';
import { EditProfileModal, type ProfileSection } from '@/features/edit-profile';
import { cn } from '@/shared/lib';
import { CheckCircleIcon } from '@/shared/ui/icon';

import { BirthdayPromo } from './birthday-promo';
import { EditActionButton } from './edit-action-button';
import { PersonalSummary } from './personal-summary';

interface Editor {
  section: ProfileSection;
  open: boolean;
  key: number;
}

interface PasswordEditor {
  open: boolean;
  key: number;
}

interface ProfileEditContentProps {
  userId: string;
  email: string | null;
}

export const ProfileEditContent = ({ userId, email }: ProfileEditContentProps) => {
  const { data: profile } = useSuspenseQuery(profileQueryOptions(userId));
  const [editor, setEditor] = useState<Editor>({ section: 'personal', open: false, key: 0 });
  const [passwordEditor, setPasswordEditor] = useState<PasswordEditor>({ open: false, key: 0 });
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const accountTitleId = useId();

  const openEditor = (section: ProfileSection) =>
    setEditor((prev) => ({ section, open: true, key: prev.key + 1 }));

  const closeEditor = () => setEditor((prev) => ({ ...prev, open: false }));

  const openPasswordEditor = () => {
    setIsPasswordChanged(false);
    setPasswordEditor((prev) => ({ open: true, key: prev.key + 1 }));
  };

  const closePasswordEditor = () => setPasswordEditor((prev) => ({ ...prev, open: false }));

  const handlePasswordChanged = () => {
    closePasswordEditor();
    setIsPasswordChanged(true);
  };

  const phoneAction = profile.phone ? 'Изменить' : 'Добавить';

  return (
    <>
      <PersonalSummary profile={profile} onEdit={() => openEditor('personal')} />

      <BirthdayPromo birthDate={profile.birthDate} onAddBirthDate={() => openEditor('personal')} />

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
              <EditActionButton
                onClick={() => openEditor('phone')}
                aria-label={`${phoneAction} телефон`}
              >
                {phoneAction}
              </EditActionButton>
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

          {email && (
            <div className="flex flex-col items-start gap-y-0.5">
              <dt className="text-sm text-stone-500">Пароль</dt>
              <dd className="text-lg tracking-widest">
                <span aria-hidden="true">••••••••••••••</span>
                <span className="sr-only">установлен</span>
              </dd>
              <dd className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <EditActionButton onClick={openPasswordEditor} aria-label="Изменить пароль">
                  Изменить
                </EditActionButton>
                <span role="status" className="text-sm text-green-700">
                  {isPasswordChanged && 'Пароль изменён'}
                </span>
              </dd>
            </div>
          )}
        </dl>
      </section>

      <EditProfileModal
        key={editor.key}
        userId={userId}
        profile={profile}
        section={editor.section}
        open={editor.open}
        onClose={closeEditor}
      />

      {email && (
        <ChangePasswordModal
          key={`password-${passwordEditor.key}`}
          email={email}
          open={passwordEditor.open}
          onClose={closePasswordEditor}
          onChanged={handlePasswordChanged}
        />
      )}
    </>
  );
};

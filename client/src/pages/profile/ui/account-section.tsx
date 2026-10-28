import { useId } from 'react';

import type { EmailNotice } from '@/features/change-email';
import { cn } from '@/shared/lib';
import { CheckCircleIcon } from '@/shared/ui/icon';

import { EditActionButton } from './edit-action-button';

interface AccountSectionProps {
  phone: string | null;
  email: string | null;
  emailNotice: EmailNotice | null;
  isPasswordChanged: boolean;
  onEditPhone: () => void;
  onEditEmail: () => void;
  onEditPassword: () => void;
}

export const AccountSection = ({
  phone,
  email,
  emailNotice,
  isPasswordChanged,
  onEditPhone,
  onEditEmail,
  onEditPassword,
}: AccountSectionProps) => {
  const titleId = useId();
  const phoneAction = phone ? 'Изменить' : 'Добавить';

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-1.5">
        <h2 id={titleId} className="font-display text-lg font-bold">
          Учётные данные
        </h2>
        <p className="text-sm text-stone-500">Нужны для входа и связи по заказам</p>
      </div>

      <dl className="flex flex-col gap-y-5">
        <div className="flex flex-col items-start gap-y-0.5">
          <dt className="text-sm text-stone-500">Телефон</dt>
          <dd className={cn('text-lg tabular-nums', !phone && 'text-stone-400')}>
            {phone ?? 'Не указан'}
          </dd>
          <dd className="mt-1.5">
            <EditActionButton onClick={onEditPhone} aria-label={`${phoneAction} телефон`}>
              {phoneAction}
            </EditActionButton>
          </dd>
        </div>

        {email && (
          <div className="flex flex-col items-start gap-y-0.5">
            <dt className="text-sm text-stone-500">Email</dt>
            <dd className="flex items-center gap-x-2 text-lg">
              <span className="min-w-0 wrap-anywhere">{email}</span>
              <CheckCircleIcon className="size-5 shrink-0 text-green-600" />
              <span className="sr-only">подтверждён</span>
            </dd>
            <dd className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <EditActionButton onClick={onEditEmail} aria-label="Изменить email">
                Изменить
              </EditActionButton>
              <span
                role="status"
                className={cn(
                  'text-sm',
                  emailNotice?.tone === 'error' ? 'text-red-700' : 'text-green-700',
                )}
              >
                {emailNotice?.message}
              </span>
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
              <EditActionButton onClick={onEditPassword} aria-label="Изменить пароль">
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
  );
};

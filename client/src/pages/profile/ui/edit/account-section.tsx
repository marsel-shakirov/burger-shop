import { useId } from 'react';

import type { EmailNotice } from '@/features/change-email';
import { cn } from '@/shared/lib';
import { CheckCircleIcon } from '@/shared/ui/icon';

import { EditActionButton } from './edit-action-button';

const accountRowClassName =
  'grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5 border-t border-stone-200 py-3 first:mt-3 last:pb-0';
const actionClassName = 'col-start-2 row-span-2 row-start-1 self-center';

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
    <section
      aria-labelledby={titleId}
      className="min-w-0 rounded-[1.375rem] border border-stone-200 bg-white p-4 md:p-6"
    >
      <div className="flex flex-col gap-y-1.5">
        <h2 id={titleId} className="font-display text-base font-extrabold md:text-lg">
          Учётные данные
        </h2>
        <p className="text-sm text-stone-600">Для входа и связи по заказам</p>
      </div>

      <dl>
        <div className={accountRowClassName}>
          <dt className="text-xs text-stone-600">Телефон</dt>
          <dd
            className={cn(
              'col-start-1 text-sm wrap-anywhere tabular-nums md:text-base',
              !phone && 'text-stone-600',
            )}
          >
            {phone ?? 'Не указан'}
          </dd>
          <dd className={actionClassName}>
            <EditActionButton onClick={onEditPhone} aria-label={`${phoneAction} телефон`}>
              {phoneAction}
            </EditActionButton>
          </dd>
        </div>

        {email && (
          <div className={accountRowClassName}>
            <dt className="text-xs text-stone-600">Email</dt>
            <dd className="col-start-1 flex min-w-0 items-center gap-x-1.5 text-sm md:text-base">
              <span className="min-w-0 wrap-anywhere">{email}</span>
              <CheckCircleIcon className="size-4 shrink-0 text-green-700" />
              <span className="sr-only">подтверждён</span>
            </dd>
            <dd className={actionClassName}>
              <EditActionButton onClick={onEditEmail} aria-label="Изменить email">
                Изменить
              </EditActionButton>
            </dd>
            <dd className="contents">
              <span
                role="status"
                className={cn(
                  'col-span-2 mt-1 text-sm wrap-anywhere empty:absolute',
                  emailNotice?.tone === 'error' ? 'text-red-700' : 'text-green-700',
                )}
              >
                {emailNotice?.message}
              </span>
            </dd>
          </div>
        )}

        {email && (
          <div className={accountRowClassName}>
            <dt className="text-xs text-stone-600">Пароль</dt>
            <dd className="col-start-1 text-sm tracking-widest md:text-base">
              <span aria-hidden="true">••••••••</span>
              <span className="sr-only">установлен</span>
            </dd>
            <dd className={actionClassName}>
              <EditActionButton onClick={onEditPassword} aria-label="Изменить пароль">
                Изменить
              </EditActionButton>
            </dd>
            <dd className="contents">
              <span role="status" className="col-span-2 mt-1 text-sm text-green-700 empty:absolute">
                {isPasswordChanged && 'Пароль изменён'}
              </span>
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
};

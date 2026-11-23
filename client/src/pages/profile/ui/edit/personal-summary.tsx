import { formatBirthDate, GENDER_LABEL, type Profile } from '@/entities/profile';
import { cn } from '@/shared/lib';

import { ProfileAvatar } from '../profile-avatar';
import { EditActionButton } from './edit-action-button';

interface PersonalSummaryProps {
  profile: Profile;
  onEdit: () => void;
}

export const PersonalSummary = ({ profile, onEdit }: PersonalSummaryProps) => {
  const action = profile.name || profile.birthDate || profile.gender ? 'Изменить' : 'Добавить';

  return (
    <section className="flex min-w-0 items-start gap-3.5 rounded-[1.375rem] border border-stone-200 bg-white p-4 md:gap-5 md:p-6">
      <ProfileAvatar
        name={profile.name}
        className={cn(
          'size-13 rounded-xl md:size-18 md:rounded-[1.125rem] md:text-3xl',
          profile.name && 'bg-mustard',
        )}
      />

      <div className="flex min-w-0 flex-col items-start">
        <h1 className="text-2xl leading-tight font-extrabold wrap-anywhere md:text-[2.125rem]">
          {profile.name || 'Как вас зовут?'}
        </h1>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-stone-600">
          <p>
            {profile.birthDate ? formatBirthDate(profile.birthDate) : 'Дата рождения не указана'}
          </p>
          <p
            className={cn(
              profile.birthDate && profile.gender && 'md:border-l md:border-stone-200 md:pl-3',
            )}
          >
            {profile.gender ? GENDER_LABEL[profile.gender] : 'Пол не указан'}
          </p>
        </div>
        <EditActionButton onClick={onEdit} className="mt-2 text-left">
          {action} личные данные
        </EditActionButton>
      </div>
    </section>
  );
};

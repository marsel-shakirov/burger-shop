import { formatBirthDate, GENDER_LABEL, type Profile } from '@/entities/profile';
import { cn } from '@/shared/lib';

import { EditActionButton } from './edit-action-button';
import { ProfileAvatar } from './profile-avatar';

interface PersonalSummaryProps {
  profile: Profile;
  onEdit: () => void;
}

export const PersonalSummary = ({ profile, onEdit }: PersonalSummaryProps) => {
  const action = profile.name || profile.birthDate || profile.gender ? 'Изменить' : 'Добавить';

  return (
    <section className="flex items-start gap-x-4">
      <ProfileAvatar name={profile.name} className="size-16 text-3xl" />

      <div className="flex min-w-0 flex-col items-start pt-1">
        <h1 className={cn('text-xl wrap-anywhere', !profile.name && 'text-stone-400')}>
          {profile.name || 'Как вас зовут?'}
        </h1>
        <p className={cn('mt-1', !profile.birthDate && 'text-stone-400')}>
          {profile.birthDate ? formatBirthDate(profile.birthDate) : 'Дата рождения не указана'}
        </p>
        <p className={cn('mt-1', !profile.gender && 'text-stone-400')}>
          {profile.gender ? GENDER_LABEL[profile.gender] : 'Пол не указан'}
        </p>
        <EditActionButton onClick={onEdit} aria-label={`${action} личные данные`} className="mt-2">
          {action}
        </EditActionButton>
      </div>
    </section>
  );
};

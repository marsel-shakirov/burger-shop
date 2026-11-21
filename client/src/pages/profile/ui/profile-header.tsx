import { Link } from 'react-router';

import type { Profile } from '@/entities/profile';
import { routes } from '@/shared/config';
import { cn } from '@/shared/lib';

import { ProfileAvatar } from './profile-avatar';

interface ProfileHeaderProps {
  name: Profile['name'];
}

export const ProfileHeader = ({ name }: ProfileHeaderProps) => {
  return (
    <div className="flex min-w-0 items-center gap-3.5 rounded-[1.375rem] border border-stone-200 bg-white p-4 md:gap-5 md:p-6">
      <ProfileAvatar
        name={name}
        className={cn(
          'size-13 rounded-xl md:size-18 md:rounded-[1.125rem] md:text-3xl',
          name && 'bg-mustard',
        )}
      />

      <div className="min-w-0">
        <h1 className="text-[1.5rem] leading-tight font-extrabold wrap-anywhere md:text-[2.125rem]">
          {name || 'Как вас зовут?'}
        </h1>
        <Link
          to={routes.edit}
          className="inline-block rounded-sm py-1 text-sm font-bold text-red-900 underline underline-offset-4 focus-ring hover:text-red-700"
        >
          {name ? 'Изменить личные данные' : 'Добавить личные данные'}
        </Link>
      </div>
    </div>
  );
};

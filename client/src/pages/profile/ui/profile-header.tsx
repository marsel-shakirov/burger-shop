import { Link } from 'react-router';

import type { Profile } from '@/entities/profile';
import { routes } from '@/shared/config';
import { cn } from '@/shared/lib';
import { ArrowIcon } from '@/shared/ui/icon';

import { ProfileAvatar } from './profile-avatar';

interface ProfileHeaderProps {
  name: Profile['name'];
}

export const ProfileHeader = ({ name }: ProfileHeaderProps) => {
  return (
    <div className="group relative flex max-w-full items-center gap-x-3 self-start">
      <ProfileAvatar name={name} />

      <h1 className="min-w-0 truncate text-xl">
        <Link
          to={routes.edit}
          className={cn(
            'after:absolute after:-inset-2 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-amber-600 focus-visible:after:ring-offset-2',
            !name && 'text-stone-400',
          )}
        >
          {name || 'Как вас зовут?'}
        </Link>
      </h1>

      <ArrowIcon className="size-3.5 shrink-0 rotate-180 text-stone-400 transition-colors duration-150 group-hover:text-stone-900" />
    </div>
  );
};

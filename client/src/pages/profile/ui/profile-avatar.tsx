import type { Profile } from '@/entities/profile';
import { cn } from '@/shared/lib';
import { ProfileIcon } from '@/shared/ui/icon';

interface ProfileAvatarProps {
  name: Profile['name'];
  className?: string;
}

export const ProfileAvatar = ({ name, className }: ProfileAvatarProps) => {
  const initial = name?.trim().charAt(0).toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid size-14 shrink-0 place-items-center rounded-2xl',
        initial
          ? 'bg-orange-200 font-display text-2xl font-extrabold text-stone-900'
          : 'bg-stone-100 text-stone-400',
        className,
      )}
    >
      {initial || <ProfileIcon className="size-7" />}
    </span>
  );
};

import { useSuspenseQuery } from '@tanstack/react-query';

import { profileQueryOptions } from '@/entities/profile';

import { BonusCard } from './bonus-card';
import { ProfileHeader } from './profile-header';
import { ProfileShortcuts } from './profile-shortcuts';

interface ProfileContentProps {
  userId: string;
}

export const ProfileContent = ({ userId }: ProfileContentProps) => {
  const { data: profile } = useSuspenseQuery(profileQueryOptions(userId));

  return (
    <div className="grid items-start gap-y-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-x-9 md:gap-y-6">
      <ProfileHeader name={profile.name} />
      <div className="min-w-0 md:col-start-2 md:row-span-2 md:row-start-1">
        <BonusCard />
      </div>
      <ProfileShortcuts />
    </div>
  );
};

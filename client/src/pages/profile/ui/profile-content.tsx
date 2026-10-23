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
    <>
      <ProfileHeader name={profile.name} />
      <ProfileShortcuts />
      <BonusCard />
    </>
  );
};

import { useSuspenseQuery } from '@tanstack/react-query';

import { profileQueryOptions } from '@/entities/profile';

import { ProfileHeader } from './profile-header';
interface ProfileContentProps {
  userId: string;
}

export const ProfileContent = ({ userId }: ProfileContentProps) => {
  const { data: profile } = useSuspenseQuery(profileQueryOptions(userId));

  return (
    <>
      <ProfileHeader name={profile.name} />
    </>
  );
};

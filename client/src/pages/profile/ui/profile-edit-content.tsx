import { useSuspenseQuery } from '@tanstack/react-query';

import { profileQueryOptions } from '@/entities/profile';
import { EditProfile } from '@/features/edit-profile/ui/edit-profile';

interface ProfileEditContentProps {
  userId: string;
}

export const ProfileEditContent = ({ userId }: ProfileEditContentProps) => {
  const { data: profile } = useSuspenseQuery(profileQueryOptions(userId));

  return <EditProfile userId={userId} profile={profile} />;
};

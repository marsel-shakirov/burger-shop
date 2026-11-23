import { useSessionUser } from '@/entities/session';
import { SignOutButton } from '@/features/sign-out';
import { Container } from '@/shared/ui/container';
import { PageMeta } from '@/shared/ui/page-meta';

import { ProfileContentBoundary } from '../profile-content-boundary';
import { ProfileContent } from './profile-content';
import { ProfileSkeleton } from './profile-skeleton';

export const ProfilePage = () => {
  const user = useSessionUser();

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-1 bg-paper text-stone-900">
      <PageMeta title="Профиль" noindex />
      <Container className="max-w-260 px-4 pt-7 pb-10 sm:px-8 md:pt-16 md:pb-20">
        <ProfileContentBoundary userId={user.id} fallback={<ProfileSkeleton />}>
          <ProfileContent userId={user.id} />
        </ProfileContentBoundary>
        <SignOutButton className="mt-5 items-start md:mt-7" />
      </Container>
    </main>
  );
};

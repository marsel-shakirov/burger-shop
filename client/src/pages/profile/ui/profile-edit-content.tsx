import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { profileQueryOptions } from '@/entities/profile';
import { ChangePasswordModal } from '@/features/change-password';
import { EditProfileModal, type ProfileSection } from '@/features/edit-profile';

import { useRemountableModal } from '../model/use-remountable-modal';
import { AccountSection } from './account-section';
import { BirthdayPromo } from './birthday-promo';
import { PersonalSummary } from './personal-summary';

interface ProfileEditContentProps {
  userId: string;
  email: string | null;
}

export const ProfileEditContent = ({ userId, email }: ProfileEditContentProps) => {
  const { data: profile } = useSuspenseQuery(profileQueryOptions(userId));
  const profileModal = useRemountableModal();
  const passwordModal = useRemountableModal();
  const [section, setSection] = useState<ProfileSection>('personal');
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  const openProfileEditor = (nextSection: ProfileSection) => {
    setSection(nextSection);
    profileModal.openModal();
  };

  const openPasswordEditor = () => {
    setIsPasswordChanged(false);
    passwordModal.openModal();
  };

  const handlePasswordChanged = () => {
    passwordModal.closeModal();
    setIsPasswordChanged(true);
  };

  return (
    <>
      <PersonalSummary profile={profile} onEdit={() => openProfileEditor('personal')} />

      <BirthdayPromo
        birthDate={profile.birthDate}
        onAddBirthDate={() => openProfileEditor('personal')}
      />

      <hr className="border-dashed border-stone-300" />

      <AccountSection
        phone={profile.phone}
        email={email}
        isPasswordChanged={isPasswordChanged}
        onEditPhone={() => openProfileEditor('phone')}
        onEditPassword={openPasswordEditor}
      />

      <EditProfileModal
        key={profileModal.key}
        userId={userId}
        profile={profile}
        section={section}
        open={profileModal.open}
        onClose={profileModal.closeModal}
      />

      {email && (
        <ChangePasswordModal
          key={`password-${passwordModal.key}`}
          email={email}
          open={passwordModal.open}
          onClose={passwordModal.closeModal}
          onChanged={handlePasswordChanged}
        />
      )}
    </>
  );
};

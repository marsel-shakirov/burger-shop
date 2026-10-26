import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { profileQueryOptions } from '@/entities/profile';
import { ChangeEmailModal } from '@/features/change-email';
import { ChangePasswordModal } from '@/features/change-password';
import { EditProfileModal, type ProfileSection } from '@/features/edit-profile';

import { useEmailChangeNotice } from '../model/use-email-change-notice';
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
  const emailModal = useRemountableModal();
  const passwordModal = useRemountableModal();
  const { notice: emailNotice, markRequested: markEmailRequested } = useEmailChangeNotice();
  const [section, setSection] = useState<ProfileSection>('personal');
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  const openProfileEditor = (nextSection: ProfileSection) => {
    setSection(nextSection);
    profileModal.openModal();
  };

  const handleEmailRequested = (newEmail: string) => {
    emailModal.closeModal();
    markEmailRequested(newEmail);
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
        emailNotice={emailNotice}
        isPasswordChanged={isPasswordChanged}
        onEditPhone={() => openProfileEditor('phone')}
        onEditEmail={emailModal.openModal}
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
        <ChangeEmailModal
          key={`email-${emailModal.key}`}
          email={email}
          open={emailModal.open}
          onClose={emailModal.closeModal}
          onRequested={handleEmailRequested}
        />
      )}

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

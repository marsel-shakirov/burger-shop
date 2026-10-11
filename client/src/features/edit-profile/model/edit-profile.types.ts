import type { Profile } from '@/entities/profile';

export type ProfileSection = 'personal' | 'phone';

export type ProfileFormField = keyof Profile;

export type ProfileUpdate = Partial<Profile>;

export interface ProfileFormError {
  message: string;
  field?: ProfileFormField;
}

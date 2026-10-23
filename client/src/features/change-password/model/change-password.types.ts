export type PasswordFormField = 'currentPassword' | 'newPassword' | 'confirmPassword';

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordFormError {
  message: string;
  field?: PasswordFormField;
}

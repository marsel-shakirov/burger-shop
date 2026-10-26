export type EmailFormField = 'newEmail' | 'currentPassword';

export interface EmailChange {
  newEmail: string;
  currentPassword: string;
}

export interface EmailFormError {
  message: string;
  field?: EmailFormField;
}

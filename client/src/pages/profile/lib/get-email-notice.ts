import type { EmailChangeStatus, EmailNotice } from '../model/email-change.types';

interface EmailNoticeSource {
  pendingEmail: string | null;
  status: EmailChangeStatus | null;
}

export const getEmailNotice = ({ pendingEmail, status }: EmailNoticeSource): EmailNotice | null => {
  if (pendingEmail) {
    return {
      message: `Письма отправлены на текущий адрес и ${pendingEmail}. Подтвердите смену по ссылкам из обоих писем`,
      tone: 'success',
    };
  }

  switch (status) {
    case 'changed':
      return { message: 'Email изменён', tone: 'success' };
    case 'confirm_other':
      return {
        message: 'Первая ссылка подтверждена. Осталось перейти по ссылке из второго письма',
        tone: 'success',
      };
    case 'failed':
      return {
        message: 'Не удалось подтвердить смену email. Запросите письмо ещё раз',
        tone: 'error',
      };
    default:
      return null;
  }
};

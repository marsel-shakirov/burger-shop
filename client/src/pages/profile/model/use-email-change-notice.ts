import { useState } from 'react';

import { useUpdateSearchParams } from '@/shared/lib';

import { EMAIL_CHANGE_PARAM } from '../config/profile.constants';
import { getEmailNotice } from '../lib/get-email-notice';
import { parseEmailChangeStatus } from '../lib/parse-email-change-status';

export const useEmailChangeNotice = () => {
  const [searchParams, updateParams] = useUpdateSearchParams();
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const notice = getEmailNotice({ pendingEmail, status: parseEmailChangeStatus(searchParams) });

  const markRequested = (newEmail: string) => {
    setPendingEmail(newEmail);
    updateParams((next) => next.delete(EMAIL_CHANGE_PARAM));
  };

  return { notice, markRequested };
};

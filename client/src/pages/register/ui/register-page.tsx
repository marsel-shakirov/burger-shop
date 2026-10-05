import { useState } from 'react';
import { Navigate } from 'react-router';

import { selectIsAuthenticated, useSessionStore } from '@/entities/session';
import { SignUpForm } from '@/features/sign-up';
import { routes } from '@/shared/config';
import { PageMeta } from '@/shared/ui/page-meta';
import { AuthCard } from '@/widgets/auth-card';

import { CheckEmail } from './check-email';

export const RegisterPage = () => {
  const isAuthenticated = useSessionStore(selectIsAuthenticated);
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={routes.profile} replace />;
  }

  const handleEmailSent = (sentEmail: string) => {
    setEmail(sentEmail);
    setIsEmailSent(true);
  };

  return (
    <>
      <PageMeta title="Регистрация" noindex />

      <AuthCard
        switchPrompt="Уже есть профиль?"
        switchLinkTo={routes.login}
        switchLinkLabel="Войти"
      >
        {isEmailSent ? (
          <CheckEmail email={email} onChangeEmail={() => setIsEmailSent(false)} />
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl">Новый профиль</h1>
            <SignUpForm defaultEmail={email} onEmailSent={handleEmailSent} />
          </>
        )}
      </AuthCard>
    </>
  );
};

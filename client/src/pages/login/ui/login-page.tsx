import { Navigate } from 'react-router';

import { selectIsAuthenticated, useSessionStore } from '@/entities/session';
import { SignInForm } from '@/features/sign-in';
import { routes } from '@/shared/config';
import { PageMeta } from '@/shared/ui/page-meta';
import { AuthCard } from '@/widgets/auth-card';

export const LoginPage = () => {
  const isAuthenticated = useSessionStore(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={routes.profile} replace />;
  }

  return (
    <>
      <PageMeta title="Вход" noindex />

      <AuthCard
        switchPrompt="Ещё нет профиля?"
        switchLinkTo={routes.register}
        switchLinkLabel="Создать профиль"
      >
        <h1 className="text-2xl sm:text-3xl">Вход в профиль</h1>
        <SignInForm />
      </AuthCard>
    </>
  );
};

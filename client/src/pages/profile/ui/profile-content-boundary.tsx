import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { type ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ProfileError } from './profile-error';

interface ProfileContentBoundaryProps {
  userId: string;
  fallback: ReactNode;
  children: ReactNode;
}

export const ProfileContentBoundary = ({
  userId,
  fallback,
  children,
}: ProfileContentBoundaryProps) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      resetKeys={[userId]}
      fallbackRender={(props) => (
        <div className="max-w-md rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
          <ProfileError {...props} />
        </div>
      )}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};

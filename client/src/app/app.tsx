import './styles/index.css';

import { QueryProvider } from './providers/query-provider';
import { SessionProvider } from './providers/session-provider';
import { AppRouter } from './router/app-router';

export const App = () => {
  return (
    <QueryProvider>
      <SessionProvider>
        <AppRouter />
      </SessionProvider>
    </QueryProvider>
  );
};

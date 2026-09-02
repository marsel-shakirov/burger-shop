import './styles/index.css';

import { QueryProvider } from './providers/query-provider.tsx';
import { AppRouter } from './router/app-router.tsx';

export const App = () => {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
};

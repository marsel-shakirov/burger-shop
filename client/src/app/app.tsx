import './styles/index.css';

import { QueryProvider } from './providers/query-provider';
import { AppRouter } from './router/app-router';

export const App = () => {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
};

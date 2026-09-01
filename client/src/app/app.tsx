import './styles/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppRouter } from './router/app-router.tsx';

export const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
};

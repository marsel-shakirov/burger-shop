import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router';

interface WrapperOptions {
  queryClient?: QueryClient;
  initialEntries?: string[];
}

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

export const createWrapper = ({
  queryClient = createTestQueryClient(),
  initialEntries = ['/'],
}: WrapperOptions = {}) => {
  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );

  return Wrapper;
};

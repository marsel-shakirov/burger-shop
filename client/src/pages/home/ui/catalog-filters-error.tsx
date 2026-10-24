import type { FallbackProps } from 'react-error-boundary';

import { isNetworkError } from '@/shared/api';
import { LoadError } from '@/shared/ui/load-error';

export const CatalogFiltersError = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <LoadError
      message={
        isNetworkError(error) ? 'Нет связи с сервером, меню не загрузилось' : 'Меню не загрузилось'
      }
      onRetry={resetErrorBoundary}
    />
  );
};

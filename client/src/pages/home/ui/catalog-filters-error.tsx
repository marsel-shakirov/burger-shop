import { isNetworkError } from '@/shared/api';
import { LoadError } from '@/shared/ui/load-error';

interface CatalogFiltersErrorProps {
  error: Error;
  onRetry: () => void;
}

export const CatalogFiltersError = ({ error, onRetry }: CatalogFiltersErrorProps) => {
  return (
    <LoadError
      message={
        isNetworkError(error) ? 'Нет связи с сервером, меню не загрузилось' : 'Меню не загрузилось'
      }
      onRetry={onRetry}
    />
  );
};

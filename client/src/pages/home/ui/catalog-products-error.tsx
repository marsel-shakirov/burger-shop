import { isNetworkError } from '@/shared/api';
import { LoadError } from '@/shared/ui/load-error';

interface CatalogProductsErrorProps {
  error: Error;
  onRetry: () => void;
}

export const CatalogProductsError = ({ error, onRetry }: CatalogProductsErrorProps) => {
  return (
    <LoadError
      message={
        isNetworkError(error)
          ? 'Нет связи с сервером, товары не загрузились'
          : 'Товары не загрузились'
      }
      onRetry={onRetry}
      className="py-5 sm:py-8"
    />
  );
};

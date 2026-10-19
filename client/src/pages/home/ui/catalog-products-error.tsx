import { isNetworkError } from '@/shared/api';

interface CatalogProductsErrorProps {
  error: Error;
  onRetry: () => void;
}

export const CatalogProductsError = ({ error, onRetry }: CatalogProductsErrorProps) => {
  return (
    <div role="alert" className="flex items-center justify-between gap-x-4 py-5 sm:py-8">
      <p className="text-balance text-stone-500">
        {isNetworkError(error)
          ? 'Нет связи с сервером, товары не загрузились'
          : 'Товары не загрузились'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="h-10 shrink-0 cursor-pointer rounded-md bg-orange-500 px-4 font-bold text-stone-900 focus-ring transition-colors duration-150 hover:bg-orange-600"
      >
        Повторить
      </button>
    </div>
  );
};

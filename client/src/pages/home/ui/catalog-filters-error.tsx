import type { FallbackProps } from 'react-error-boundary';

import { isNetworkError } from '@/shared/api';

export const CatalogFiltersError = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert" className="flex items-center justify-between gap-x-4 pt-2.5 sm:pt-5">
      <p className="text-balance text-stone-500">
        {isNetworkError(error)
          ? 'Нет связи с сервером, меню не загрузилось'
          : 'Меню не загрузилось'}
      </p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="h-10 shrink-0 cursor-pointer rounded-md bg-orange-500 px-4 font-bold text-stone-900 focus-ring transition-colors duration-150 hover:bg-orange-600"
      >
        Повторить
      </button>
    </div>
  );
};

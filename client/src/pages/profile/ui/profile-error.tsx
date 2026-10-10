import type { FallbackProps } from 'react-error-boundary';

import { isNetworkError } from '@/shared/api';

export const ProfileError = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert" className="flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-lg font-bold">Профиль не загрузился</h2>
        <p className="text-balance text-stone-500">
          {isNetworkError(error)
            ? 'Нет связи с сервером. Проверьте интернет и загрузите снова'
            : 'Сервер не смог отдать данные профиля. Попробуйте загрузить снова'}
        </p>
      </div>

      <div className="border-t border-dashed border-stone-300 pt-5">
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="h-12 w-full cursor-pointer rounded-md bg-orange-500 font-bold text-stone-900 focus-ring transition-colors duration-150 hover:bg-orange-600"
        >
          Загрузить снова
        </button>
      </div>
    </div>
  );
};

import { Link } from 'react-router';

import { routes } from '@/shared/routes';
import { Container } from '@/shared/ui/container';
import { NotFoundIcon } from '@/shared/ui/icon';

export const NotFoundPage = () => {
  return (
    <main className="flex h-screen">
      <Container className="flex flex-1">
        <div className="flex flex-col items-center justify-center gap-y-3 px-28 text-center">
          <NotFoundIcon className="h-48 w-48" />
          <h1 className="text-5xl font-extrabold">Ошибка 404</h1>
          <p className="text-lg">
            Кажется что-то пошло не так! Страница, которую вы запрашиваете, не существует. Возможно
            она устарела, была удалена, или был введен неверный адрес в адресной стоке.
          </p>
          <Link
            to={routes.home}
            className="flex cursor-pointer items-center justify-center gap-x-2 rounded-4xl bg-gray-900 p-4 font-bold text-white"
          >
            <span>Перейти на главную страницу</span>
          </Link>
        </div>
      </Container>
    </main>
  );
};

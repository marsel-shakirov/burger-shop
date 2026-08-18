import { BrowserRouter, Route, Routes } from 'react-router';

import { CartPage } from '@/pages/cart';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { routes } from '@/shared/routes';

import { AppLayout } from '../layouts/AppLayout';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path={routes.cart} element={<CartPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

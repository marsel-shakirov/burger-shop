import { BrowserRouter, Route, Routes } from 'react-router';

import { CartPage } from '@/pages/cart';
import { FavoritePage } from '@/pages/favorite';
import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/login';
import { NotFoundPage } from '@/pages/not-found';
import { Profile } from '@/pages/profile';
import { RegisterPage } from '@/pages/register';
import { routes } from '@/shared/config';

import { AppLayout } from '../layouts/app-layout';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path={routes.cart} element={<CartPage />} />
          <Route path={routes.favorites} element={<FavoritePage />} />
          <Route path={routes.profile} element={<Profile />} />
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.register} element={<RegisterPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

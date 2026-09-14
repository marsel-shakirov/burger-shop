import { BrowserRouter, Route, Routes } from 'react-router';

import { Favorite } from '@/pages/favorite';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { Profile } from '@/pages/profile';
import { routes } from '@/shared/routes';

import { AppLayout } from '../layouts/app-layout';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path={routes.cart} element={<Favorite />} />
          <Route path={routes.favorites} element={<Favorite />} />
          <Route path={routes.profile} element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

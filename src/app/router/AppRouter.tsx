import { BrowserRouter, Route, Routes } from 'react-router';

import { CartPage } from '@/pages/cart';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';

import { AppLayout } from '../layouts/AppLayout';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

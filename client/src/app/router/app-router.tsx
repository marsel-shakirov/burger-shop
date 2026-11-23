import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

import { CartPage } from '@/pages/cart';
import { FavoritePage } from '@/pages/favorite';
import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/login';
import { NotFoundPage } from '@/pages/not-found';
import { RegisterPage } from '@/pages/register';
import { routes } from '@/shared/config';

import { AppLayout } from '../layouts/app-layout';
import { RequireAuth } from './require-auth';
import { RequireGuest } from './require-guest';

const CheckoutPage = lazy(() =>
  import('@/pages/checkout').then(({ CheckoutPage }) => ({ default: CheckoutPage })),
);

const OrderHistoryPage = lazy(() =>
  import('@/pages/order-history').then(({ OrderHistoryPage }) => ({ default: OrderHistoryPage })),
);

const OrderDetailsPage = lazy(() =>
  import('@/pages/order-details').then(({ OrderDetailsPage }) => ({ default: OrderDetailsPage })),
);

const ProfilePage = lazy(() =>
  import('@/pages/profile').then(({ ProfilePage }) => ({ default: ProfilePage })),
);

const ProfileEditPage = lazy(() =>
  import('@/pages/profile').then(({ ProfileEditPage }) => ({ default: ProfileEditPage })),
);

const pageFallback = <p role="status">Загружаем страницу…</p>;

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path={routes.cart} element={<CartPage />} />
          <Route path={routes.favorites} element={<FavoritePage />} />
          <Route element={<RequireAuth />}>
            <Route
              path={routes.checkout}
              element={
                <Suspense fallback={pageFallback}>
                  <CheckoutPage />
                </Suspense>
              }
            />
            <Route
              path={routes.profile}
              element={
                <Suspense fallback={pageFallback}>
                  <ProfilePage />
                </Suspense>
              }
            />
            <Route
              path={routes.edit}
              element={
                <Suspense fallback={pageFallback}>
                  <ProfileEditPage />
                </Suspense>
              }
            />
            <Route
              path={routes.orders}
              element={
                <Suspense fallback={pageFallback}>
                  <OrderHistoryPage />
                </Suspense>
              }
            />
            <Route
              path={routes.orderDetails}
              element={
                <Suspense fallback={pageFallback}>
                  <OrderDetailsPage />
                </Suspense>
              }
            />
          </Route>
          <Route element={<RequireGuest />}>
            <Route path={routes.login} element={<LoginPage />} />
            <Route path={routes.register} element={<RegisterPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

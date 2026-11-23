import { generatePath } from 'react-router';

export const routes = {
  home: '/',
  cart: '/cart',
  checkout: '/checkout',
  favorites: '/favorites',
  profile: '/profile',
  login: '/profile/login',
  register: '/profile/register',
  edit: '/profile/edit',
  orders: '/profile/orders',
  orderDetails: '/profile/orders/:id',
} as const;

export const getOrderPath = (orderId: string) => generatePath(routes.orderDetails, { id: orderId });
